'use client';

import { useEffect } from 'react';
import { requestNotificationPermission } from '@/lib/notification';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function NotificationHandler() {
  useEffect(() => {
    const setupNotifications = async () => {
      try {
        const token = await requestNotificationPermission();
        if (token) {
          // Store the token in Firestore
          await addDoc(collection(db, 'tokens'), {
            token,
            createdAt: new Date(),
          });
        }
      } catch (error) {
        console.error('Error setting up notifications:', error);
      }
    };

    setupNotifications();
  }, []);

  return null;
} 