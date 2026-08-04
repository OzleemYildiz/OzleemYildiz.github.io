/* work.js - current role, plus previous roles as expandable cards.
 *
 * These were flip cards. A flip card has to reserve the height of its tallest
 * face, and the Ray-Ban role carries five long bullets, so the fronts ended up
 * mostly empty space. Expanding in place costs nothing when collapsed and has
 * room for as much detail as the role deserves.
 */
(function (P) {
  'use strict';

  function bullets(points) {
    return (
      '<ul class="bullets">' +
      points.map(function (p) { return '<li>' + p + '</li>'; }).join('') +
      '</ul>'
    );
  }

  P.work = {
    init: function () {
      var cur = P.data.currentWork;

      document.getElementById('current-work').innerHTML =
        '<div class="role">' +
        '<div class="role__meta">' +
        '<span class="role__org">' + cur.org + '</span>' +
        '<span>' + cur.period + '</span>' +
        '<span>' + cur.location + '</span>' +
        '</div>' +
        '<h2 class="head">' + cur.title + '</h2>' +
        '<p style="color: var(--muted); max-width: var(--measure);">' + cur.summary + '</p>' +
        bullets(cur.points) +
        '</div>';

      var list = document.getElementById('previous-work');

      list.innerHTML = P.data.previousWork
        .map(function (role, i) {
          return (
            '<article class="rolecard">' +
            '<div class="role__meta">' +
            '<span class="role__org">' + role.org + '</span>' +
            '<span>' + role.period + '</span>' +
            '<span>' + role.location + '</span>' +
            '</div>' +
            '<h3 class="subhead">' + role.title + '</h3>' +
            '<p class="rolecard__teaser">' +
            '<strong>' + role.project + '.</strong> ' + role.teaser + '</p>' +
            (role.supervisor
              ? '<p class="rolecard__sup">' + role.supervisor + '</p>'
              : '') +
            '<button class="rolecard__toggle" type="button" aria-expanded="false" ' +
            'aria-controls="rolebody-' + i + '">' +
            '<span class="rolecard__label">What I did</span>' +
            '<span class="rolecard__chev">' + P.icon('chevronRight', 15) + '</span>' +
            '</button>' +
            '<div class="rolecard__body" id="rolebody-' + i + '" hidden>' +
            bullets(role.points) +
            '</div>' +
            '</article>'
          );
        })
        .join('');

      list.addEventListener('click', function (e) {
        var btn = e.target.closest('.rolecard__toggle');
        if (!btn) return;
        var body = document.getElementById(btn.getAttribute('aria-controls'));
        var open = btn.getAttribute('aria-expanded') === 'true';

        btn.setAttribute('aria-expanded', String(!open));
        btn.querySelector('.rolecard__label').textContent = open ? 'What I did' : 'Hide';
        body.hidden = open;
        body.classList.toggle('is-open', !open);
      });
    }
  };
})(window.Portfolio = window.Portfolio || {});
