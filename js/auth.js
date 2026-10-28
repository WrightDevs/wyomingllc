// Auth helpers. Exposes window.Auth. Requires js/firebase-config.js first.
// Every method is safe to call when Firebase failed to load: it resolves to a
// failure result instead of throwing.
(function () {
    'use strict';

    function fbReady() {
        return !!(window.fb && window.fb.ready && window.fb.auth);
    }

    // Redirect targets are written as page-relative names ("login.html").
    // Resolve them against the site root so the same call works from / and
    // from /admin/. Absolute URLs and root-relative paths pass through.
    function resolvePath(path) {
        if (!path) return path;
        if (/^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(path)) return path;
        if (path.charAt(0) === '/') return path;
        var segments = window.location.pathname.split('/');
        segments.pop(); // drop the current file (or the trailing empty segment)
        var depth = segments.filter(function (part) { return part.length > 0; }).length;
        return new Array(depth + 1).join('../') + path;
    }

    function redirect(path) {
        window.location.replace(resolvePath(path) || 'login.html');
    }

    function friendly(code) {
        var messages = {
            'auth/invalid-email': 'Invalid email address format.',
            'auth/missing-email': 'Enter your email address.',
            'auth/missing-password': 'Enter your password.',
            'auth/user-disabled': 'This account has been disabled.',
            'auth/user-not-found': 'No account found with this email.',
            'auth/wrong-password': 'Incorrect password. Please try again.',
            'auth/invalid-credential': 'Email or password is incorrect.',
            'auth/invalid-login-credentials': 'Email or password is incorrect.',
            'auth/email-already-in-use': 'Email already registered. Try logging in instead.',
            'auth/weak-password': 'Password should be at least 6 characters.',
            'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
            'auth/network-request-failed': 'Network error. Please check your connection.',
            'auth/popup-closed-by-user': 'Sign-in popup was closed.',
            'auth/cancelled-popup-request': 'Only one popup request is allowed at a time.',
            'auth/operation-not-allowed': 'This sign-in method is not enabled.',
            'auth/requires-recent-login': 'Please sign in again to continue.',
            'permission-denied': 'You do not have permission to do that.',
            'unavailable': 'Service temporarily unavailable. Please try again.'
        };
        return messages[code] || 'Something went wrong. Please try again.';
    }

    function result(ok, data, error) {
        if (ok) return { success: true, user: data.user || null, data: data };
        return {
            success: false,
            error: error && error.message ? error.message : friendly(error && error.code),
            code: (error && error.code) || null
        };
    }

    // Guard a page. Resolves with the signed-in user, or null after sending the
    // visitor to `path`. Never rejects.
    function requireAuth(path) {
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
                if (user) {
                    finish(user);
                } else {
                    redirect(path);
                    finish(null);
                }
            });
        });
    }

    // Watch auth on a page that also has a live signed-in view.
    // opts: { onUser(user), onNoUser(), requireVerified }
    function initAuthStateListener(path, opts) {
        var options = opts || {};
        if (!fbReady()) return function () {};

        return window.fb.auth.onAuthStateChanged(function (user) {
            if (user && options.requireVerified && !user.emailVerified) {
                window.fb.auth.signOut().then(function () {
                    if (typeof options.onNoUser === 'function') options.onNoUser();
                    else if (path) redirect(path);
                });
                return;
            }
            if (user) {
                if (typeof options.onUser === 'function') options.onUser(user);
                return;
            }
            if (typeof options.onNoUser === 'function') options.onNoUser();
            else if (path) redirect(path);
        });
    }

    // Merged auth + Firestore profile. Async: the Firestore document wins for
    // displayName, the auth profile is the fallback.
    function getProfile() {
        if (!fbReady() || !window.fb.auth.currentUser) return Promise.resolve(null);
        var user = window.fb.auth.currentUser;
        var profile = {
            uid: user.uid,
            userId: user.uid,
            email: user.email || '',
            userEmail: user.email || '',
            displayName: user.displayName || '',
            emailVerified: !!user.emailVerified,
            photoURL: user.photoURL || '',
            balances: {},
            status: 'active',
            source: 'auth'
        };
        if (!window.fb.db) return Promise.resolve(profile);

        return window.fb.db.collection('user_balances').doc(user.uid).get()
            .then(function (snap) {
                if (!snap.exists) return profile;
                var data = snap.data() || {};
                return Object.assign(profile, data, {
                    uid: user.uid,
                    userId: user.uid,
                    email: user.email || data.userEmail || '',
                    userEmail: user.email || data.userEmail || '',
                    displayName: data.displayName || profile.displayName,
                    balances: data.balances || {},
                    source: 'firestore'
                });
            })
            .catch(function (err) {
                profile.error = err.code || err.message;
                return profile;
            });
    }

    function loginWithEmail(email, password, rememberMe) {
        if (!fbReady()) {
            return Promise.resolve(result(false, {}, { code: 'unavailable' }));
        }
        var auth = window.fb.auth;
        var persistence = rememberMe
            ? window.firebase.auth.Auth.Persistence.LOCAL
            : window.firebase.auth.Auth.Persistence.SESSION;

        return auth.setPersistence(persistence)
            .then(function () {
                return auth.signInWithEmailAndPassword(email, password);
            })
            .then(function (credential) {
                var user = credential.user;
                if (!user.emailVerified) {
                    return auth.signOut().then(function () {
                        return {
                            success: false,
                            user: null,
                            code: 'auth/email-not-verified',
                            error: 'Please verify your email before signing in.'
                        };
                    });
                }
                return result(true, { user: user });
            })
            .catch(function (err) {
                return result(false, {}, err);
            });
    }

    // Creates the auth account, sets the display name, sends the verification
    // email, and makes sure user_balances/{uid} exists.
    function registerUser(email, password, displayName) {
        if (!fbReady()) {
            return Promise.resolve(result(false, {}, { code: 'unavailable' }));
        }
        var auth = window.fb.auth;
        var user = null;

        return auth.createUserWithEmailAndPassword(email, password)
            .then(function (credential) {
                user = credential.user;
                if (displayName) return user.updateProfile({ displayName: displayName });
                return null;
            })
            .then(function () {
                return user.sendEmailVerification().catch(function () { return null; });
            })
            .then(function () {
                return ensureUser().catch(function () { return null; });
            })
            .then(function () {
                return result(true, { user: user });
            })
            .catch(function (err) {
                return result(false, {}, err);
            });
    }

    function resetPassword(email) {
        if (!fbReady()) {
            return Promise.resolve(result(false, {}, { code: 'unavailable' }));
        }
        return window.fb.auth.sendPasswordResetEmail(email)
            .then(function () { return result(true, {}); })
            .catch(function (err) { return result(false, {}, err); });
    }

    function signOut(next) {
        if (!fbReady()) {
            if (next) redirect(next);
            return Promise.resolve(result(true, {}));
        }
        return window.fb.auth.signOut()
            .then(function () {
                if (next) redirect(next);
                return result(true, {});
            })
            .catch(function (err) {
                return result(false, {}, err);
            });
    }

    // Idempotent: creates user_balances/{uid} when missing, fills blank profile
    // fields when present, never overwrites balances or createdAt.
    function ensureUser() {
        if (!fbReady() || !window.fb.auth.currentUser) return Promise.resolve(null);
        var user = window.fb.auth.currentUser;
        if (!window.fb.db) return Promise.resolve(user);
        var ref = window.fb.db.collection('user_balances').doc(user.uid);

        return ref.get()
            .then(function (snap) {
                if (!snap.exists) {
                    return ref.set({
                        displayName: user.displayName || '',
                        userEmail: user.email || '',
                        balances: {},
                        status: 'active',
                        createdAt: window.fb.stamp(),
                        lastUpdated: window.fb.stamp(),
                        lastEditedBy: '',
                        lastEditedAt: null,
                        userId: user.uid
                    }, { merge: true });
                }
                var data = snap.data() || {};
                var patch = { userId: user.uid, lastUpdated: window.fb.stamp() };
                if (!data.displayName && user.displayName) patch.displayName = user.displayName;
                if (!data.userEmail && user.email) patch.userEmail = user.email;
                if (!data.balances || typeof data.balances !== 'object') patch.balances = {};
                if (!data.status) patch.status = 'active';
                return ref.set(patch, { merge: true });
            })
            .then(function () { return user; })
            .catch(function (err) {
                if (window.console && console.warn) console.warn('[auth] ensureUser failed', err);
                return user;
            });
    }

    window.Auth = {
        requireAuth: requireAuth,
        initAuthStateListener: initAuthStateListener,
        getProfile: getProfile,
        loginWithEmail: loginWithEmail,
        registerUser: registerUser,
        resetPassword: resetPassword,
        signOut: signOut,
        ensureUser: ensureUser,
        friendly: friendly,
        resolvePath: resolvePath
    };
})();
