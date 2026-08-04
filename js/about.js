/* about.js - masthead text, bio, animated stat counters, contact buttons. */
(function (P) {
  'use strict';

  function countUp(node, target) {
    if (P.state.reducedMotion) {
      node.textContent = target;
      return;
    }
    var ms = 900;
    var t0 = performance.now();
    var step = function (now) {
      var t = Math.min(1, (now - t0) / ms);
      // easeOutQuart, so it lands softly rather than stopping dead
      var e = 1 - Math.pow(1 - t, 4);
      node.textContent = Math.round(target * e);
      if (t < 1) requestAnimationFrame(step);
      else node.textContent = target;
    };
    requestAnimationFrame(step);
  }

  P.about = {
    init: function () {
      var d = P.data.profile;

      document.getElementById('role-line').textContent = d.role;
      // innerHTML: the tagline carries an <em> for the accent colour.
      document.getElementById('tagline').innerHTML = d.tagline;

      document.getElementById('bio').innerHTML = d.bio
        .map(function (para) {
          return '<p>' + para + '</p>';
        })
        .join('');

      /* ------------------------------------------------------------ stats */

      var statsEl = document.getElementById('stats');
      statsEl.innerHTML = d.stats
        .map(function (s) {
          return (
            '<div class="stat" tabindex="0">' +
            '<div class="stat__value" data-target="' + s.value + '">0</div>' +
            '<div class="stat__label">' + s.label + '</div>' +
            '<span class="stat__note">' + s.note + '</span>' +
            '</div>'
          );
        })
        .join('');

      var values = Array.prototype.slice.call(statsEl.querySelectorAll('.stat__value'));

      // Only count up once, and only when the row is actually on screen.
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (!entry.isIntersecting) return;
              countUp(entry.target, Number(entry.target.dataset.target));
              io.unobserve(entry.target);
            });
          },
          { threshold: 0.4 }
        );
        values.forEach(function (v) {
          io.observe(v);
        });
      } else {
        values.forEach(function (v) {
          v.textContent = v.dataset.target;
        });
      }

      /* ----------------------------------------------------------- contact */

      var L = d.links;
      var buttons = [
        { href: d.resume, label: 'Resume', icon: 'file', primary: true, download: true },
        { href: 'mailto:' + d.email, label: 'Email', icon: 'mail' },
        { href: L.linkedin, label: 'LinkedIn', icon: 'linkedin' },
        { href: L.scholar, label: 'Google Scholar', icon: 'scholar' },
        { href: L.github, label: 'GitHub', icon: 'github' }
      ];

      document.getElementById('contact-links').innerHTML = buttons
        .map(function (b) {
          var external = b.href.indexOf('http') === 0;
          return (
            '<a class="btn' + (b.primary ? ' btn--primary' : '') + '" href="' + b.href + '"' +
            (external || b.download ? ' target="_blank" rel="noopener noreferrer"' : '') +
            '>' + P.icon(b.icon, 15) + '<span>' + b.label + '</span></a>'
          );
        })
        .join('');
    }
  };
})(window.Portfolio = window.Portfolio || {});
