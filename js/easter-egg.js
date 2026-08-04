/* easter-egg.js
 *
 * Konami code: up up down down left right left right B A. Instead of confetti,
 * the page drops into a fake terminal for a few seconds and types itself out.
 *
 * The overlay traps focus while it is up, closes on Escape, any key, or a
 * click, and is skipped entirely under reduced motion, where it appears fully
 * written rather than typing.
 */
(function (P) {
  'use strict';

  var CODE = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'b', 'a'
  ];

  var pos = 0;
  var overlay = null;
  var timers = [];
  var lastFocus = null;

  /* Lines are built from the same data the page uses, so this cannot drift. */
  function script() {
    var d = P.data.profile;
    var pubs = P.data.publications.length;
    var patents = P.data.patents.length;
    var now = P.data.currentWork;

    return [
      ['cmd', 'whoami'],
      ['out', d.name.toLowerCase()],
      ['cmd', 'cat role.txt'],
      ['out', now.title + ', ' + now.org],
      ['cmd', 'ls research/'],
      ['out', pubs + ' publications   ' + patents + ' patents   1 thesis'],
      ['cmd', './run_benchmarks.sh'],
      ['out', 'all green. as usual.'],
      ['cmd', 'echo $NEXT'],
      ['out', 'agent evaluation, and whatever it turns into'],
      ['hint', 'press any key']
    ];
  }

  function close() {
    timers.forEach(clearTimeout);
    timers = [];
    if (!overlay) return;

    overlay.classList.remove('is-on');
    var node = overlay;
    overlay = null;
    setTimeout(function () {
      node.remove();
    }, 260);

    document.removeEventListener('keydown', onDismiss, true);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function onDismiss(e) {
    // Any key closes it, so nobody feels stuck in a joke.
    e.preventDefault();
    e.stopPropagation();
    close();
  }

  function open() {
    if (overlay) return;
    lastFocus = document.activeElement;

    overlay = document.createElement('div');
    overlay.className = 'term';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Terminal easter egg');
    overlay.tabIndex = -1;

    var screen = document.createElement('pre');
    screen.className = 'term__screen';
    overlay.appendChild(screen);
    document.body.appendChild(overlay);

    // Reflow before adding the class so the fade actually runs.
    void overlay.offsetWidth;
    overlay.classList.add('is-on');
    overlay.focus();

    var lines = script();
    var reduced = P.state.reducedMotion;

    if (reduced) {
      screen.textContent = lines
        .map(function (l) {
          return (l[0] === 'cmd' ? '$ ' : l[0] === 'hint' ? '\n' : '> ') + l[1];
        })
        .join('\n');
    } else {
      var delay = 0;
      lines.forEach(function (line) {
        var prefix = line[0] === 'cmd' ? '$ ' : line[0] === 'hint' ? '\n' : '> ';
        var text = prefix + line[1] + '\n';
        // Commands type out; output arrives all at once, the way a shell behaves.
        if (line[0] === 'cmd') {
          for (var i = 0; i < text.length; i++) {
            (function (chunk, at) {
              timers.push(setTimeout(function () {
                screen.textContent += chunk;
              }, at));
            })(text[i], delay + i * 28);
          }
          delay += text.length * 28 + 140;
        } else {
          (function (chunk, at) {
            timers.push(setTimeout(function () {
              screen.textContent += chunk;
            }, at));
          })(text, delay);
          delay += 420;
        }
      });

      timers.push(setTimeout(close, delay + 2600));
    }

    document.addEventListener('keydown', onDismiss, true);
    overlay.addEventListener('click', close);
  }

  P.easterEgg = {
    init: function () {
      document.addEventListener('keydown', function (e) {
        if (overlay) return;

        // Ignore while typing, so the sequence cannot fire from a text field.
        var tag = (e.target.tagName || '').toLowerCase();
        if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;

        var key = e.key.length === 1 ? e.key.toLowerCase() : e.key;

        if (key === CODE[pos]) {
          pos++;
          if (pos === CODE.length) {
            pos = 0;
            open();
          }
        } else {
          // A wrong key restarts, but still counts if it is a fresh first key.
          pos = key === CODE[0] ? 1 : 0;
        }
      });
    },
    open: open
  };
})(window.Portfolio = window.Portfolio || {});
