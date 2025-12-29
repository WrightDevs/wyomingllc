// Authentication functions

// Initialize authentication state listener
function initAuthStateListener(redirectPath = '../index.html') {
    firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
            // Redirect to login if not authenticated
            window.location.href = redirectPath;
        }
    });
}

// Get current user
function getCurrentUser() {
    return firebase.auth().currentUser;
}

// Login with email and password
async function loginWithEmail(email, password, rememberMe = false) {
    try {
        const auth = firebase.auth();
        
        // Set persistence based on remember me
        if (rememberMe) {
            await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        } else {
            await auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
        }
        
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        if (!user.emailVerified) {
            await auth.signOut();
            throw new Error('Please verify your email before logging in.');
        }
        
        return { success: true, user };
    } catch (error) {
        return { success: false, error: error.message, code: error.code };
    }
}

// Login with Google
async function loginWithGoogle() {
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');
        
        const userCredential = await firebase.auth().signInWithPopup(provider);
        return { success: true, user: userCredential.user };
    } catch (error) {
        return { success: false, error: error.message, code: error.code };
    }
}

// Register new user
async function registerUser(email, password, displayName = '') {
    try {
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Update display name if provided
        if (displayName) {
            await user.updateProfile({ displayName });
        }
        
        // Send email verification
        await user.sendEmailVerification();
        
        return { success: true, user };
    } catch (error) {
        return { success: false, error: error.message, code: error.code };
    }
}

// Send password reset email
async function resetPassword(email) {
    try {
        await firebase.auth().sendPasswordResetEmail(email);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message, code: error.code };
    }
}

// Sign out
async function signOut() {
    try {
        await firebase.auth().signOut();
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Get user profile
function getUserProfile() {
    const user = getCurrentUser();
    if (!user) return null;
    
    return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified,
        photoURL: user.photoURL
    };
}

// Firebase error code to user-friendly message
function getAuthErrorMessage(errorCode) {
    const messages = {
        'auth/invalid-email': 'Invalid email address format.',
        'auth/user-disabled': 'This account has been disabled.',
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/email-already-in-use': 'Email already registered. Try logging in instead.',
        'auth/weak-password': 'Password should be at least 6 characters.',
        'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
        'auth/network-request-failed': 'Network error. Please check your connection.',
        'auth/popup-closed-by-user': 'Sign-in popup was closed.',
        'auth/cancelled-popup-request': 'Only one popup request is allowed at a time.'
    };
    
    return messages[errorCode] || 'An error occurred. Please try again.';
}