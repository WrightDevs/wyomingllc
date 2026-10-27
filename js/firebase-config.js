// Firebase bootstrap.
// Exposes window.fb = { ready, auth, db, stamp }.
// No top-level consts: page scripts declare their own firebaseConfig.
// Safe to include on every page; re-initialisation is a no-op.
(function () {
    'use strict';

    var config = {
        apiKey: 'AIzaSyCnBgSQy4SsvmR73iedkHCWKoseUyALS6s',
        authDomain: 'wyominglimited0.firebaseapp.com',
        projectId: 'wyominglimited0',
        storageBucket: 'wyominglimited0.firebasestorage.app',
        messagingSenderId: '580988653712',
        appId: '1:580988653712:web:c3b28d07bf8409f93ec815',
        measurementId: 'G-MT8SLSYM3S'
    };

    var ready = false;
    var auth = null;
    var db = null;

    try {
        if (window.firebase && typeof window.firebase.initializeApp === 'function') {
            // Reuse an app that a page already booted instead of throwing
            // "Firebase App named '[DEFAULT]' already exists".
            var apps = window.firebase.apps || [];
            if (!apps.length) window.firebase.initializeApp(config);

            if (typeof window.firebase.auth === 'function') {
                auth = window.firebase.auth();
            }
            if (typeof window.firebase.firestore === 'function') {
                db = window.firebase.firestore();
            }
            ready = true;
        }
    } catch (err) {
        // Leave ready=false so callers can render a "service unavailable" state
        // instead of throwing on load.
        if (window.console && console.error) console.error('[fb] init failed', err);
    }

    // Firestore server timestamp when available, plain Date otherwise.
    function stamp() {
        try {
            if (ready && window.firebase.firestore && window.firebase.firestore.FieldValue) {
                return window.firebase.firestore.FieldValue.serverTimestamp();
            }
        } catch (err) {
            /* fall through */
        }
        return new Date();
    }

    window.fb = {
        ready: ready,
        auth: auth,
        db: db,
        stamp: stamp
    };
})();
