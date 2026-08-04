/* particles.js
 *
 * Background canvas: drifting dots that link up when they get close, and lean
 * toward the cursor. Deliberately cheap. It caps the device pixel ratio, scales
 * the population to the viewport, and stops entirely when the tab is hidden or
 * the user asked for reduced motion.
 */
(function (P) {
  'use strict';

  var canvas, ctx, raf = null;
  var w = 0, h = 0, dpr = 1;
  var dots = [];
  var mouse = { x: -9999, y: -9999, active: false };
  var running = false;

  var LINK = 132;      // px at which two dots are joined
  var PULL = 168;      // px at which the cursor starts to matter
  var MAX_DOTS = 92;

  function rand(a, b) {
    return a + Math.random() * (b - a);
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  }

  function seed() {
    // Roughly one dot per 15k px2, clamped so a big monitor does not melt.
    var target = Math.min(MAX_DOTS, Math.round((w * h) / 15000));
    dots = [];
    for (var i = 0; i < target; i++) {
      dots.push({
        x: rand(0, w),
        y: rand(0, h),
        vx: rand(-0.18, 0.18),
        vy: rand(-0.18, 0.18),
        r: rand(1, 2.2)
      });
    }
  }

  function tint() {
    // Read the theme's particle colour once per frame, so the toggle applies
    // without rebuilding anything.
    return getComputedStyle(document.documentElement)
      .getPropertyValue('--particle')
      .trim() || '45, 212, 191';
  }

  function frame() {
    if (!running) return;

    var rgb = tint();
    ctx.clearRect(0, 0, w, h);

    var i, j, a, b, dx, dy, d;

    for (i = 0; i < dots.length; i++) {
      a = dots[i];
      a.x += a.vx;
      a.y += a.vy;

      // Wrap rather than bounce; bouncing makes the edges look like walls.
      if (a.x < -20) a.x = w + 20;
      if (a.x > w + 20) a.x = -20;
      if (a.y < -20) a.y = h + 20;
      if (a.y > h + 20) a.y = -20;

      if (mouse.active) {
        dx = mouse.x - a.x;
        dy = mouse.y - a.y;
        d = Math.hypot(dx, dy);
        if (d < PULL && d > 0.5) {
          var f = (1 - d / PULL) * 0.035;
          a.vx += (dx / d) * f;
          a.vy += (dy / d) * f;
        }
      }

      // Damp so the cursor cannot accelerate them without limit.
      a.vx *= 0.992;
      a.vy *= 0.992;
      var sp = Math.hypot(a.vx, a.vy);
      if (sp > 0.55) {
        a.vx = (a.vx / sp) * 0.55;
        a.vy = (a.vy / sp) * 0.55;
      }

      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + rgb + ',0.5)';
      ctx.fill();
    }

    // O(n^2) over <=92 dots is about 4k checks a frame, which is fine.
    for (i = 0; i < dots.length; i++) {
      a = dots[i];
      for (j = i + 1; j < dots.length; j++) {
        b = dots[j];
        dx = a.x - b.x;
        dy = a.y - b.y;
        if (dx > LINK || dx < -LINK || dy > LINK || dy < -LINK) continue;
        d = Math.hypot(dx, dy);
        if (d > LINK) continue;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = 'rgba(' + rgb + ',' + (0.16 * (1 - d / LINK)).toFixed(3) + ')';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (running || P.state.reducedMotion) return;
    running = true;
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = null;
    if (ctx) ctx.clearRect(0, 0, w, h);
  }

  P.particles = {
    init: function () {
      canvas = document.getElementById('particles');
      if (!canvas || !canvas.getContext) return;
      ctx = canvas.getContext('2d');

      resize();

      var resizeTimer;
      window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 160);
      });

      window.addEventListener('pointermove', function (e) {
        // Only a real pointer should tug the field; a touch drag should not.
        if (e.pointerType === 'touch') return;
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
      }, { passive: true });

      window.addEventListener('pointerleave', function () {
        mouse.active = false;
      });

      // No point animating a canvas nobody is looking at.
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) stop();
        else start();
      });

      P.state.on('motion', function (reduced) {
        if (reduced) stop();
        else start();
      });

      start();
    },
    stop: stop,
    start: start
  };
})(window.Portfolio = window.Portfolio || {});
