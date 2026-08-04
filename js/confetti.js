/* confetti.js
 *
 * One shared particle burst, used by both the plant cards and the Konami code.
 * Runs on its own canvas above the page, stops as soon as the last piece falls
 * off screen, and does nothing at all under reduced motion.
 */
(function (P) {
  'use strict';

  var canvas, ctx, raf = null;
  var pieces = [];
  var dpr = 1;

  var PALETTES = {
    plant: ['#4ADE80', '#22C55E', '#86EFAC', '#2DD4BF', '#A3E635'],
    konami: ['#2DD4BF', '#14B8A6', '#FBBF24', '#FCD34D', '#5EEAD4']
  };

  function resize() {
    if (!canvas) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function tick() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (var i = pieces.length - 1; i >= 0; i--) {
      var p = pieces[i];

      p.vy += 0.22;          // gravity
      p.vx *= 0.995;         // drag
      p.x += p.vx;
      p.y += p.vy;
      p.spin += p.spinRate;
      p.life -= 1;

      if (p.y > window.innerHeight + 40 || p.life <= 0) {
        pieces.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.spin);
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life / 40));
      ctx.fillStyle = p.color;
      // Flat rectangles read as tumbling paper once they are spinning.
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }

    if (pieces.length) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = null;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }

  P.confetti = {
    init: function () {
      canvas = document.getElementById('confetti');
      if (!canvas || !canvas.getContext) return;
      ctx = canvas.getContext('2d');
      resize();
      window.addEventListener('resize', resize);
    },

    /* burst(x, y, palette, count) - x and y are viewport coordinates. */
    burst: function (x, y, palette, count) {
      if (!ctx || P.state.reducedMotion) return;

      var colors = PALETTES[palette] || PALETTES.plant;
      var n = count || 46;

      for (var i = 0; i < n; i++) {
        var angle = (Math.PI * 2 * i) / n + Math.random() * 0.4;
        var speed = 3.2 + Math.random() * 5.4;
        pieces.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 3.4,
          w: 5 + Math.random() * 6,
          h: 3 + Math.random() * 5,
          spin: Math.random() * Math.PI,
          spinRate: (Math.random() - 0.5) * 0.32,
          color: colors[(Math.random() * colors.length) | 0],
          life: 76 + Math.random() * 46
        });
      }

      // Hard cap, so mashing a plant cannot pile up thousands of pieces.
      if (pieces.length > 420) pieces.splice(0, pieces.length - 420);

      if (!raf) raf = requestAnimationFrame(tick);
    },

    /* A short floating caption, used with the plant bursts. */
    say: function (text, x, y) {
      var node = document.createElement('div');
      node.className = 'quip';
      node.textContent = text;
      node.style.left = x + 'px';
      node.style.top = y + 'px';
      document.body.appendChild(node);
      setTimeout(function () {
        node.remove();
      }, 1500);
    }
  };
})(window.Portfolio = window.Portfolio || {});
