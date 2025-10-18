import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * Server-side credit management using Firebase Admin SDK
 */

export async function deductCredits(userId: string, amount: number = 1): Promise<void> {
  const userRef = adminDb.collection('users').doc(userId);
  const userDoc = await userRef.get();
  
  if (!userDoc.exists) {
    throw new Error('User not found');
  }
  
  const currentCredits = userDoc.data()?.credits || 0;
  
  if (currentCredits < amount) {
    throw new Error(`Insufficient credits. You have ${currentCredits} credits but need ${amount}.`);
  }
  
  // Deduct credits
  await userRef.update({
    credits: FieldValue.increment(-amount),
    totalVideosGenerated: FieldValue.increment(1),
  });
  
  // Log transaction
  await adminDb.collection('transactions').add({
    userId,
    type: 'generation',
    amount: -amount,
    description: 'Video generation',
    createdAt: FieldValue.serverTimestamp(),
  });
}

export async function addCredits(userId: string, amount: number, paymentId?: string): Promise<void> {
  const userRef = adminDb.collection('users').doc(userId);
  
  await userRef.update({
    credits: FieldValue.increment(amount),
  });
  
  // Log transaction
  await adminDb.collection('transactions').add({
    userId,
    type: 'purchase',
    amount: amount,
    description: `Purchased ${amount} credits`,
    paymentId: paymentId || null,
    createdAt: FieldValue.serverTimestamp(),
  });
}

export async function getCredits(userId: string): Promise<number> {
  const userDoc = await adminDb.collection('users').doc(userId).get();
  
  if (!userDoc.exists) {
    throw new Error('User not found');
  }
  
  return userDoc.data()?.credits || 0;
}

export async function hasEnoughCredits(userId: string, required: number = 1): Promise<boolean> {
  const credits = await getCredits(userId);
  return credits >= required;
}
