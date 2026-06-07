/* =====================================================================
   THEME CONFIG  —  behaviour settings (edit the values in CONFIG below)
   ---------------------------------------------------------------------
   The actual COLOURS live in  src/css/theme.css.
   This file decides WHICH palette is shown and whether visitors can
   switch it. It is loaded in the <head> of every page so the choice is
   applied before the first paint (no colour flash).
   ===================================================================== */

window.SITE_THEME = {
    /* Palette shown to first-time visitors (before they pick one):
         'green'  → Castleton green   (theme.css [data-palette="alt"])
         'indigo' → original indigo   (theme.css :root)                  */
    defaultPalette: 'green',

    /* Show the palette switch button in the navbar?  true | false       */
    enablePaletteToggle: true,
};

/* ---------------------------------------------------------------------
   Internals — no need to edit below this line.
   Applies the resolved palette immediately (runs before <body> paints)
   and exposes window.__applyPalette() for the navbar toggle button.
   --------------------------------------------------------------------- */
(function () {
    var cfg = window.SITE_THEME || {};

    function apply(name) {
        if (name === 'green') {
            document.documentElement.setAttribute('data-palette', 'alt');
        } else {
            document.documentElement.removeAttribute('data-palette');
        }
    }

    // Saved choice wins over the config default.
    var saved = localStorage.getItem('palette');
    if (saved === 'alt') saved = 'green';          // legacy value support
    if (saved === 'default') saved = 'indigo';     // legacy value support

    apply(saved || cfg.defaultPalette || 'indigo');

    // Shared helper used by the toggle button in main.js / aggregate.js
    window.__applyPalette = function (name) {
        apply(name);
        localStorage.setItem('palette', name);
    };
})();
