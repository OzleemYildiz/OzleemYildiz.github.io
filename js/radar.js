/* radar.js
 *
 * Builds a radar chart in SVG from data, then tweens the polygon between value
 * sets. Nothing about the geometry is hardcoded: the axis count comes from the
 * data, so adding a seventh axis to data.js just works.
 *
 * Because every shape has the same vertex count in the same order, morphing is
 * a straight per-vertex interpolation. No path matching needed.
 */
(function (P) {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  var RINGS = 4;

  function el(name, attrs) {
    var node = document.createElementNS(NS, name);
    for (var k in attrs) {
      if (Object.prototype.hasOwnProperty.call(attrs, k)) {
        node.setAttribute(k, attrs[k]);
      }
    }
    return node;
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  /* Radar geometry. Angle 0 points straight up, then clockwise. */
  function point(cx, cy, radius, index, count) {
    var angle = (Math.PI * 2 * index) / count - Math.PI / 2;
    return {
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius
    };
  }

  function polygonPoints(values, cx, cy, r, max) {
    return values
      .map(function (v, i) {
        var p = point(cx, cy, (Math.max(0, Math.min(max, v)) / max) * r, i, values.length);
        return p.x.toFixed(2) + ',' + p.y.toFixed(2);
      })
      .join(' ');
  }

  /* Keep a label from being clipped by the viewBox edge. */
  function anchorFor(x, cx) {
    if (Math.abs(x - cx) < 12) return 'middle';
    return x > cx ? 'start' : 'end';
  }

  function Radar(svg, opts) {
    this.svg = svg;
    this.axes = opts.axes;
    this.max = opts.max || 10;
    this.values = this.axes.map(function () { return 0; });
    this.frame = null;

    var vb = (svg.getAttribute('viewBox') || '0 0 420 380').split(/\s+/).map(Number);
    this.cx = vb[2] / 2;
    this.cy = vb[3] / 2 + 6;
    // Leave room for the outer labels, which sit beyond the web.
    this.r = Math.min(vb[2], vb[3]) / 2 - 62;

    this.build();
  }

  Radar.prototype.build = function () {
    var self = this;
    var n = this.axes.length;
    this.svg.textContent = '';

    var web = el('g', { class: 'radar__web-g' });

    // Concentric rings, drawn as polygons so they match the axis count.
    for (var ring = 1; ring <= RINGS; ring++) {
      var rr = (this.r * ring) / RINGS;
      var pts = this.axes
        .map(function (_, i) {
          var p = point(self.cx, self.cy, rr, i, n);
          return p.x.toFixed(2) + ',' + p.y.toFixed(2);
        })
        .join(' ');
      web.appendChild(el('polygon', { class: 'radar__web', points: pts }));
    }

    // Spokes.
    this.axes.forEach(function (_, i) {
      var p = point(self.cx, self.cy, self.r, i, n);
      web.appendChild(
        el('line', {
          class: 'radar__spoke',
          x1: self.cx, y1: self.cy,
          x2: p.x.toFixed(2), y2: p.y.toFixed(2)
        })
      );
    });

    this.svg.appendChild(web);

    /* The outgoing shape, left behind as a faint outline so you can see what
       changed rather than only where it landed. */
    this.ghost = el('polygon', {
      class: 'radar__ghost',
      points: polygonPoints(this.values, this.cx, this.cy, this.r, this.max)
    });
    this.svg.appendChild(this.ghost);

    // The shape itself, starting collapsed at the centre.
    this.shape = el('polygon', {
      class: 'radar__shape',
      points: polygonPoints(this.values, this.cx, this.cy, this.r, this.max)
    });
    this.svg.appendChild(this.shape);

    this.dots = this.axes.map(function () {
      var dot = el('circle', { class: 'radar__dot', r: 3, cx: self.cx, cy: self.cy });
      self.svg.appendChild(dot);
      return dot;
    });

    // Labels, wrapped onto two lines when they contain an ampersand.
    this.labels = this.axes.map(function (name, i) {
      var p = point(self.cx, self.cy, self.r + 26, i, n);
      var anchor = anchorFor(p.x, self.cx);
      var text = el('text', {
        class: 'radar__label',
        x: p.x.toFixed(1),
        y: p.y.toFixed(1),
        'text-anchor': anchor
      });

      var parts = name.split(' & ');
      if (parts.length === 2) {
        var l1 = el('tspan', { x: p.x.toFixed(1), dy: '-0.35em' });
        l1.textContent = parts[0] + ' &';
        var l2 = el('tspan', { x: p.x.toFixed(1), dy: '1.15em' });
        l2.textContent = parts[1];
        text.appendChild(l1);
        text.appendChild(l2);
      } else {
        text.textContent = name;
      }

      self.svg.appendChild(text);
      return text;
    });
  };

  /* Move to a new value set. Instant when reduced motion is on. */
  Radar.prototype.to = function (target, duration) {
    var self = this;
    var from = this.values.slice();
    var to = target.slice();

    if (this.frame) cancelAnimationFrame(this.frame);

    /* Park the shape we are leaving, unless it is the opening grow-from-centre,
       where a ghost at the centre point would just be a dot. */
    var fromCollapsed = from.every(function (v) { return v === 0; });
    if (this.ghost && !fromCollapsed && !P.state.reducedMotion) {
      this.ghost.setAttribute(
        'points',
        polygonPoints(from, this.cx, this.cy, this.r, this.max)
      );
      this.ghost.classList.remove('is-showing');
      void this.ghost.getBoundingClientRect();
      this.ghost.classList.add('is-showing');

      clearTimeout(this.ghostTimer);
      this.ghostTimer = setTimeout(function () {
        self.ghost.classList.remove('is-showing');
      }, 1900);
    }

    var apply = function (values) {
      self.values = values;
      self.shape.setAttribute(
        'points',
        polygonPoints(values, self.cx, self.cy, self.r, self.max)
      );
      values.forEach(function (v, i) {
        var p = point(
          self.cx, self.cy,
          (Math.max(0, Math.min(self.max, v)) / self.max) * self.r,
          i, values.length
        );
        self.dots[i].setAttribute('cx', p.x.toFixed(2));
        self.dots[i].setAttribute('cy', p.y.toFixed(2));
      });
      // Highlight the axes this year actually leans on.
      self.labels.forEach(function (label, i) {
        label.classList.toggle('is-hot', values[i] >= self.max * 0.8);
      });
    };

    if (P.state.reducedMotion || duration === 0) {
      apply(to);
      return;
    }

    var ms = duration || 620;
    var t0 = performance.now();

    var step = function (now) {
      var t = Math.min(1, (now - t0) / ms);
      var e = easeOutCubic(t);
      apply(
        from.map(function (v, i) {
          return v + (to[i] - v) * e;
        })
      );
      if (t < 1) self.frame = requestAnimationFrame(step);
      else self.frame = null;
    };

    this.frame = requestAnimationFrame(step);
  };

  P.Radar = Radar;
})(window.Portfolio = window.Portfolio || {});
