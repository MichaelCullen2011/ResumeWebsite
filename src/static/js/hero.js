(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const PARTICLE_COUNT = 70;
  const CONNECTION_DIST = 130;
  let W, H, particles;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function initParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      phase: Math.random() * Math.PI * 2,
      r: Math.random() * 1.8 + 0.8,
    }));
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      p.x += p.vx + Math.sin(t * 0.0006 + p.phase) * 0.15;
      p.y += p.vy + Math.cos(t * 0.0005 + p.phase) * 0.12;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < CONNECTION_DIST) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(125,76,103,${0.18 * (1 - d / CONNECTION_DIST)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(253,245,230,0.55)';
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  resize();
  initParticles();
  window.addEventListener('resize', () => { resize(); initParticles(); });
  requestAnimationFrame(draw);
})();
