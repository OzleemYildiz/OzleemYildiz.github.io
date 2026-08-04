/* skills.js - current-profile radar plus the grouped skill pills. */
(function (P) {
  'use strict';

  var radar = null;
  var played = false;

  P.skills = {
    init: function () {
      radar = new P.Radar(document.getElementById('radar-skills'), {
        axes: P.data.radarAxes,
        max: P.data.radarMax
      });

      document.getElementById('skillgroups').innerHTML = P.data.skillGroups
        .map(function (group) {
          return (
            '<div class="pillgroup">' +
            '<p class="section-title">' + group.name + '</p>' +
            '<div class="pills">' +
            group.skills
              .map(function (s) { return '<span class="pill">' + s + '</span>'; })
              .join('') +
            '</div></div>'
          );
        })
        .join('');

      // Grow from the centre the first time the tab is opened, then hold.
      P.state.on('tab', function (name) {
        if (name !== 'skills' || played) return;
        played = true;
        var latest = P.data.timeline[P.data.timeline.length - 1].values;
        setTimeout(function () { radar.to(latest, 780); }, 90);
      });
    },

    /* Used when Skills is the tab the page loads on. */
    playIfActive: function () {
      if (P.state.activeTab !== 'skills' || played) return;
      played = true;
      var latest = P.data.timeline[P.data.timeline.length - 1].values;
      setTimeout(function () { radar.to(latest, 780); }, 220);
    }
  };
})(window.Portfolio = window.Portfolio || {});
