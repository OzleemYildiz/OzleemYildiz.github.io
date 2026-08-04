/* aspirations.js
 *
 * The "What's next" tab: three goal cards, plus a small keyboard easter egg.
 * Typing "yes" while the tab is open sets the three cards off one after
 * another. A hint on the page makes it findable rather than secret.
 */
(function (P) {
  'use strict';

  var WORD = 'yes';
  var typed = '';

  function fireFrom(card, delay, palette) {
    setTimeout(function () {
      var r = card.getBoundingClientRect();
      // Skip anything scrolled out of view; confetti off screen is just wasted.
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      P.confetti.burst(r.left + r.width / 2, r.top + r.height / 2, palette, 40);
    }, delay);
  }

  function celebrate() {
    var cards = document.querySelectorAll('#goals .goal');
    if (!cards.length) return;

    Array.prototype.forEach.call(cards, function (card, i) {
      card.classList.remove('is-hit');
      // Reflow so the pop animation restarts on a repeat trigger.
      void card.offsetWidth;
      card.classList.add('is-hit');
      fireFrom(card, i * 150, 'konami');
      setTimeout(function () {
        card.classList.remove('is-hit');
      }, 700 + i * 150);
    });
  }

  P.aspirations = {
    init: function () {
      var d = P.data.aspirations;

      document.getElementById('goals-intro').textContent = d.intro;

      document.getElementById('goals').innerHTML = d.goals
        .map(function (g) {
          return (
            '<article class="goal">' +
            '<span class="goal__icon">' + P.icon(g.icon, 26) + '</span>' +
            '<h3 class="subhead">' + g.title + '</h3>' +
            '<p>' + g.body + '</p>' +
            '</article>'
          );
        })
        .join('');

      document.getElementById('goals-closing').textContent = d.closing;

      document.addEventListener('keydown', function (e) {
        // Only while this tab is open, and never while typing into a field.
        if (P.state.activeTab !== 'next') return;
        var tag = (e.target.tagName || '').toLowerCase();
        if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;
        if (e.key.length !== 1) return;

        typed = (typed + e.key.toLowerCase()).slice(-WORD.length);
        if (typed === WORD) {
          typed = '';
          celebrate();
        }
      });
    }
  };
})(window.Portfolio = window.Portfolio || {});
