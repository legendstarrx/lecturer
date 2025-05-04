'use client';

import { useEffect } from 'react';
import { onMessageListener } from '@/lib/notification';

export default function NotificationHandler() {
  useEffect(() => {
    const setupNotifications = async () => {
      try {
        const payload = await onMessageListener();
        if (payload) {
          const notificationTitle = 'New Submission';
          const notificationOptions = {
            body: 'Someone has submitted a new ADX setup request',
            icon: '/icon.png',
            badge: '/badge.png',
          };

          if ('Notification' in window) {
            new Notification(notificationTitle, notificationOptions);
          }
        }
      } catch (error) {
        console.error('Error setting up notifications:', error);
      }
    };

    setupNotifications();
  }, []);

  return null;
} 