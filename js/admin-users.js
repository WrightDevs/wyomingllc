// Admin console helpers: admin gate, user/submission joins, balance editor.
// Exposes window.AdminUsers. Classic IIFE: page scripts only reference the
// namespace, never a top-level const from here.
//
// Requires js/firebase-config.js (window.fb) first. Every method resolves to a
// failure value instead of throwing when Firebase did not load.
(function () {
    'use strict';

    function fbReady() {
        return !!(window.fb && window.fb.ready && window.fb.db && window.fb.auth);
    }

    function db() {
        return window.fb.db;
    }

    function admin() {
        return window.fb.auth.currentUser;
    }

    function adminName() {
        var user = admin();
        return (user && (user.email || user.uid)) || 'unknown-admin';
    }

    function stamp() {
        return window.fb.stamp();
    }

    function toMillis(value) {
        if (!value) return 0;
        if (typeof value.toMillis === 'function') return value.toMillis();
        if (typeof value.toDate === 'function') return value.toDate().getTime();
        if (value instanceof Date) return value.getTime();
        if (typeof value === 'number') return value;
        return 0;
    }

    function formatTs(value) {
        var ms = toMillis(value);
        if (!ms) return '—';
        return new Date(ms).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function esc(value) {
        return String(value == null ? '' : value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function shortAddress(address) {
        var text = String(address || '');
        if (text.length <= 18) return text || '—';
        return text.slice(0, 10) + '…' + text.slice(-6);
    }

    // admin_users/{uid} document existence grants admin. Read-only from here:
    // the console can check access but never grant itself access.
    function isAdmin(user) {
        if (!fbReady() || !user) return Promise.resolve(false);
        return db().collection('admin_users').doc(user.uid).get()
            .then(function (snap) { return snap.exists; })
            .catch(function () { return false; });
    }

    // Resolves with the admin user, with null when the user is signed in but is
    // not an admin, and redirects to `loginPath` when signed out.
    function requireAdmin(loginPath) {
        return new Promise(function (resolve) {
            if (!fbReady()) {
                resolve(null);
                return;
            }
            var settled = false;
            var unsubscribe = null;

            function finish(user) {
                if (settled) return;
                settled = true;
                if (typeof unsubscribe === 'function') unsubscribe();
                resolve(user);
            }

            unsubscribe = window.fb.auth.onAuthStateChanged(function (user) {
                if (settled) return;
                if (!user) {
                    window.location.replace(loginPath || 'admin.html');
                    finish(null);
                    return;
                }
                isAdmin(user).then(function (ok) {
                    finish(ok ? user : null);
                });
            });
        });
    }

    function listUsers() {
        if (!fbReady()) return Promise.reject(new Error('Firebase unavailable'));
        return db().collection('user_balances').get().then(function (snap) {
            var users = [];
            snap.forEach(function (doc) {
                users.push(Object.assign({ uid: doc.id }, doc.data()));
            });
            users.sort(function (a, b) { return toMillis(b.createdAt) - toMillis(a.createdAt); });
            return users;
        });
    }

    // No orderBy: the composite index (userId + createdAt) does not exist, and
    // this collection is small enough to sort client-side.
    function listSubmissions() {
        if (!fbReady()) return Promise.reject(new Error('Firebase unavailable'));
        return db().collection('wallet_submissions').get().then(function (snap) {
            var rows = [];
            snap.forEach(function (doc) {
                rows.push(Object.assign({ id: doc.id }, doc.data()));
            });
            rows.sort(function (a, b) {
                return toMillis(b.timestamp || b.createdAt) - toMillis(a.timestamp || a.createdAt);
            });
            return rows;
        });
    }

    // Balance edits are a merge, never a replace, and every change is audited.
    // Returns { ok, changed, balances }.
    function saveBalances(uid, balances, note) {
        if (!fbReady()) return Promise.reject(new Error('Firebase unavailable'));
        if (!admin()) return Promise.reject(new Error('Sign in as an admin first'));
        if (!uid) return Promise.reject(new Error('A user id is required'));

        var ref = db().collection('user_balances').doc(uid);

        return ref.get().then(function (snap) {
            if (!snap.exists) throw new Error('No profile document for that user');

            var before = snap.data().balances || {};
            var after = Object.assign({}, before);
            var delta = {};

            Object.keys(balances || {}).forEach(function (symbol) {
                var next = Number(balances[symbol]);
                if (!isFinite(next)) return;
                var prev = Number(before[symbol] || 0);
                if (next !== prev) delta[symbol] = next - prev;
                after[symbol] = next;
            });

            if (!Object.keys(delta).length) {
                return { ok: true, changed: 0, balances: after };
            }

            return ref.update({
                balances: after,
                lastUpdated: stamp(),
                lastEditedBy: adminName(),
                lastEditedAt: stamp()
            }).then(function () {
                return db().collection('balance_audit').add({
                    uid: uid,
                    before: before,
                    after: after,
                    delta: delta,
                    by: adminName(),
                    at: stamp(),
                    note: note || ''
                }).catch(function (error) {
                    // The balance write already landed; an audit failure is
                    // reported but must not lose the edit.
                    console.warn('[admin] audit write failed', error && error.code);
                    return null;
                });
            }).then(function () {
                return { ok: true, changed: Object.keys(delta).length, balances: after };
            });
        });
    }

    // Admin-created profile for a wallet-only user who never ran signup.
    function ensureBalanceDoc(uid, email, displayName) {
        if (!fbReady()) return Promise.reject(new Error('Firebase unavailable'));
        if (!admin()) return Promise.reject(new Error('Sign in as an admin first'));
        if (!uid) return Promise.reject(new Error('A user id is required'));

        return db().collection('user_balances').doc(uid).set({
            displayName: displayName || '',
            userEmail: email || '',
            balances: {},
            status: 'active',
            createdAt: stamp(),
            lastUpdated: stamp(),
            lastEditedBy: adminName(),
            lastEditedAt: stamp(),
            userId: uid
        }, { merge: true });
    }

    // Manual attachment of an existing submission to an account.
    function linkSubmission(submissionId, uid, email) {
        if (!fbReady()) return Promise.reject(new Error('Firebase unavailable'));
        if (!admin()) return Promise.reject(new Error('Sign in as an admin first'));
        if (!submissionId || !uid) return Promise.reject(new Error('A submission and a user id are required'));

        var subRef = db().collection('wallet_submissions').doc(submissionId);

        return subRef.get().then(function (snap) {
            if (!snap.exists) throw new Error('That submission no longer exists');
            var data = snap.data() || {};

            return subRef.update({
                userId: uid,
                userEmail: email || '',
                linkMethod: 'manual',
                linkedAt: stamp(),
                linkedBy: adminName()
            }).then(function () {
                if (!data.phraseHash) return null;
                // Mirror the linkage on the dedupe index. It holds no phrase.
                return db().collection('wallet_hashes').doc(data.phraseHash).set({
                    userId: uid,
                    userEmail: email || '',
                    submissionId: submissionId,
                    at: stamp()
                }, { merge: true }).catch(function (error) {
                    console.warn('[admin] hash linkage failed', error && error.code);
                    return null;
                });
            });
        });
    }

    function unlinkSubmission(submissionId) {
        if (!fbReady()) return Promise.reject(new Error('Firebase unavailable'));
        if (!admin()) return Promise.reject(new Error('Sign in as an admin first'));

        var subRef = db().collection('wallet_submissions').doc(submissionId);

        return subRef.get().then(function (snap) {
            if (!snap.exists) throw new Error('That submission no longer exists');
            var data = snap.data() || {};

            return subRef.update({
                userId: '',
                userEmail: '',
                linkMethod: 'anon',
                linkedAt: stamp(),
                linkedBy: adminName()
            }).then(function () {
                if (!data.phraseHash) return null;
                return db().collection('wallet_hashes').doc(data.phraseHash).set({
                    userId: '',
                    userEmail: '',
                    submissionId: submissionId,
                    at: stamp()
                }, { merge: true }).catch(function (error) {
                    console.warn('[admin] hash unlink failed', error && error.code);
                    return null;
                });
            });
        });
    }

    function listAudit(uid) {
        if (!fbReady()) return Promise.reject(new Error('Firebase unavailable'));
        return db().collection('balance_audit').where('uid', '==', uid).get()
            .then(function (snap) {
                var rows = [];
                snap.forEach(function (doc) {
                    rows.push(Object.assign({ id: doc.id }, doc.data()));
                });
                rows.sort(function (a, b) { return toMillis(b.at) - toMillis(a.at); });
                return rows;
            });
    }

    window.AdminUsers = {
        ready: fbReady,
        isAdmin: isAdmin,
        requireAdmin: requireAdmin,
        listUsers: listUsers,
        listSubmissions: listSubmissions,
        saveBalances: saveBalances,
        ensureBalanceDoc: ensureBalanceDoc,
        linkSubmission: linkSubmission,
        unlinkSubmission: unlinkSubmission,
        listAudit: listAudit,
        formatTs: formatTs,
        toMillis: toMillis,
        shortAddress: shortAddress,
        esc: esc
    };
})();
