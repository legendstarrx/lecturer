# Lecturer - Professional Services

A modern web application for managing ADX setup services and course offerings.

## Features

- ADX Setup Services with three tiers:
  - Normal Setup (₦10,000)
  - Premium Setup (₦15,000)
  - High eCPM Setup (₦20,000)
- Course listings with WhatsApp contact options
- Secure form submission for ADX setup requests
- Firebase integration for data storage and file uploads

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Firebase (Firestore & Storage)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
```bash
npm run dev
```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Create a `.env.local` file with your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Project Structure

- `app/` - Next.js app directory
  - `api/` - API routes
  - `layout.tsx` - Root layout
  - `page.tsx` - Home page
- `lib/` - Utility functions and configurations
  - `firebase.ts` - Firebase configuration
- `public/` - Static assets

## License

MIT
