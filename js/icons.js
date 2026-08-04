/* icons.js
 *
 * Hand-authored inline SVG. No icon font, no sprite sheet, no network request.
 * Every icon is a 24x24 stroked path so they share one set of attributes.
 */
(function (P) {
  'use strict';

  var PATHS = {
    mail: '<path d="M3 6.5h18v11H3z"/><path d="m3.6 7 8.4 6 8.4-6"/>',
    linkedin:
      '<path d="M4.5 9.5v9M4.5 5.6v.1M9.5 18.5v-9M9.5 13.2c0-2 1.3-3.2 3-3.2s3.5 1 3.5 3.6v4.9"/>',
    github:
      '<path d="M9 19.5c-4 1.2-4-2.1-5.5-2.5m11 5v-3.4c0-1 .1-1.4-.5-2 2.3-.3 4.5-1.2 4.5-5a3.9 3.9 0 0 0-1.1-2.7 3.6 3.6 0 0 0-.1-2.7s-.9-.3-2.9 1.1a10 10 0 0 0-5.2 0C7.2 5.9 6.3 6.2 6.3 6.2a3.6 3.6 0 0 0-.1 2.7A3.9 3.9 0 0 0 5 11.6c0 3.8 2.2 4.7 4.5 5-.6.6-.6 1.2-.5 2v3.4"/>',
    scholar: '<path d="m12 3 9 5-9 5-9-5 9-5z"/><path d="M6.5 10.8V16c0 1.4 2.5 2.6 5.5 2.6s5.5-1.2 5.5-2.6v-5.2"/>',
    file: '<path d="M13.5 3H7a1.5 1.5 0 0 0-1.5 1.5v15A1.5 1.5 0 0 0 7 21h10a1.5 1.5 0 0 0 1.5-1.5V8z"/><path d="M13.5 3v5h5"/><path d="M9 13h6M9 16.5h4"/>',
    book: '<path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H19v15.5H5.5A1.5 1.5 0 0 0 4 20z"/><path d="M4 18.5A1.5 1.5 0 0 1 5.5 17H19v4H5.5A1.5 1.5 0 0 1 4 19.5z"/>',
    camera:
      '<path d="M3 8.5h3.2l1.5-2.3h8.6L17.8 8.5H21v11H3z"/><circle cx="12" cy="13.6" r="3.4"/>',
    mountain: '<path d="m3 19 6-10 3.5 5.6L14.8 11 21 19z"/><path d="m8 11.5 1.6-2"/>',
    external: '<path d="M14 4h6v6"/><path d="m20 4-8.5 8.5"/><path d="M18 14.5V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4.5"/>',
    chevronLeft: '<path d="m14.5 5-7 7 7 7"/>',
    chevronRight: '<path d="m9.5 5 7 7-7 7"/>',
    bridge: '<path d="M3 16h18"/><path d="M3 16c0-5 4-8 9-8s9 3 9 8"/><path d="M7.5 16v-3.4M12 16V9.6M16.5 16v-3.4"/>',
    spark: '<path d="M12 3.5 13.9 9l5.6 1.9-5.6 1.9L12 18.5l-1.9-5.7L4.5 11 10.1 9z"/><path d="M18.5 4v3M20 5.5h-3"/>',
    compass: '<circle cx="12" cy="12" r="8.5"/><path d="m15 9-2 4.2L8.9 15l2-4.2z"/>',
    flip: '<path d="M20.5 11.5a8.5 8.5 0 0 0-14.6-5.4L3.5 8.5"/><path d="M3.5 4.5v4h4"/><path d="M3.5 12.5a8.5 8.5 0 0 0 14.6 5.4l2.4-2.4"/><path d="M20.5 19.5v-4h-4"/>'
  };

  /* svg(name, size) -> markup string. Callers set colour via currentColor. */
  P.icon = function (name, size) {
    var d = PATHS[name];
    if (!d) return '';
    var s = size || 24;
    return (
      '<svg viewBox="0 0 24 24" width="' + s + '" height="' + s + '" fill="none" ' +
      'stroke="currentColor" stroke-width="1.7" stroke-linecap="round" ' +
      'stroke-linejoin="round" aria-hidden="true" focusable="false">' + d + '</svg>'
    );
  };
})(window.Portfolio = window.Portfolio || {});
