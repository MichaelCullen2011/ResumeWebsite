(function () {

  // ── Physics ───────────────────────────────────────────────
  const DEG = Math.PI / 180;
  const OSCILLATION_PHASE = 2 * 1.267;
  const FLAVOURS = Object.freeze({ e: 0, m: 1, t: 2 });

  // NuFIT 5.2 (2022), normal ordering, without SK-atmospheric data.
  const MEASURED_PARAMETERS = Object.freeze({
    theta12Degrees: 33.41,
    theta13Degrees: 8.54,
    theta23Degrees: 49.1,
    deltaCPDegrees: 197,
    dm2_21: 7.41e-5,
    dm2_31: 2.511e-3,
  });

  const PRESETS = {
    'no-mixing': {
      label: 'No Mixing',
      theta12Degrees: 0,
      theta13Degrees: 0,
      theta23Degrees: 0,
      deltaCPDegrees: 0,
      dm2_21: MEASURED_PARAMETERS.dm2_21,
      dm2_31: MEASURED_PARAMETERS.dm2_31,
      leDefault: 500,
      leMax: 4000,
    },
    'solar': {
      label: 'Solar Neutrinos',
      ...MEASURED_PARAMETERS,
      leDefault: 15000,
      leMax: 60000,
    },
    'atmospheric': {
      label: 'Atmospheric Neutrinos',
      ...MEASURED_PARAMETERS,
      leDefault: 500,
      leMax: 4000,
    },
    'maximum': {
      label: 'Maximum Mixing',
      theta12Degrees: 45,
      theta13Degrees: 45,
      theta23Degrees: 45,
      deltaCPDegrees: 0,
      dm2_21: MEASURED_PARAMETERS.dm2_21,
      dm2_31: MEASURED_PARAMETERS.dm2_31,
      leDefault: 500,
      leMax: 4000,
    },
  };

  function multiply(a, b) {
    return {
      re: a.re * b.re - a.im * b.im,
      im: a.re * b.im + a.im * b.re,
    };
  }

  function conjugate(value) {
    return { re: value.re, im: -value.im };
  }

  function real(value) {
    return { re: value, im: 0 };
  }

  function polar(angle) {
    return { re: Math.cos(angle), im: Math.sin(angle) };
  }

  function add(...values) {
    return values.reduce(
      (sum, value) => ({ re: sum.re + value.re, im: sum.im + value.im }),
      { re: 0, im: 0 },
    );
  }

  function scale(value, factor) {
    return { re: value.re * factor, im: value.im * factor };
  }

  function pmnsMatrix(preset) {
    const theta12 = preset.theta12Degrees * DEG;
    const theta13 = preset.theta13Degrees * DEG;
    const theta23 = preset.theta23Degrees * DEG;
    const deltaCP = preset.deltaCPDegrees * DEG;
    const s12 = Math.sin(theta12), c12 = Math.cos(theta12);
    const s13 = Math.sin(theta13), c13 = Math.cos(theta13);
    const s23 = Math.sin(theta23), c23 = Math.cos(theta23);
    const positiveDelta = polar(deltaCP);
    const negativeDelta = polar(-deltaCP);

    return [
      [
        real(c12 * c13),
        real(s12 * c13),
        scale(negativeDelta, s13),
      ],
      [
        add(real(-s12 * c23), scale(positiveDelta, -c12 * s23 * s13)),
        add(real(c12 * c23), scale(positiveDelta, -s12 * s23 * s13)),
        real(s23 * c13),
      ],
      [
        add(real(s12 * s23), scale(positiveDelta, -c12 * c23 * s13)),
        add(real(-c12 * s23), scale(positiveDelta, -s12 * c23 * s13)),
        real(c23 * c13),
      ],
    ];
  }

  function transitionProbability(matrix, masses, initial, final, lOverE) {
    const amplitude = masses.reduce((sum, massSquared, index) => {
      const mixing = multiply(matrix[final][index], conjugate(matrix[initial][index]));
      const propagation = polar(-OSCILLATION_PHASE * massSquared * lOverE);
      return add(sum, multiply(mixing, propagation));
    }, { re: 0, im: 0 });

    return amplitude.re * amplitude.re + amplitude.im * amplitude.im;
  }

  // Vacuum propagation for three active flavours:
  // A(να→νβ) = Σᵢ Uβᵢ exp[-i Δm²ᵢ1 L/(2E)] U*αᵢ.
  function calcProbs(preset, lOverE, initialFlavour = 'e') {
    const initial = FLAVOURS[initialFlavour];
    if (initial === undefined) throw new RangeError(`Unknown initial flavour: ${initialFlavour}`);

    const matrix = pmnsMatrix(preset);
    const masses = [0, preset.dm2_21, preset.dm2_31];
    const values = [0, 1, 2].map(final => (
      Math.min(1, Math.max(
        0,
        transitionProbability(matrix, masses, initial, final, lOverE),
      ))
    ));

    return { e: values[0], m: values[1], t: values[2] };
  }

  const PLAYBACK_CYCLE_MS = 20000;
  function advanceLE(current, elapsedMs, max) {
    return (current + (elapsedMs / PLAYBACK_CYCLE_MS) * max) % max;
  }

  // Pure calculation seam shared by the browser and deterministic release checks.
  globalThis.ResumePhysics = Object.freeze({ PRESETS, calcProbs, advanceLE });

  // ── Canvas / Triangle geometry ────────────────────────────
  const COLOURS = {
    e: '#7d4c67',  // burgundy — νe top
    m: '#C8963E',  // amber    — νμ bottom-left
    t: '#4A7C9C',  // slate    — ντ bottom-right
  };

  let canvas, ctx, W, H;
  let triVerts;       // [{x,y}] top, bl, br
  let currentPreset   = PRESETS.maximum;
  let LE              = currentPreset.leDefault;
  let dotPos          = { x: 0, y: 0 };
  let tail            = [];     // recent positions for fading tail
  let wantsPlayback   = true;
  let frameId         = null;
  let previousTime    = null;
  let reducedMotion;
  let slider, leVal, playbackButton, playbackStatus;

  function resize() {
    const size = Math.min(canvas.parentElement.clientWidth, 500);
    canvas.width = canvas.height = size;
    W = H = size;
    const cx = W / 2, cy = H / 2;
    const r  = W * 0.38;
    triVerts = [
      { x: cx,           y: cy - r },                          // top — νe
      { x: cx - r * 0.866, y: cy + r * 0.5 },                 // bottom-left — νμ
      { x: cx + r * 0.866, y: cy + r * 0.5 },                 // bottom-right — ντ
    ];
  }

  function barycentricToXY(e, m, t) {
    return {
      x: e * triVerts[0].x + m * triVerts[1].x + t * triVerts[2].x,
      y: e * triVerts[0].y + m * triVerts[1].y + t * triVerts[2].y,
    };
  }

  function drawTriangle() {
    const grad = ctx.createLinearGradient(triVerts[2].x, triVerts[0].y, triVerts[1].x, triVerts[2].y);
    grad.addColorStop(0, 'rgba(125,76,103,0.18)');
    grad.addColorStop(0.5, 'rgba(26,26,46,0.05)');
    grad.addColorStop(1, 'rgba(74,124,156,0.18)');

    ctx.beginPath();
    ctx.moveTo(triVerts[0].x, triVerts[0].y);
    ctx.lineTo(triVerts[1].x, triVerts[1].y);
    ctx.lineTo(triVerts[2].x, triVerts[2].y);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();

    const labels = [
      { v: triVerts[0], text: 'νe',  col: COLOURS.e, dy: -14 },
      { v: triVerts[1], text: 'νμ',  col: COLOURS.m, dy:  22, dx: -10 },
      { v: triVerts[2], text: 'ντ',  col: COLOURS.t, dy:  22, dx:  10 },
    ];
    ctx.font = 'italic 14px Inter, sans-serif';
    labels.forEach(({ v, text, col, dy = 0, dx = 0 }) => {
      ctx.fillStyle = col;
      ctx.textAlign = 'center';
      ctx.fillText(text, v.x + (dx || 0), v.y + dy);
    });
  }

  function drawPath() {
    const steps = 120;
    const leMax = parseFloat(document.getElementById('le-slider').max);
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const le = (i / steps) * leMax;
      const p = calcProbs(currentPreset, le);
      const pos = barycentricToXY(p.e, p.m, p.t);
      i === 0 ? ctx.moveTo(pos.x, pos.y) : ctx.lineTo(pos.x, pos.y);
    }
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  function drawTail() {
    tail.forEach((pt, i) => {
      const alpha = (i / tail.length) * 0.5;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(253,245,230,${alpha})`;
      ctx.fill();
    });
  }

  function drawDot() {
    const grd = ctx.createRadialGradient(dotPos.x, dotPos.y, 0, dotPos.x, dotPos.y, 14);
    grd.addColorStop(0, 'rgba(253,245,230,0.8)');
    grd.addColorStop(1, 'rgba(253,245,230,0)');
    ctx.beginPath();
    ctx.arc(dotPos.x, dotPos.y, 14, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(dotPos.x, dotPos.y, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = '#FDF5E6';
    ctx.fill();
  }

  function render() {
    ctx.clearRect(0, 0, W, H);
    drawTriangle();
    drawPath();
    drawTail();
    drawDot();
  }

  function updateDot() {
    const probs = calcProbs(currentPreset, LE);
    dotPos = barycentricToXY(probs.e, probs.m, probs.t);
    tail.push({ ...dotPos });
    if (tail.length > 18) tail.shift();
    updateBars(probs);
  }

  function updateBars(probs) {
    const fill = (id, val, col) => {
      const el = document.getElementById(id);
      const percentage = (val * 100).toFixed(1) + '%';
      if (el) { el.style.width = percentage; el.style.background = col; }
      const output = document.getElementById(id.replace('bar-', 'prob-'));
      if (output) output.textContent = percentage;
    };
    fill('bar-e', probs.e, COLOURS.e);
    fill('bar-m', probs.m, COLOURS.m);
    fill('bar-t', probs.t, COLOURS.t);
  }

  function updateControls() {
    slider.value = LE.toFixed(1);
    leVal.textContent = LE.toFixed(1) + ' km/GeV';
  }

  function renderPlaybackState() {
    const playing = wantsPlayback && !document.hidden && document.hasFocus();
    playbackButton.setAttribute('aria-pressed', String(playing));
    playbackButton.querySelector('i').className = playing ? 'fa-solid fa-pause' : 'fa-solid fa-play';
    playbackButton.querySelector('span').textContent = playing ? 'Pause' : 'Play';
    playbackStatus.textContent = playing ? 'Playing automatically' : 'Paused';
  }

  function stopFrame() {
    if (frameId !== null) cancelAnimationFrame(frameId);
    frameId = null;
    previousTime = null;
  }

  function animate(timestamp) {
    if (!wantsPlayback || document.hidden || !document.hasFocus()) {
      stopFrame();
      renderPlaybackState();
      return;
    }
    if (previousTime !== null) {
      LE = advanceLE(LE, timestamp - previousTime, parseFloat(slider.max));
      updateControls();
      updateDot();
      render();
    }
    previousTime = timestamp;
    frameId = requestAnimationFrame(animate);
  }

  function syncPlayback() {
    stopFrame();
    renderPlaybackState();
    if (wantsPlayback && !document.hidden && document.hasFocus()) {
      frameId = requestAnimationFrame(animate);
    }
  }

  function setPlayback(playing) {
    wantsPlayback = playing;
    syncPlayback();
  }

  function setPreset(key) {
    currentPreset = PRESETS[key];
    slider.max = String(currentPreset.leMax);
    LE = currentPreset.leDefault;
    tail = [];
    updateControls();
    updateDot();
    render();
    document.querySelectorAll('.preset-pill').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.preset === key);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('physics-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    resize();
    window.addEventListener('resize', () => {
      resize();
      updateDot();
      render();
    });

    slider = document.getElementById('le-slider');
    leVal = document.getElementById('le-value');
    playbackButton = document.getElementById('playback-toggle');
    playbackStatus = document.getElementById('playback-status');
    reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    wantsPlayback = !reducedMotion.matches;

    slider.addEventListener('input', () => {
      setPlayback(false);
      LE = parseFloat(slider.value);
      updateControls();
      updateDot();
      render();
    });

    playbackButton.addEventListener('click', () => setPlayback(!wantsPlayback));
    document.querySelectorAll('.preset-pill').forEach(btn => {
      btn.addEventListener('click', () => setPreset(btn.dataset.preset));
    });
    document.addEventListener('visibilitychange', syncPlayback);
    window.addEventListener('blur', syncPlayback);
    window.addEventListener('focus', syncPlayback);
    reducedMotion.addEventListener('change', event => {
      if (event.matches) setPlayback(false);
    });

    setPreset('maximum');
    syncPlayback();
  });

})();
