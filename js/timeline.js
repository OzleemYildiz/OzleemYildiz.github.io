/* timeline.js
 *
 * The Journey tab. Clicking a year expands its detail card and morphs the radar
 * to that year's values, which is the whole point of the tab: you watch the
 * field switch happen instead of inferring it from job titles.
 */
(function (P) {
  'use strict';

  var radar = null;
  var listEl, captionEl;
  var opened = false;

  function photoFigure(photo) {
    return (
      '<figure>' +
      '<picture>' +
      '<source srcset="img/' + photo.src + '.webp" type="image/webp" />' +
      '<img src="img/' + photo.src + '.jpg" width="1000" height="750" loading="lazy" ' +
      'alt="' + photo.alt + '" />' +
      '</picture>' +
      '<figcaption>' + photo.alt + '</figcaption>' +
      '</figure>'
    );
  }

  function select(year, opts) {
    var options = opts || {};
    var entry = null;

    P.data.timeline.forEach(function (t) {
      if (t.year === year) entry = t;
    });
    if (!entry) return;

    P.state.setExpandedYear(year);

    Array.prototype.forEach.call(listEl.querySelectorAll('.tnode'), function (node) {
      var on = node.dataset.year === year;
      node.setAttribute('aria-expanded', String(on));
      var detail = document.getElementById('tdetail-' + node.dataset.year);
      if (detail) {
        detail.classList.toggle('is-open', on);
        detail.hidden = !on;
      }
    });

    radar.to(entry.values, options.instant ? 0 : 620);
    captionEl.textContent =
      entry.year + ': ' + entry.title + '. Share of day-to-day work, not a competence score.';
  }

  function collapse() {
    var year = P.state.expandedYear;
    if (!year) return;
    var node = listEl.querySelector('.tnode[data-year="' + year + '"]');
    var detail = document.getElementById('tdetail-' + year);
    if (node) {
      node.setAttribute('aria-expanded', 'false');
      node.focus();
    }
    if (detail) {
      detail.classList.remove('is-open');
      detail.hidden = true;
    }
    P.state.setExpandedYear(null);
  }

  P.timeline = {
    init: function () {
      listEl = document.getElementById('timeline');
      captionEl = document.getElementById('radar-journey-desc');

      radar = new P.Radar(document.getElementById('radar-journey'), {
        axes: P.data.radarAxes,
        max: P.data.radarMax
      });

      listEl.innerHTML = P.data.timeline
        .map(function (t) {
          var photos = t.photos
            ? '<div class="tdetail__photos">' + t.photos.map(photoFigure).join('') + '</div>'
            : '';

          return (
            '<div class="tnode-wrap">' +
            '<button class="tnode" type="button" data-year="' + t.year + '" ' +
            'aria-expanded="false" aria-controls="tdetail-' + t.year + '">' +
            '<span class="tnode__year">' + t.year + '</span>' +
            '<span class="tnode__title">' + t.title +
            (t.current ? '<span class="tnode__now">now</span>' : '') + '</span>' +
            '<span class="tnode__org">' + t.org + '</span>' +
            '</button>' +
            '<div class="tdetail" id="tdetail-' + t.year + '" hidden>' +
            '<p>' + t.detail + '</p>' + photos +
            '</div>' +
            '</div>'
          );
        })
        .join('');

      listEl.addEventListener('click', function (e) {
        var node = e.target.closest('.tnode');
        if (!node) return;
        var year = node.dataset.year;
        // Clicking the open year closes it but leaves the radar where it is,
        // so the shape you were reading does not vanish out from under you.
        if (P.state.expandedYear === year) collapse();
        else select(year);
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && P.state.expandedYear) collapse();
      });

      // Open on the current year the first time the tab is shown.
      P.state.on('tab', function (name) {
        if (name !== 'journey' || opened) return;
        opened = true;
        var last = P.data.timeline[P.data.timeline.length - 1];
        setTimeout(function () { select(last.year); }, 120);
      });
    },

    playIfActive: function () {
      if (P.state.activeTab !== 'journey' || opened) return;
      opened = true;
      var last = P.data.timeline[P.data.timeline.length - 1];
      setTimeout(function () { select(last.year); }, 240);
    }
  };
})(window.Portfolio = window.Portfolio || {});
