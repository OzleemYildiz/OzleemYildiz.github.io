/* work.js - current role, plus previous roles as flip cards. */
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

      /* Flip cards. The whole card is a button so it works by keyboard, and the
         back face is hidden from assistive tech until it is turned face up. */
      document.getElementById('previous-work').innerHTML = P.data.previousWork
        .map(function (role, i) {
          var back =
            '<p><strong style="color: var(--text-strong);">' + role.project + '</strong></p>' +
            (role.supervisor ? '<p style="font-size:0.82rem;">' + role.supervisor + '</p>' : '') +
            bullets(role.points);

          return (
            '<button class="flip" type="button" aria-expanded="false" data-flip="' + i + '">' +
            '<span class="flip__inner">' +
            '<span class="flip__face flip__front">' +
            '<span class="flip__icon">' + P.icon('file', 30) + '</span>' +
            '<span class="flip__lead">' + role.title + '</span>' +
            '<span class="flip__teaser">' + role.project + '. ' + role.teaser + '</span>' +
            '<span class="flip__cap">' +
            '<span>' + role.period + '</span>' +
            '<span class="flip__hint">details</span>' +
            '</span>' +
            '</span>' +
            '<span class="flip__face flip__back">' + back + '</span>' +
            '</span>' +
            '</button>'
          );
        })
        .join('');
    }
  };
})(window.Portfolio = window.Portfolio || {});
