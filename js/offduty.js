/* offduty.js
 *
 * The fun corner. Cards flip to reveal a note on the back. Cards with several
 * photos get arrows and dots to step through them, and the plant card throws
 * confetti when you poke it.
 *
 * Flipping is handled here for every flip card on the page, including the ones
 * on the Work tab, so the keyboard behaviour is defined once.
 */
(function (P) {
  'use strict';

  var quipIndex = 0;

  function picture(name, alt, cls) {
    return (
      '<picture>' +
      '<source srcset="img/' + name + '.webp" type="image/webp" />' +
      '<img class="' + (cls || '') + '" src="img/' + name + '.jpg" width="1000" height="750" ' +
      'loading="lazy" alt="' + alt + '" />' +
      '</picture>'
    );
  }

  /* A stack of slides plus dot navigation. Only the active slide is shown. */
  function galleryMarkup(card, i) {
    var slides = card.gallery
      .map(function (shot, n) {
        return (
          '<span class="shot' + (n === 0 ? ' is-on' : '') + '" data-shot="' + n + '">' +
          picture(shot.src, shot.alt) +
          '</span>'
        );
      })
      .join('');

    var dots = card.gallery
      .map(function (shot, n) {
        return (
          '<span class="dot' + (n === 0 ? ' is-on' : '') + '" data-dot="' + n + '" ' +
          'role="button" tabindex="0" aria-label="Photo ' + (n + 1) + ': ' + shot.alt + '"></span>'
        );
      })
      .join('');

    return (
      '<span class="gal" data-gallery="' + i + '">' +
      '<span class="gal__stack">' + slides + '</span>' +
      '<span class="gal__nav">' +
      '<span class="gal__arrow" data-step="-1" role="button" tabindex="0" ' +
      'aria-label="Previous photo">' + P.icon('chevronLeft', 18) + '</span>' +
      '<span class="gal__dots">' + dots + '</span>' +
      '<span class="gal__arrow" data-step="1" role="button" tabindex="0" ' +
      'aria-label="Next photo">' + P.icon('chevronRight', 18) + '</span>' +
      '</span>' +
      '<span class="gal__caption">' + card.gallery[0].caption + '</span>' +
      '</span>'
    );
  }

  function renderCard(card, i) {
    var front;

    if (card.gallery) {
      front =
        galleryMarkup(card, i) +
        '<span class="flip__cap">' +
        '<span>' + card.title + '</span>' +
        '<span class="flip__hint">' + (card.poke ? 'poke a plant' : 'flip') + '</span>' +
        '</span>';
    } else if (card.image) {
      front =
        '<span class="flip__media">' + picture(card.image, card.alt) + '</span>' +
        '<span class="flip__cap">' +
        '<span>' + card.title + '</span>' +
        '<span class="flip__hint">flip</span>' +
        '</span>';
    } else {
      front =
        '<span class="flip__icon">' + P.icon(card.icon || 'book', 30) + '</span>' +
        '<span class="flip__lead">' + card.front + '</span>' +
        '<span class="flip__cap">' +
        '<span>' + card.title + '</span>' +
        '<span class="flip__hint">flip</span>' +
        '</span>';
    }

    var back =
      '<p>' + card.back + '</p>' +
      (card.url ? '<span class="flip__link">' + card.linkLabel + ' &rarr;</span>' : '');

    return (
      '<button class="flip' + (card.poke ? ' flip--plant' : '') + '" type="button" ' +
      'aria-expanded="false" data-card="' + i + '"' +
      (card.poke ? ' data-poke="1"' : '') +
      (card.url ? ' data-url="' + card.url + '"' : '') + '>' +
      '<span class="flip__inner">' +
      '<span class="flip__face flip__front">' + front + '</span>' +
      '<span class="flip__face flip__back">' + back + '</span>' +
      '</span>' +
      '</button>'
    );
  }

  /* Show slide n of a gallery and sync its dots and caption. */
  function showShot(gal, n) {
    var shots = gal.querySelectorAll('.shot');
    var dots = gal.querySelectorAll('.dot');
    var index = ((n % shots.length) + shots.length) % shots.length;

    for (var i = 0; i < shots.length; i++) {
      shots[i].classList.toggle('is-on', i === index);
      if (dots[i]) dots[i].classList.toggle('is-on', i === index);
    }

    var card = P.data.offDuty[Number(gal.dataset.gallery)];
    var cap = gal.querySelector('.gal__caption');
    if (cap && card && card.gallery[index]) cap.textContent = card.gallery[index].caption;
    gal.dataset.current = index;
  }

  function currentShot(gal) {
    return Number(gal.dataset.current || 0);
  }

  P.offduty = {
    init: function () {
      document.getElementById('offduty').innerHTML =
        P.data.offDuty.map(renderCard).join('');

      var root = document.getElementById('offduty');

      /* Gallery controls come first and stop the click from reaching the card,
         so stepping through photos never flips the card underneath. */
      root.addEventListener('click', function (e) {
        var arrow = e.target.closest('.gal__arrow');
        var dot = e.target.closest('.dot');
        if (!arrow && !dot) return;

        e.preventDefault();
        e.stopPropagation();

        var gal = e.target.closest('.gal');
        if (arrow) showShot(gal, currentShot(gal) + Number(arrow.dataset.step));
        else showShot(gal, Number(dot.dataset.dot));
      });

      root.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        var hit = e.target.closest('.gal__arrow, .dot');
        if (!hit) return;
        e.preventDefault();
        e.stopPropagation();
        var gal = hit.closest('.gal');
        if (hit.classList.contains('dot')) showShot(gal, Number(hit.dataset.dot));
        else showShot(gal, currentShot(gal) + Number(hit.dataset.step));
      });

      /* One delegated handler for every flip card on the page. */
      document.addEventListener('click', function (e) {
        if (e.target.closest('.gal__arrow, .dot')) return;

        var card = e.target.closest('.flip');
        if (!card) return;

        // Poking the plant photo fires confetti instead of flipping, so you can
        // keep poking it. The caption bar still flips the card.
        if (card.dataset.poke && e.target.closest('.gal__stack')) {
          var r = card.getBoundingClientRect();
          var cx = r.left + r.width / 2;
          var cy = r.top + r.height / 2;
          P.confetti.burst(cx, cy, 'plant');
          var quips = P.data.plantQuips;
          P.confetti.say(quips[quipIndex % quips.length], cx, cy);
          quipIndex++;
          return;
        }

        var flipped = card.classList.toggle('is-flipped');
        card.setAttribute('aria-expanded', String(flipped));

        // A card carrying a link opens it on the second click, once its back is
        // showing, so the first click never navigates away unexpectedly.
        if (card.dataset.url && !flipped) {
          window.open(card.dataset.url, '_blank', 'noopener');
        }
      });

      // Escape turns any face-up card back over.
      document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        Array.prototype.forEach.call(
          document.querySelectorAll('.flip.is-flipped'),
          function (card) {
            card.classList.remove('is-flipped');
            card.setAttribute('aria-expanded', 'false');
          }
        );
      });
    }
  };
})(window.Portfolio = window.Portfolio || {});
