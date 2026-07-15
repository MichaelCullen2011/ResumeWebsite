(function () {

  // ── Physics ───────────────────────────────────────────────
  const DEG = Math.PI / 180;

  const PRESETS = {
    'no-mixing': {
      label: 'No Mixing',
      theta12: 0, theta13: 0, theta23: 0,
      dm2_12: 7.53e-5, dm2_23: 2.453e-3,
      dominant: 'dm2_12',
    },
    'solar': {
      label: 'Solar Neutrinos',
      theta12: 33.4 * DEG, theta13: 8.6 * DEG, theta23: 49.2 * DEG,
      dm2_12: 7.53e-5, dm2_23: 2.453e-3,
      dominant: 'dm2_12',
    },
    'atmospheric': {
      label: 'Atmospheric Neutrinos',
      theta12: 33.4 * DEG, theta13: 8.6 * DEG, theta23: 49.2 * DEG,
      dm2_12: 7.53e-5, dm2_23: 2.453e-3,
      dominant: 'dm2_23',
    },
    'maximum': {
      label: 'Maximum Mixing',
      theta12: 45 * DEG, theta13: 45 * DEG, theta23: 45 * DEG,
      dm2_12: 7.53e-5, dm2_23: 2.453e-3,
      dominant: 'dm2_23',
    },
  };

  // Two-flavour approx: P(survive) = 1 - sin²(2θ)·sin²(1.27·Δm²·L/E)
  function pSurvive(theta, dm2, LE) {
    return 1 - Math.pow(Math.sin(2 * theta), 2) * Math.pow(Math.sin(1.27 * dm2 * LE), 2);
  }

  function calcProbs(preset, LE) {
    const { theta12, theta13, theta23, dm2_12, dm2_23, dominant } = preset;
    const dm2  = dominant === 'dm2_12' ? dm2_12 : dm2_23;
    const theta = dominant === 'dm2_12' ? theta12 : theta23;
    const pEE  = pSurvive(theta13, dm2_12, LE) * pSurvive(theta12, dm2, LE);
    const pMM  = pSurvive(theta23, dm2, LE);
    const pTT  = 1 - pEE - pMM;
    const sum  = pEE + Math.max(0, pMM) + Math.max(0, pTT);
    return {
      e: Math.max(0, pEE) / sum,
      m: Math.max(0, pMM) / sum,
      t: Math.max(0, pTT) / sum,
    };
  }

  // ── Canvas / Triangle geometry ────────────────────────────
  const COLOURS = {
    e: '#7d4c67',  // burgundy — νe top
    m: '#C8963E',  // amber    — νμ bottom-left
    t: '#4A7C9C',  // slate    — ντ bottom-right
  };

  let canvas, ctx, W, H;
  let triVerts;       // [{x,y}] top, bl, br
  let currentPreset   = PRESETS['no-mixing'];
  let LE              = 0.5;    // km/GeV, 0–2000 range on slider
  let dotPos          = { x: 0, y: 0 };
  let tail            = [];     // recent positions for fading tail
  let animFrame;

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
    updatePMNS();
  }

  function updateBars(probs) {
    const fill = (id, val, col) => {
      const el = document.getElementById(id);
      if (el) { el.style.height = (val * 100).toFixed(1) + '%'; el.style.background = col; }
    };
    fill('bar-e', probs.e, COLOURS.e);
    fill('bar-m', probs.m, COLOURS.m);
    fill('bar-t', probs.t, COLOURS.t);
  }

  function updatePMNS() {
    const p = currentPreset;
    const fmt = rad => (rad / DEG).toFixed(1) + '°';
    const el = document.getElementById('pmns-values');
    if (el) {
      el.textContent = `θ₁₂  ${fmt(p.theta12)}\nθ₁₃  ${fmt(p.theta13)}\nθ₂₃  ${fmt(p.theta23)}`;
    }
  }

  function setPreset(key) {
    currentPreset = PRESETS[key];
    tail = [];
    updateDot();
    render();
    document.querySelectorAll('.preset-pill').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.preset === key);
    });
  }

  function loop() {
    render();
    animFrame = requestAnimationFrame(loop);
  }

  document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('physics-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    resize();
    window.addEventListener('resize', () => { resize(); updateDot(); });

    const slider = document.getElementById('le-slider');
    const leVal  = document.getElementById('le-value');

    slider.addEventListener('input', () => {
      LE = parseFloat(slider.value);
      leVal.textContent = LE.toFixed(1) + ' km/GeV';
      updateDot();
    });

    document.querySelectorAll('.preset-pill').forEach(btn => {
      btn.addEventListener('click', () => setPreset(btn.dataset.preset));
    });

    setPreset('no-mixing');
    loop();
  });

})();
