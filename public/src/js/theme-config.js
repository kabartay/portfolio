/* =====================================================================
   THEME CONFIG  —  behaviour settings (edit the values in CONFIG below)
   ---------------------------------------------------------------------
   The actual COLOURS live in  src/css/theme.css.
   This file decides WHICH palettes exist, which one is the default, and
   whether visitors can switch. Loaded in the <head> of every page so the
   choice is applied before first paint (no colour flash).
   ===================================================================== */

window.SITE_THEME = {
    /* Palettes the navbar swatch cycles through, in order.
         key   → identifier saved to localStorage
         label → shown in the button tooltip
         attr  → the data-palette attribute value
                 (null  = the default :root palette, i.e. Indigo)        */
    palettes: [
        { key: 'green',  label: 'Castleton Green', attr: 'alt' },
        { key: 'indigo', label: 'Indigo',          attr: null },
    ],

    /* Palette shown to first-time visitors (must be a key above).       */
    defaultPalette: 'green',

    /* Show the palette switch button in the navbar?  true | false       */
    enablePaletteToggle: true,
};

/* ---------------------------------------------------------------------
   Internals — no need to edit below this line.
   Applies the resolved palette immediately (runs before <body> paints)
   and exposes helpers used by the navbar swatch in main.js/aggregate.js.
   --------------------------------------------------------------------- */
(function () {
    var cfg  = window.SITE_THEME || {};
    var list = cfg.palettes || [];

    function entry(key) {
        for (var i = 0; i < list.length; i++) { if (list[i].key === key) return list[i]; }
        return null;
    }

    function apply(key) {
        var e = entry(key) || list[0];
        if (!e) return;
        if (e.attr) document.documentElement.setAttribute('data-palette', e.attr);
        else        document.documentElement.removeAttribute('data-palette');
    }

    // Resolve starting palette: saved choice wins, else config default.
    var saved = localStorage.getItem('palette');
    if (saved === 'alt')     saved = 'green';    // legacy value support
    if (saved === 'default') saved = 'indigo';   // legacy value support
    var startKey = (entry(saved) ? saved : cfg.defaultPalette) || (list[0] && list[0].key);

    apply(startKey);
    window.__themeState = { current: startKey };

    // Set a palette by key (used internally + by future controls)
    window.__applyPalette = function (key) {
        apply(key);
        localStorage.setItem('palette', key);
        window.__themeState.current = key;
    };

    // Advance to the next palette in the list; returns the new entry.
    window.__cyclePalette = function () {
        var idx = 0;
        for (var i = 0; i < list.length; i++) {
            if (list[i].key === window.__themeState.current) { idx = i; break; }
        }
        var next = list[(idx + 1) % list.length];
        window.__applyPalette(next.key);
        return next;
    };

    // Human-readable label for the current (or given) palette key.
    window.__paletteLabel = function (key) {
        var e = entry(key || window.__themeState.current);
        return e ? e.label : (key || '');
    };
})();
