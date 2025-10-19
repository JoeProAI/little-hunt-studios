import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let adminApp: App | null = null;
let firestoreInstance: Firestore | null = null;

/**
 * Initialize Firebase Admin SDK lazily (only when needed)
 */
function initializeAdminApp(): App {
  if (adminApp) {
    return adminApp;
  }

  // Check if already initialized
  const existingApps = getApps();
  if (existingApps.length > 0) {
    adminApp = existingApps[0];
    return adminApp;
  }

  // Initialize with service account or default credentials
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId) {
    throw new Error('NEXT_PUBLIC_FIREBASE_PROJECT_ID is not set');
  }

  // If we have full service account credentials, use them
  if (clientEmail && privateKey) {
    adminApp = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    });
  } else {
    // Fallback: Use project ID only (works with default credentials in some environments)
    adminApp = initializeApp({
      projectId,
    });
  }

  return adminApp;
}

/**
 * Get Firestore instance (lazy-loaded)
 */
export function getAdminDb(): Firestore {
  if (firestoreInstance) {
    return firestoreInstance;
  }

  const app = initializeAdminApp();
  firestoreInstance = getFirestore(app);
  return firestoreInstance;
}
