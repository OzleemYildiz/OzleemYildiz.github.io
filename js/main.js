/* main.js
 *
 * The only entry point. Everything else exposes an init() and does nothing on
 * its own, so the wiring order lives here in one readable list.
 */
(function (P) {
  'use strict';

  function boot() {
    P.state.initMotion();

    // Content first: the tab machinery measures elements these render.
    P.about.init();
    P.work.init();
    P.publications.init();
    P.skills.init();
    P.timeline.init();
    P.aspirations.init();
    P.confetti.init();
    P.offduty.init();

    P.tabs.init();
    P.particles.init();
    P.easterEgg.init();

    /* ------------------------------------------------------- theme toggle */

    var toggle = document.getElementById('theme-toggle');

    var syncLabel = function () {
      var next = P.state.getTheme() === 'dark' ? 'light' : 'dark';
      toggle.setAttribute('aria-label', 'Switch to ' + next + ' theme');
    };

    toggle.addEventListener('click', function () {
      P.state.toggleTheme();
      syncLabel();
    });
    syncLabel();

    // If the page loaded straight onto Skills or Journey, their tab event never
    // fires, so nudge whichever one is already showing.
    P.skills.playIfActive();
    P.timeline.playIfActive();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})(window.Portfolio = window.Portfolio || {});
