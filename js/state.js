/* state.js
 *
 * The small amount of state worth keeping in one place: active tab, theme,
 * publication filter, expanded timeline year. Theme survives reloads via
 * localStorage; the tab survives via the URL hash so a panel can be linked to.
 */
(function (P) {
  'use strict';

  var THEME_KEY = 'oy-theme';
  var TABS = ['about', 'work', 'research', 'skills', 'journey', 'next', 'offduty'];

  var listeners = {};

  function emit(evt, payload) {
    (listeners[evt] || []).forEach(function (fn) {
      fn(payload);
    });
  }

  var store = {
    /* localStorage throws in some private-browsing modes, so every access is
       guarded and simply degrades to not remembering. */
    read: function (key) {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        return null;
      }
    },
    write: function (key, value) {
      try {
        localStorage.setItem(key, value);
      } catch (e) { /* not fatal */ }
    }
  };

  P.state = {
    tabs: TABS,
    activeTab: 'about',
    filter: 'all',
    expandedYear: null,
    reducedMotion: false,

    on: function (evt, fn) {
      (listeners[evt] = listeners[evt] || []).push(fn);
      return this;
    },

    /* --------------------------------------------------------------- theme */

    getTheme: function () {
      return document.documentElement.getAttribute('data-theme') === 'light'
        ? 'light'
        : 'dark';
    },

    setTheme: function (theme) {
      var next = theme === 'light' ? 'light' : 'dark';
      var root = document.documentElement;

      // WebKit will not re-resolve a custom property that a transition is
      // currently watching, so any element transitioning background-color or
      // border-color keeps its old theme's value and you get dark buttons on a
      // light page. Killing transitions across the swap sidesteps that, and
      // makes the change read as instant rather than as a slow tint.
      root.classList.add('theme-switching');
      root.setAttribute('data-theme', next);
      store.write(THEME_KEY, next);

      // Two frames: one for the new values to be applied, one before
      // transitions are allowed to matter again.
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          root.classList.remove('theme-switching');
        });
      });

      emit('theme', next);
      return next;
    },

    toggleTheme: function () {
      return this.setTheme(this.getTheme() === 'dark' ? 'light' : 'dark');
    },

    /* ---------------------------------------------------------------- tabs */

    setTab: function (name, opts) {
      if (TABS.indexOf(name) === -1 || name === this.activeTab) return false;
      this.activeTab = name;
      if (!opts || !opts.silent) {
        // replaceState rather than assigning location.hash, so switching tabs
        // does not stack up history entries or jump-scroll the page.
        try {
          history.replaceState(null, '', '#' + name);
        } catch (e) {
          /* file:// in some browsers refuses replaceState; the tab still works */
        }
      }
      emit('tab', name);
      return true;
    },

    tabFromHash: function () {
      var h = (location.hash || '').replace(/^#/, '');
      return TABS.indexOf(h) !== -1 ? h : null;
    },

    /* -------------------------------------------------------------- filter */

    setFilter: function (value) {
      if (this.filter === value) return false;
      this.filter = value;
      emit('filter', value);
      return true;
    },

    /* ------------------------------------------------------------ timeline */

    setExpandedYear: function (year) {
      this.expandedYear = year;
      emit('year', year);
      return year;
    },

    /* ------------------------------------------------------------- motion */

    initMotion: function () {
      // Guarded: a missing matchMedia must not take the whole boot down with it.
      if (typeof window.matchMedia !== 'function') {
        this.reducedMotion = false;
        return;
      }
      var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.reducedMotion = mq.matches;
      var self = this;
      var onChange = function () {
        self.reducedMotion = mq.matches;
        emit('motion', mq.matches);
      };
      // Safari below 14 only has the deprecated listener API.
      if (mq.addEventListener) mq.addEventListener('change', onChange);
      else if (mq.addListener) mq.addListener(onChange);
    }
  };
})(window.Portfolio = window.Portfolio || {});
