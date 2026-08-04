/* easter-egg.js - Konami code. Up up down down left right left right B A. */
(function (P) {
  'use strict';

  var CODE = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'b', 'a'
  ];

  var pos = 0;

  function fire() {
    var w = window.innerWidth;
    var h = window.innerHeight;

    // Three staggered bursts across the viewport, so it reads as a wave.
    [0.22, 0.5, 0.78].forEach(function (fraction, i) {
      setTimeout(function () {
        P.confetti.burst(w * fraction, h * 0.34, 'konami', 60);
      }, i * 130);
    });

    P.confetti.say('you found it', w / 2, h * 0.5);
  }

  P.easterEgg = {
    init: function () {
      document.addEventListener('keydown', function (e) {
        // Ignore while typing, so the sequence cannot fire from a text field.
        var tag = (e.target.tagName || '').toLowerCase();
        if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;

        var key = e.key.length === 1 ? e.key.toLowerCase() : e.key;

        if (key === CODE[pos]) {
          pos++;
          if (pos === CODE.length) {
            pos = 0;
            fire();
          }
        } else {
          // A wrong key restarts, but still counts if it is a fresh first key.
          pos = key === CODE[0] ? 1 : 0;
        }
      });
    }
  };
})(window.Portfolio = window.Portfolio || {});
