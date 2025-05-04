import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';

admin.initializeApp();

const gmailEmail = 'lectureradx@gmail.com';
const gmailPassword = process.env.GMAIL_PASSWORD;

const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

interface Submission {
  wordpressUrl: string;
  wordpressUsername: string;
  package: string;
  whatsappNumber: string;
  networkCode?: string;
  timestamp: admin.firestore.Timestamp;
}

export const sendSubmissionEmail = functions.firestore
  .document('submissions/{submissionId}')
  .onCreate(async (snapshot: functions.firestore.QueryDocumentSnapshot, context: functions.EventContext) => {
    const submission = snapshot.data() as Submission;
    
    const mailOptions = {
      from: `LECTURER <${gmailEmail}>`,
      to: gmailEmail,
      subject: 'New ADX Setup Submission',
      html: `
        <h2>New ADX Setup Submission Received</h2>
        <p><strong>WordPress URL:</strong> ${submission.wordpressUrl}</p>
        <p><strong>Username:</strong> ${submission.wordpressUsername}</p>
        <p><strong>Package:</strong> ${submission.package}</p>
        <p><strong>WhatsApp Number:</strong> ${submission.whatsappNumber}</p>
        <p><strong>Network Code:</strong> ${submission.networkCode || 'Not provided'}</p>
        <p><strong>Timestamp:</strong> ${new Date(submission.timestamp?.toDate()).toLocaleString()}</p>
        <br>
        <p>Please check the admin dashboard for more details.</p>
      `,
    };

    try {
      await mailTransport.sendMail(mailOptions);
      console.log('New submission email sent to:', gmailEmail);
    } catch (error) {
      console.error('There was an error while sending the email:', error);
    }
  }); 