/* publications.js - filterable publication list, plus patents and thesis. */
(function (P) {
  'use strict';

  var FILTERS = [
    { id: 'all', label: 'All' },
    { id: 'journal', label: 'Journals' },
    { id: 'conference', label: 'Conferences' },
    { id: 'preprint', label: 'Preprints' }
  ];

  var listEl;

  /* Bold her name wherever it shows up in the author list. */
  function authorLine(authors) {
    return authors
      .map(function (a) {
        return /Y[ıi]ld[ıi]z/.test(a)
          ? '<span class="me">' + a + '</span>'
          : a;
      })
      .join(', ');
  }

  function extras(pub) {
    var items = [];
    if (pub.url) {
      items.push({ label: pub.type === 'preprint' ? 'arXiv' : 'Paper', url: pub.url });
    }
    (pub.extras || []).forEach(function (e) { items.push(e); });
    if (!items.length) return '';

    return (
      '<div class="pub__extras">' +
      items
        .map(function (e) {
          return (
            '<a href="' + e.url + '" target="_blank" rel="noopener noreferrer">' +
            e.label + '</a>'
          );
        })
        .join('') +
      '</div>'
    );
  }

  function render(filter) {
    var pubs = P.data.publications.filter(function (p) {
      return filter === 'all' || p.type === filter;
    });

    if (!pubs.length) {
      listEl.innerHTML = '<p class="empty">Nothing in this category yet.</p>';
      return;
    }

    listEl.innerHTML = pubs
      .map(function (pub, i) {
        var title = pub.url
          ? '<a href="' + pub.url + '" target="_blank" rel="noopener noreferrer">' +
            pub.title + '</a>'
          : pub.title;

        var abstract = pub.abstract
          ? '<details class="pub__abstract"><summary>Abstract</summary><p>' +
            pub.abstract + '</p></details>'
          : '';

        // Stagger the entry, capped so a long list does not crawl in.
        var delay = Math.min(i, 8) * 45;

        return (
          '<article class="pub" style="animation-delay:' + delay + 'ms">' +
          '<h3 class="pub__title">' + title + '</h3>' +
          '<p class="pub__authors">' + authorLine(pub.authors) + '</p>' +
          '<p class="pub__venue">' + pub.venue + ', ' + pub.year + '</p>' +
          extras(pub) +
          abstract +
          '</article>'
        );
      })
      .join('');
  }

  /* Research splits into three views. Patents and the thesis were previously
     below the fold, where nobody scrolled to find them. */
  function initSections() {
    var nav = document.getElementById('research-nav');
    var sections = Array.prototype.slice.call(
      document.querySelectorAll('#panel-research .rsection')
    );

    nav.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-section]');
      if (!btn) return;
      var name = btn.getAttribute('data-section');

      Array.prototype.forEach.call(nav.querySelectorAll('[data-section]'), function (b) {
        b.setAttribute('aria-pressed', String(b === btn));
      });
      sections.forEach(function (s) {
        s.hidden = s.dataset.section !== name;
      });
    });
  }

  P.publications = {
    init: function () {
      listEl = document.getElementById('publist');

      initSections();

      var bar = document.getElementById('pub-filters');
      bar.innerHTML = FILTERS.map(function (f) {
        var count = f.id === 'all'
          ? P.data.publications.length
          : P.data.publications.filter(function (p) { return p.type === f.id; }).length;
        return (
          '<button class="chip" type="button" data-filter="' + f.id + '" ' +
          'aria-pressed="' + (f.id === 'all') + '">' +
          f.label + ' <span aria-hidden="true">(' + count + ')</span>' +
          '</button>'
        );
      }).join('');

      bar.addEventListener('click', function (e) {
        var chip = e.target.closest('[data-filter]');
        if (!chip) return;
        var value = chip.getAttribute('data-filter');
        if (!P.state.setFilter(value)) return;

        Array.prototype.forEach.call(bar.querySelectorAll('.chip'), function (c) {
          c.setAttribute('aria-pressed', String(c === chip));
        });
        render(value);
      });

      render('all');

      /* ---------------------------------------------------------- patents */

      document.getElementById('patents').innerHTML = P.data.patents
        .map(function (pt) {
          return (
            '<article class="pub">' +
            '<h3 class="pub__title">' +
            '<a href="' + pt.url + '" target="_blank" rel="noopener noreferrer">' +
            pt.title + '</a></h3>' +
            '<p class="pub__authors">' + authorLine(pt.authors) + '</p>' +
            '<p class="pub__venue">' + pt.number + '. ' + pt.filed + '</p>' +
            '</article>'
          );
        })
        .join('');

      /* ----------------------------------------------------------- thesis */

      var th = P.data.thesis;
      document.getElementById('thesis').innerHTML =
        '<article class="pub">' +
        '<h3 class="pub__title">' + th.title + '</h3>' +
        '<p class="pub__authors"><span class="me">O. Yıldız</span></p>' +
        '<p class="pub__venue">Ph.D. thesis, ' + th.school + ', ' + th.year +
        '. Advised by ' + th.advisor + '.</p>' +
        '</article>';
    }
  };
})(window.Portfolio = window.Portfolio || {});
