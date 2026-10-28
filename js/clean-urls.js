// Clean URLs: drop ".html" from the address bar without a build step.
// Hosting (vercel.json cleanUrls) serves /dashboard for /dashboard.html.
// Skipped on file:// and local dev hosts where no rewrite exists.
(function () {
    'use strict';

    try {
        var protocol = window.location.protocol;
        var host = window.location.hostname;
        if (protocol !== 'http:' && protocol !== 'https:') return;
        if (!host || host === 'localhost' || host === '127.0.0.1' || host === '[::1]') return;

        var path = window.location.pathname;
        var clean = path;

        if (/\/index\.html$/i.test(clean)) {
            clean = clean.replace(/index\.html$/i, '');
        } else if (/\.html$/i.test(clean)) {
            clean = clean.replace(/\.html$/i, '');
        }

        if (clean !== path) {
            window.history.replaceState(
                window.history.state,
                '',
                clean + window.location.search + window.location.hash
            );
        }
    } catch (err) {
        // Cosmetic only: never break the page over a URL rewrite.
    }
})();
