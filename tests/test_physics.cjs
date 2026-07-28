const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const physicsScript = path.resolve(__dirname, '../src/static/js/physics.js');

function loadPhysics() {
  const context = vm.createContext({
    document: {
      addEventListener() {},
    },
  });

  vm.runInContext(fs.readFileSync(physicsScript, 'utf8'), context, {
    filename: physicsScript,
  });

  return vm.runInContext('globalThis.ResumePhysics', context);
}

test('physics script exposes the public calculation seam', () => {
  const physics = loadPhysics();

  assert.ok(physics, 'expected globalThis.ResumePhysics');
  assert.equal(typeof physics.calcProbs, 'function');
  assert.equal(typeof physics.advanceLE, 'function');
  assert.ok(physics.PRESETS && typeof physics.PRESETS === 'object');
  assert.ok(Object.keys(physics.PRESETS).length > 0);
});

test('physical presets share measured parameters but use distinct L/E ranges', () => {
  const { solar, atmospheric } = loadPhysics().PRESETS;

  for (const preset of [solar, atmospheric]) {
    assert.equal(preset.theta12Degrees, 33.41);
    assert.equal(preset.theta13Degrees, 8.54);
    assert.equal(preset.theta23Degrees, 49.1);
    assert.equal(preset.deltaCPDegrees, 197);
    assert.equal(preset.dm2_21, 7.41e-5);
    assert.equal(preset.dm2_31, 2.511e-3);
  }
  assert.notEqual(solar.leMax, atmospheric.leMax);
  assert.notEqual(solar.leDefault, atmospheric.leDefault);
});

test('zero baseline and no mixing preserve the initial flavour', () => {
  const { PRESETS, calcProbs } = loadPhysics();

  for (const initial of ['e', 'm', 't']) {
    for (const [preset, lOverE] of [
      [PRESETS.solar, 0],
      [PRESETS['no-mixing'], 30000],
    ]) {
      const probabilities = calcProbs(preset, lOverE, initial);

      for (const final of ['e', 'm', 't']) {
        assert.ok(Math.abs(probabilities[final] - (final === initial ? 1 : 0)) <= 1e-12);
      }
    }
  }
});

test('three-flavour probabilities remain finite, bounded, and normalized', () => {
  const { PRESETS, calcProbs } = loadPhysics();

  for (const [presetKey, preset] of Object.entries(PRESETS)) {
    for (const initial of ['e', 'm', 't']) {
      for (const lOverE of [0, 0.5, 100, 500, 1000, preset.leMax]) {
        const probabilities = calcProbs(preset, lOverE, initial);
        const values = [probabilities.e, probabilities.m, probabilities.t];

        for (const value of values) {
          assert.equal(typeof value, 'number', `${presetKey} at L/E=${lOverE} is not numeric`);
          assert.ok(Number.isFinite(value), `${presetKey} at L/E=${lOverE} is not finite`);
          assert.ok(value >= 0 && value <= 1, `${presetKey} at L/E=${lOverE} is out of range`);
        }
        assert.ok(
          Math.abs(values.reduce((sum, value) => sum + value, 0) - 1) <= 1e-12,
          `${presetKey} ${initial} probabilities are not normalized`,
        );
      }
    }
  }
});

test('representative transition matches an independent PMNS reference', () => {
  const { PRESETS, calcProbs } = loadPhysics();
  const probabilities = calcProbs(PRESETS.atmospheric, 500, 'e');
  const expected = {
    e: 0.911999700184674,
    m: 0.046241008798572,
    t: 0.041759291016753,
  };

  for (const flavour of ['e', 'm', 't']) {
    assert.ok(Math.abs(probabilities[flavour] - expected[flavour]) <= 1e-12);
  }
});

test('automatic playback advances and wraps the L/E value', () => {
  const physics = loadPhysics();

  assert.equal(physics.advanceLE(0, 1000, 2000), 100);
  assert.equal(physics.advanceLE(1990, 1000, 2000), 90);
});
