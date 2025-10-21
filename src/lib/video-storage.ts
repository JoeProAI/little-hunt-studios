import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, orderBy, getDocs, deleteDoc, doc, updateDoc, Timestamp } from 'firebase/firestore';

export interface VideoRecord {
  id?: string;
  userId: string;
  type: 'video' | 'image';
  url: string;
  thumbnailUrl?: string;
  prompt: string;
  model: string;
  modelName: string;
  duration?: string;
  aspectRatio?: string;
  status: 'processing' | 'completed' | 'failed';
  error?: string;
  createdAt: number;
  replicateId?: string;
}

/**
 * Save a video generation to user's gallery
 */
export async function saveVideoToGallery(video: Omit<VideoRecord, 'id' | 'createdAt'>): Promise<string> {
  try {
    const videoData = {
      ...video,
      createdAt: Timestamp.now(),
    };
    
    const docRef = await addDoc(collection(db, 'videos'), videoData);
    console.log('Video saved to gallery:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving video to gallery:', error);
    throw error;
  }
}

/**
 * Get all videos for a user
 */
export async function getUserVideos(userId: string): Promise<VideoRecord[]> {
  try {
    const q = query(
      collection(db, 'videos'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const videos: VideoRecord[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      videos.push({
        id: doc.id,
        userId: data.userId,
        type: data.type,
        url: data.url,
        thumbnailUrl: data.thumbnailUrl,
        prompt: data.prompt,
        model: data.model,
        modelName: data.modelName,
        duration: data.duration,
        aspectRatio: data.aspectRatio,
        status: data.status,
        error: data.error,
        createdAt: data.createdAt?.toMillis() || Date.now(),
        replicateId: data.replicateId,
      });
    });
    
    return videos;
  } catch (error) {
    console.error('Error fetching user videos:', error);
    throw error;
  }
}

/**
 * Delete a video from user's gallery
 */
export async function deleteVideoFromGallery(videoId: string, userId: string): Promise<void> {
  try {
    const videoRef = doc(db, 'videos', videoId);
    await deleteDoc(videoRef);
    console.log('Video deleted from gallery:', videoId);
  } catch (error) {
    console.error('Error deleting video from gallery:', error);
    throw error;
  }
}

/**
 * Update video status (for processing -> completed)
 */
export async function updateVideoStatus(
  videoId: string,
  status: 'completed' | 'failed',
  updates: Partial<VideoRecord>
): Promise<void> {
  try {
    const videoRef = doc(db, 'videos', videoId);
    await updateDoc(videoRef, {
      status,
      ...updates,
    });
    console.log('Video status updated:', videoId, status);
  } catch (error) {
    console.error('Error updating video status:', error);
    throw error;
  }
}
