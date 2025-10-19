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

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId) {
    throw new Error('NEXT_PUBLIC_FIREBASE_PROJECT_ID is required');
  }

  if (!clientEmail || !privateKey) {
    throw new Error(
      'Firebase Admin requires FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY environment variables. ' +
      'Get them from: https://console.firebase.google.com/project/little-hunt-studios/settings/serviceaccounts/adminsdk'
    );
  }

  // Initialize with service account credentials
  adminApp = initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, '\n'),
    }),
  });

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
