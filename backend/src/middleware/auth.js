import admin from '../config/firebase.js';

// Check if Firebase is configured
const isFirebaseConfigured = () => {
  return admin.apps.length > 0;
};

/**
 * Authentication middleware
 * Extracts and verifies Firebase ID token from Authorization header
 */
export const authenticate = async (req, res, next) => {
  // Development bypass: allow requests if Firebase not configured
  if (!isFirebaseConfigured()) {
    // For development: create a mock user
    req.user = {
      uid: 'dev-user-123',
      email: 'dev@example.com',
      name: 'Developer'
    };
    return next();
  }

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.split('Bearer ')[1];

    if (!token || token.length < 50) {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    // Verify token with Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token, {
      checkRevoked: true
    });

    // Attach user to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || '',
      name: decodedToken.name || ''
    };

    next();
  } catch (error) {
    console.error('Auth error:', error.message);

    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ error: 'Token expired' });
    }

    return res.status(401).json({ error: 'Invalid token' });
  }
};

/**
 * Optional authentication - doesn't fail if no token
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split('Bearer ')[1];
      if (token.length >= 50) {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = {
          uid: decodedToken.uid,
          email: decodedToken.email || ''
        };
      }
    }
  } catch (error) {
    // Ignore auth errors for optional auth
  }
  next();
};