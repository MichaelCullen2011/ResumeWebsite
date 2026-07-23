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
  assert.ok(physics.PRESETS && typeof physics.PRESETS === 'object');
  assert.ok(Object.keys(physics.PRESETS).length > 0);
});

test('representative calculations match deterministic reference outputs', () => {
  const physics = loadPhysics();
  assert.ok(physics, 'expected globalThis.ResumePhysics');
  const { PRESETS, calcProbs } = physics;
  const expected = {
    solar: { e: 0.5000001916514354, m: 0.49999980834856467, t: 0 },
    atmospheric: { e: 0.5005922306809322, m: 0.4994077693190678, t: 0 },
    maximum: { e: 0.4999958703194454, m: 0.5000041296805546, t: 0 },
  };

  for (const [presetKey, expectedProbabilities] of Object.entries(expected)) {
    const probabilities = calcProbs(PRESETS[presetKey], 42.5);

    for (const flavour of ['e', 'm', 't']) {
      assert.ok(
        Math.abs(probabilities[flavour] - expectedProbabilities[flavour]) <= 1e-12,
        `${presetKey} ${flavour} probability changed`,
      );
    }
  }
});

test('all presets return finite probabilities in range and normalized', () => {
  const physics = loadPhysics();
  assert.ok(physics, 'expected globalThis.ResumePhysics');
  const { PRESETS, calcProbs } = physics;
  const lOverEValues = [0, 0.5, 10, 100, 1000];

  for (const [presetKey, preset] of Object.entries(PRESETS)) {
    for (const lOverE of lOverEValues) {
      const probabilities = calcProbs(preset, lOverE);
      const values = [probabilities.e, probabilities.m, probabilities.t];

      for (const value of values) {
        assert.equal(typeof value, 'number', `${presetKey} at L/E=${lOverE} is not numeric`);
        assert.ok(Number.isFinite(value), `${presetKey} at L/E=${lOverE} is not finite`);
        assert.ok(value >= 0 && value <= 1, `${presetKey} at L/E=${lOverE} is out of range`);
      }

      assert.ok(
        Math.abs(values.reduce((sum, value) => sum + value, 0) - 1) <= 1e-9,
        `${presetKey} at L/E=${lOverE} is not normalized`,
      );
    }
  }
});
