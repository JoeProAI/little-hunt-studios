// Quick script to restore credits
// Run with: node restore-credits.js YOUR_USER_ID

const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('./little-hunt-studios-firebase-adminsdk-fbsvc-da1dc497f4.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function restoreCredits(userId, creditsToAdd) {
  try {
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      console.error('User not found!');
      return;
    }
    
    const currentCredits = userDoc.data().credits || 0;
    console.log(`Current credits: ${currentCredits}`);
    
    await userRef.update({
      credits: admin.firestore.FieldValue.increment(creditsToAdd)
    });
    
    // Log transaction
    await db.collection('transactions').add({
      userId,
      type: 'refund',
      amount: creditsToAdd,
      description: 'Credit restoration for failed generations',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    console.log(`✅ Added ${creditsToAdd} credits. New balance: ${currentCredits + creditsToAdd}`);
  } catch (error) {
    console.error('Error:', error);
  }
  
  process.exit(0);
}

const userId = process.argv[2];
const credits = parseInt(process.argv[3]) || 5;

if (!userId) {
  console.error('Usage: node restore-credits.js YOUR_USER_ID [CREDITS_TO_ADD]');
  process.exit(1);
}

restoreCredits(userId, credits);
