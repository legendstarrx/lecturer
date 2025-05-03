import { NextResponse } from 'next/server';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('receipt') as File;
    
    // Upload receipt to Firebase Storage
    const storageRef = ref(storage, `receipts/${Date.now()}-${file.name}`);
    await uploadBytes(storageRef, file);
    const receiptUrl = await getDownloadURL(storageRef);

    // Save form data to Firestore
    const docRef = await addDoc(collection(db, 'submissions'), {
      wordpressUrl: formData.get('wordpressUrl'),
      wordpressUsername: formData.get('wordpressUsername'),
      wordpressPassword: formData.get('wordpressPassword'),
      whatsappNumber: formData.get('whatsappNumber'),
      receiptUrl,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error) {
    console.error('Error submitting form:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit form' },
      { status: 500 }
    );
  }
} 