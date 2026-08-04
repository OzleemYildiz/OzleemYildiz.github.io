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

  /* Keyed by index, not by year: two entries share the year 2025 (finishing the
     Ph.D. and starting at Meta), and keying on the year gave them the same
     element id, so opening one toggled the other's detail panel. */
  function select(id, opts) {
    var options = opts || {};
    var entry = P.data.timeline[Number(id)];
    if (!entry) return;

    P.state.setExpandedYear(String(id));

    Array.prototype.forEach.call(listEl.querySelectorAll('.tnode'), function (node) {
      var on = node.dataset.id === String(id);
      node.setAttribute('aria-expanded', String(on));
      var detail = document.getElementById('tdetail-' + node.dataset.id);
      if (detail) {
        detail.classList.toggle('is-open', on);
        detail.hidden = !on;
      }
    });

    radar.to(entry.values, options.instant ? 0 : 620);
    captionEl.textContent = entry.year + ': ' + entry.title;
  }

  function collapse() {
    var id = P.state.expandedYear;
    if (id === null || id === undefined) return;
    var node = listEl.querySelector('.tnode[data-id="' + id + '"]');
    var detail = document.getElementById('tdetail-' + id);
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
        .map(function (t, i) {
          var photos = t.photos
            ? '<div class="tdetail__photos">' + t.photos.map(photoFigure).join('') + '</div>'
            : '';

          return (
            '<div class="tnode-wrap">' +
            '<button class="tnode" type="button" data-id="' + i + '" ' +
            'data-year="' + t.year + '" ' +
            'aria-expanded="false" aria-controls="tdetail-' + i + '">' +
            '<span class="tnode__year">' + t.year + '</span>' +
            '<span class="tnode__title">' + t.title +
            (t.current ? '<span class="tnode__now">now</span>' : '') + '</span>' +
            '<span class="tnode__org">' +
            (t.company ? '<span class="tnode__co">' + t.company + '</span>' : '') +
            t.org + '</span>' +

            '</button>' +
            '<div class="tdetail" id="tdetail-' + i + '" hidden>' +
            '<p>' + t.detail + '</p>' + photos +
            '</div>' +
            '</div>'
          );
        })
        .join('');

      listEl.addEventListener('click', function (e) {
        var node = e.target.closest('.tnode');
        if (!node) return;
        var id = node.dataset.id;
        // Clicking the open entry closes it but leaves the radar where it is,
        // so the shape you were reading does not vanish out from under you.
        if (P.state.expandedYear === String(id)) collapse();
        else select(id);
      });

      document.addEventListener('keydown', function (e) {
        // Not a truthiness check: index 0 is a valid expanded entry.
        if (e.key === 'Escape' && P.state.expandedYear !== null) collapse();
      });

      // Open on the current year the first time the tab is shown.
      P.state.on('tab', function (name) {
        if (name !== 'journey' || opened) return;
        opened = true;
        var last = P.data.timeline.length - 1;
        setTimeout(function () {
          // Do not stomp on a year the reader picked during the delay.
          if (P.state.expandedYear === null) select(last);
        }, 120);
      });
    },

    playIfActive: function () {
      if (P.state.activeTab !== 'journey' || opened) return;
      opened = true;
      var last = P.data.timeline.length - 1;
      setTimeout(function () {
        if (P.state.expandedYear === null) select(last);
      }, 240);
    }
  };
})(window.Portfolio = window.Portfolio || {});
