/* tabs.js
 *
 * WAI-ARIA tabs with roving tabindex. Arrow keys move between tabs, Home and
 * End jump to the ends, Enter and Space activate. Panels are hidden rather than
 * removed, so filter state and expanded items survive a tab switch.
 */
(function (P) {
  'use strict';

  var tablist, indicator, tabs, panels;

  function nameOf(tab) {
    return tab.id.replace(/^tab-/, '');
  }

  function moveIndicator(tab) {
    if (!indicator || !tab) return;
    // offsetLeft is relative to .tablist, which is the indicator's containing
    // block, so this stays correct while the tab strip is scrolled sideways.
    indicator.style.width = tab.offsetWidth + 'px';
    indicator.style.transform = 'translateX(' + tab.offsetLeft + 'px)';
  }

  function activate(name, opts) {
    var options = opts || {};
    var changed = P.state.setTab(name, options);
    // Still sync the DOM on the first call, when activeTab already equals name.
    if (!changed && !options.force) return;

    tabs.forEach(function (tab) {
      var on = nameOf(tab) === name;
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
      tab.tabIndex = on ? 0 : -1;
      if (on) moveIndicator(tab);
    });

    panels.forEach(function (panel) {
      var on = panel.id === 'panel-' + name;
      panel.classList.toggle('is-active', on);
      if (on) {
        panel.hidden = false;
        if (!P.state.reducedMotion) {
          // Restart the entry animation by removing and reflowing the class.
          panel.classList.remove('is-entering');
          void panel.offsetWidth;
          panel.classList.add('is-entering');
        }
      } else {
        panel.hidden = true;
      }
    });

    if (options.focusTab) {
      var el = document.getElementById('tab-' + name);
      if (el) el.focus();
    }
  }

  function onKeydown(e) {
    var i = tabs.indexOf(document.activeElement);
    if (i === -1) return;

    var next = null;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        next = (i + 1) % tabs.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        next = (i - 1 + tabs.length) % tabs.length;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = tabs.length - 1;
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        activate(nameOf(tabs[i]));
        return;
      default:
        return;
    }

    e.preventDefault();
    // Follow-focus: moving the arrow keys switches the panel, which is the
    // pattern the APG recommends when panels are cheap to show.
    activate(nameOf(tabs[next]), { focusTab: true });
    if (tabs[next].scrollIntoView) {
      tabs[next].scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }

  P.tabs = {
    init: function () {
      tablist = document.getElementById('tablist');
      indicator = document.getElementById('tab-indicator');
      tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
      panels = Array.prototype.slice.call(document.querySelectorAll('[role="tabpanel"]'));

      tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
          activate(nameOf(tab));
        });
      });

      tablist.addEventListener('keydown', onKeydown);

      // Any element with data-goto acts as an in-page link to another tab.
      document.addEventListener('click', function (e) {
        var trigger = e.target.closest('[data-goto]');
        if (!trigger) return;
        e.preventDefault();
        activate(trigger.getAttribute('data-goto'));
        document.getElementById('main').scrollIntoView({ block: 'start' });
      });

      window.addEventListener('hashchange', function () {
        var name = P.state.tabFromHash();
        if (name) activate(name, { silent: true });
      });

      // Keep the underline glued to the tab when the strip reflows or scrolls.
      var reposition = function () {
        moveIndicator(document.getElementById('tab-' + P.state.activeTab));
      };
      window.addEventListener('resize', reposition);
      tablist.addEventListener('scroll', reposition, { passive: true });

      var initial = P.state.tabFromHash() || 'about';
      P.state.activeTab = initial;
      activate(initial, { silent: true, force: true });

      // Web fonts and images can shift the tab widths after first paint.
      window.addEventListener('load', reposition);
    },

    activate: activate
  };
})(window.Portfolio = window.Portfolio || {});
