import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, increment, addDoc, collection } from 'firebase/firestore';

/**
 * Deduct credits from user account
 */
export async function deductCredits(userId: string, amount: number = 1): Promise<void> {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    throw new Error('User not found');
  }
  
  const currentCredits = userDoc.data().credits || 0;
  
  if (currentCredits < amount) {
    throw new Error(`Insufficient credits. You have ${currentCredits} credits but need ${amount}.`);
  }
  
  // Deduct credits
  await updateDoc(userRef, {
    credits: increment(-amount),
    totalVideosGenerated: increment(1),
  });
  
  // Log transaction
  await addDoc(collection(db, 'transactions'), {
    userId,
    type: 'generation',
    amount: -amount,
    description: 'Video generation',
    createdAt: new Date(),
  });
}

/**
 * Add credits to user account
 */
export async function addCredits(userId: string, amount: number, paymentId?: string): Promise<void> {
  const userRef = doc(db, 'users', userId);
  
  await updateDoc(userRef, {
    credits: increment(amount),
  });
  
  // Log transaction
  await addDoc(collection(db, 'transactions'), {
    userId,
    type: 'purchase',
    amount: amount,
    description: `Purchased ${amount} credits`,
    paymentId: paymentId || null,
    createdAt: new Date(),
  });
}

/**
 * Get user's current credit balance
 */
export async function getCredits(userId: string): Promise<number> {
  const userDoc = await getDoc(doc(db, 'users', userId));
  
  if (!userDoc.exists()) {
    throw new Error('User not found');
  }
  
  return userDoc.data().credits || 0;
}

/**
 * Check if user has enough credits
 */
export async function hasEnoughCredits(userId: string, required: number = 1): Promise<boolean> {
  const credits = await getCredits(userId);
  return credits >= required;
}
