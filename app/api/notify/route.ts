import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const { title, body } = await request.json();

    // Get all registered tokens from Firestore
    const tokensSnapshot = await getDocs(collection(db, 'tokens'));
    const tokens = tokensSnapshot.docs.map(doc => doc.data().token);

    if (tokens.length === 0) {
      return NextResponse.json({ message: 'No devices registered for notifications' });
    }

    // Send notification to each token
    const sendPromises = tokens.map(token => 
      fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `key=${process.env.FIREBASE_SERVER_KEY}`,
        },
        body: JSON.stringify({
          to: token,
          notification: {
            title,
            body,
          },
        }),
      })
    );

    await Promise.all(sendPromises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending notification:', error);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
} 