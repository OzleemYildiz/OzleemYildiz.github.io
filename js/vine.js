/* vine.js
 *
 * A thin vine down the left edge of the Off-Duty tab that draws itself as you
 * scroll, sprouting a leaf beside each row of cards.
 *
 * Entirely decorative: it is aria-hidden, sits behind the cards, takes no
 * pointer events, and is not drawn at all under reduced motion or on narrow
 * screens where there is no margin to put it in.
 */
(function (P) {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  var MIN_WIDTH = 1080;   // below this the shell has no spare left margin

  var svg, path, leaves = [];
  var panel, length = 0;
  var ticking = false;

  function el(name, attrs) {
    var node = document.createElementNS(NS, name);
    for (var k in attrs) {
      if (Object.prototype.hasOwnProperty.call(attrs, k)) node.setAttribute(k, attrs[k]);
    }
    return node;
  }

  /* A gently wandering stem, with a leaf every `step` pixels. */
  function build(height) {
    var w = 60;
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + height);
    svg.setAttribute('height', height);
    svg.textContent = '';
    leaves = [];

    var d = 'M 30 0';
    var y = 0;
    var swing = 14;
    var seg = 90;
    var dir = 1;

    while (y < height) {
      var next = Math.min(y + seg, height);
      // Alternating cubic segments read as growth rather than as a zigzag.
      d += ' C ' + (30 + swing * dir) + ' ' + (y + seg * 0.35) +
           ', ' + (30 + swing * dir) + ' ' + (y + seg * 0.65) +
           ', 30 ' + next;
      y = next;
      dir *= -1;
    }

    path = el('path', { d: d, class: 'vine__stem' });
    svg.appendChild(path);

    var step = 150;
    for (var ly = step; ly < height - 20; ly += step) {
      var side = (Math.round(ly / step) % 2) ? 1 : -1;
      var leaf = el('path', {
        class: 'vine__leaf',
        // A simple teardrop, mirrored to whichever side of the stem it grows on.
        d: 'M 30 ' + ly +
           ' q ' + (16 * side) + ' -9 ' + (24 * side) + ' 1' +
           ' q ' + (-14 * side) + ' 10 ' + (-24 * side) + ' -1 Z'
      });
      leaf.dataset.at = ly;
      svg.appendChild(leaf);
      leaves.push(leaf);
    }

    length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
  }

  /* Grow the stem to match how far down the panel the reader has come. */
  function update() {
    ticking = false;
    if (!path || !panel) return;

    var rect = panel.getBoundingClientRect();
    var vh = window.innerHeight;

    // 0 when the panel top reaches the middle of the screen, 1 near its end.
    var travelled = vh * 0.55 - rect.top;
    var span = Math.max(rect.height - vh * 0.35, 1);
    var t = Math.max(0, Math.min(1, travelled / span));

    path.style.strokeDashoffset = length * (1 - t);

    var grownTo = t * Number(svg.getAttribute('height'));
    leaves.forEach(function (leaf) {
      leaf.classList.toggle('is-out', Number(leaf.dataset.at) < grownTo);
    });
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  function measure() {
    if (!panel) return;
    var h = Math.round(panel.getBoundingClientRect().height);
    if (h > 0) {
      build(h);
      update();
    }
  }

  function enabled() {
    return window.innerWidth >= MIN_WIDTH && !P.state.reducedMotion;
  }

  function teardown() {
    if (svg) svg.style.display = 'none';
    window.removeEventListener('scroll', onScroll);
  }

  function setup() {
    if (!svg) return;
    svg.style.display = '';
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  P.vine = {
    init: function () {
      panel = document.getElementById('panel-offduty');
      if (!panel) return;

      svg = el('svg', {
        class: 'vine',
        'aria-hidden': 'true',
        focusable: 'false',
        preserveAspectRatio: 'none'
      });
      panel.appendChild(svg);

      if (enabled()) setup();
      else teardown();

      var resizeTimer;
      window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          if (enabled()) setup();
          else teardown();
        }, 180);
      });

      // The panel has no height until its tab is shown, so measure then.
      P.state.on('tab', function (name) {
        if (name === 'offduty' && enabled()) setTimeout(measure, 60);
      });

      P.state.on('motion', function () {
        if (enabled()) setup();
        else teardown();
      });
    }
  };
})(window.Portfolio = window.Portfolio || {});
