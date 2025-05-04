import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

// Initialize SendGrid with your API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export async function POST(request: Request) {
  try {
    const submission = await request.json();

    const msg = {
      to: 'lectureradx@gmail.com',
      from: 'lectureradx@gmail.com',
      subject: 'New ADX Setup Submission',
      html: `
        <h2>New ADX Setup Submission Received</h2>
        <p><strong>WordPress URL:</strong> ${submission.wordpressUrl}</p>
        <p><strong>Username:</strong> ${submission.wordpressUsername}</p>
        <p><strong>Package:</strong> ${submission.package}</p>
        <p><strong>WhatsApp Number:</strong> ${submission.whatsappNumber}</p>
        <p><strong>Network Code:</strong> ${submission.networkCode || 'Not provided'}</p>
        <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
        <br>
        <p>Please check the admin dashboard for more details.</p>
      `,
    };

    await sgMail.send(msg);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
} 