import { collection, addDoc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface WaitlistSubmission {
  userId: string;
  timestamp: Timestamp;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  roleTypes: string[];
  creativeWork: string;
  segments: string[];
  artistQuestions: {
    q1: string;
    q2: string;
    q3: string;
    q4: string;
    q5: string;
  };
  communityQuestions: {
    q1: string;
    q2: string;
    q3: string;
    q4: string;
    q5: string;
  };
  productFeedbackSurvey: string;
  resonanceLevel: string;
  resonanceReasons: string[];
  communitySelections: string[];
}

export const saveWaitlistSubmission = async (data: Omit<WaitlistSubmission, 'timestamp'>) => {
  try {
    const docRef = await addDoc(collection(db, 'waitlist'), {
      ...data,
      timestamp: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving waitlist submission:', error);
    throw error;
  }
};

export const getWaitlistSubmissions = async () => {
  try {
    const q = query(collection(db, 'waitlist'), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate().toISOString() || new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error getting waitlist submissions:', error);
    throw error;
  }
};

export const deleteWaitlistSubmission = async (id: string) => {
  try {
    const response = await fetch('/api/delete-submission', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete submission');
    }

    const result = await response.json();
    console.log('Submission deleted successfully:', id);
    return result;
  } catch (error) {
    console.error('Error deleting submission:', error);
    throw error;
  }
};
