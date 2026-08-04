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

    /* Intrinsic sizes of the built images, so every <img> can carry width and
     height and the page never reflows as photos arrive. The book cover is
     portrait; everything else is the standard 4:3 card crop. */
  var DIMS = { book: [592, 900] };
  var DEFAULT_DIMS = [1000, 750];

  function picture(name, alt) {
    var d = DIMS[name] || DEFAULT_DIMS;
    return (
      '<picture>' +
      '<source srcset="img/' + name + '.webp" type="image/webp" />' +
      '<img src="img/' + name + '.jpg" width="' + d[0] + '" height="' + d[1] + '" ' +
      'loading="lazy" alt="' + alt + '" />' +
      '</picture>'
    );
  }

  /* A stack of slides plus dot navigation. Only the active slide is shown. */
  function galleryMarkup(card, i) {
    var slides = card.gallery
      .map(function (shot, n) {
        return (
          '<span class="shot' + (n === 0 ? ' is-on' : '') + '" data-shot="' + n + '"' +
          (n === 0 ? '' : ' aria-hidden="true"') + '>' +
          picture(shot.src, shot.alt) +
          '</span>'
        );
      })
      .join('');

    var dots = card.gallery
      .map(function (shot, n) {
        return (
          '<button class="dot' + (n === 0 ? ' is-on' : '') + '" type="button" ' +
          'data-dot="' + n + '"' + (n === 0 ? ' aria-current="true"' : '') +
          ' aria-label="Photo ' + (n + 1) + ': ' + shot.alt + '"></button>'
        );
      })
      .join('');

    return (
      '<span class="gal" data-gallery="' + i + '">' +
      '<span class="gal__stack">' + slides +
      '<button class="gal__arrow gal__arrow--prev" type="button" data-step="-1" ' +
      'aria-label="Previous photo">' + P.icon('chevronLeft', 18) + '</button>' +
      '<button class="gal__arrow gal__arrow--next" type="button" data-step="1" ' +
      'aria-label="Next photo">' + P.icon('chevronRight', 18) + '</button>' +
      '<span class="gal__dots">' + dots + '</span>' +
      (card.poke ? badge(card) : '') +
      '</span>' +
      '<span class="gal__caption">' + card.gallery[0].caption + '</span>' +
      '</span>'
    );
  }

  function badge(card) {
    return '<span class="gal__poke">' + (card.pokeLabel || 'tap me') + '</span>';
  }

  /* Keep the caption hint using the same verb as the badge on the photo. */
  function hintFor(card) {
    if (!card.poke) return 'flip';
    var verb = (card.pokeLabel || 'tap me').split(' ')[0];
    return verb + ' the photo, or flip';
  }

  /* The card's only always-available control. It sits outside the rotating
     stage on purpose: inside, it would end up in a face that is hidden when the
     card is flipped, leaving keyboard focus stranded in a hidden subtree. */
  function capButton(title, hint) {
    return (
      '<button class="flip__cap" type="button" aria-expanded="false">' +
      '<span>' + title + '</span>' +
      '<span class="flip__hint">' + hint + '</span>' +
      '</button>'
    );
  }

  function renderCard(card, i) {
    var front;

    if (card.gallery) {
      front = {
        body: galleryMarkup(card, i),
        cap: capButton(card.title, hintFor(card))
      };
    } else if (card.image) {
      front = {
        body:
          '<span class="flip__media' +
          (card.fit === 'contain' ? ' flip__media--contain' : '') + '">' +
          picture(card.image, card.alt) +
          (card.poke ? badge(card) : '') +
          '</span>',
        cap: capButton(card.title, hintFor(card))
      };
    } else {
      front = {
        body: '<span class="flip__icon">' + P.icon(card.icon || 'book', 30) + '</span>' +
              '<span class="flip__lead">' + card.front + '</span>',
        cap: capButton(card.title, 'flip')
      };
    }

    var back =
      '<p>' + card.back + '</p>' +
      (card.url ? '<span class="flip__link">' + card.linkLabel + ' &rarr;</span>' : '');

    return (
      '<div class="flip' + (card.poke ? ' flip--poke' : '') +
      (card.kind === 'plants' ? ' flip--plant' : '') + '" data-card="' + i + '"' +
      (card.poke ? ' data-poke="1"' : '') +
      (card.url ? ' data-url="' + card.url + '"' : '') + '>' +
      '<span class="flip__stage">' +
      '<span class="flip__inner">' +
      '<span class="flip__face flip__front">' + front.body + '</span>' +
      '<span class="flip__face flip__back">' + back + '</span>' +
      '</span>' +
      '</span>' +
      front.cap +
      '</div>'
    );
  }

  /* Show slide n of a gallery and sync its dots and caption. */
  function showShot(gal, n) {
    var shots = gal.querySelectorAll('.shot');
    var dots = gal.querySelectorAll('.dot');
    var index = ((n % shots.length) + shots.length) % shots.length;

    for (var i = 0; i < shots.length; i++) {
      var on = i === index;
      shots[i].classList.toggle('is-on', on);
      // The off-screen slides are still in the DOM at opacity 0, so they have to
      // be taken out of the accessibility tree or a screen reader announces all
      // of them at once.
      if (on) shots[i].removeAttribute('aria-hidden');
      else shots[i].setAttribute('aria-hidden', 'true');

      if (dots[i]) {
        dots[i].classList.toggle('is-on', on);
        if (on) dots[i].setAttribute('aria-current', 'true');
        else dots[i].removeAttribute('aria-current');
      }
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

      /* One delegated handler for every flip card on the page. */
      document.addEventListener('click', function (e) {
        if (e.target.closest('.gal__arrow, .dot')) return;

        var card = e.target.closest('.flip');
        if (!card) return;

        // Poking the plant photo fires confetti instead of flipping, so you can
        // keep poking it. The caption bar still flips the card.
        var photo = e.target.closest('.gal__stack, .flip__media');
        if (card.dataset.poke && photo) {
          var data = P.data.offDuty[Number(card.dataset.card)];
          var r = photo.getBoundingClientRect();
          var cx = r.left + r.width / 2;
          var cy = r.top + r.height / 2;

          P.confetti.burst(cx, cy, data && data.kind === 'plants' ? 'plant' : 'konami');

          var quips = (data && data.quips) || P.data.plantQuips;
          P.confetti.say(quips[quipIndex % quips.length], cx, cy);
          quipIndex++;
          return;
        }

        var flipped = card.classList.toggle('is-flipped');
        var cap = card.querySelector('.flip__cap');
        if (cap) cap.setAttribute('aria-expanded', String(flipped));

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
            var cap = card.querySelector('.flip__cap');
            if (cap) cap.setAttribute('aria-expanded', 'false');
          }
        );
      });
    }
  };
})(window.Portfolio = window.Portfolio || {});
