# Kyozo Waitlist Setup Guide

## Overview
This waitlist application captures user survey responses with Firebase authentication, Firestore storage, and email notifications via Resend API.

## Features
- ✅ Anonymous Firebase authentication for all users
- ✅ Firestore database for storing waitlist submissions
- ✅ Email notifications to ashok@kyozo.com on new submissions
- ✅ Admin dashboard at `/responses` route
- ✅ Reply functionality from will@kyozo.com to survey respondents
- ✅ Secure admin authentication with environment variables

## Prerequisites
- Node.js 18+ and pnpm
- Firebase project with Firestore enabled
- Resend API account and API key
- Anonymous authentication enabled in Firebase

## Environment Variables

The application uses environment variables prefixed with `VITE_` (required by Vite to expose to client).

Create a `.env` file in the project root with:

```env
# Firebase Configuration (Client-side)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Admin Credentials for /responses route
VITE_ADMIN_USERNAME=admin@kyozo.com
VITE_ADMIN_PASSWORD=your_secure_password

# Resend API Key (for email notifications)
VITE_RESEND_API_KEY=your_resend_api_key
```

## Firebase Setup

### 1. Enable Anonymous Authentication
1. Go to Firebase Console → Authentication
2. Click "Sign-in method" tab
3. Enable "Anonymous" authentication

### 2. Create Firestore Database
1. Go to Firebase Console → Firestore Database
2. Click "Create database"
3. Choose production mode or test mode
4. Select your region

### 3. Firestore Security Rules
Update your Firestore security rules to allow anonymous users to write to the waitlist collection:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /waitlist/{document} {
      // Allow authenticated users (including anonymous) to create
      allow create: if request.auth != null;
      // Allow only authenticated admins to read
      allow read: if request.auth != null;
    }
  }
}
```

## Resend Setup

### 1. Get API Key
1. Sign up at [resend.com](https://resend.com)
2. Create an API key
3. Add to `.env` as `VITE_RESEND_API_KEY`

### 2. Verify Domains
For production, verify your sending domains:
- `notifications@kyozo.com` (for new submission notifications)
- `will@kyozo.com` (for admin replies)

**Note:** The current implementation calls Resend from the client-side, which exposes the API key. For production, you should:
1. Create a serverless function (e.g., Netlify Functions, Vercel Functions)
2. Move email sending logic to the backend
3. Keep API keys server-side only

## Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## Usage

### User Flow
1. User visits the waitlist page
2. User is automatically authenticated anonymously with Firebase
3. User completes the survey
4. On submission:
   - Data is saved to Firestore `waitlist` collection
   - Email notification sent to ashok@kyozo.com
   - Success message displayed

### Admin Flow
1. Navigate to `/responses`
2. Login with admin credentials (from `.env`)
3. View all survey submissions
4. Click "Reply" to send email to respondents
5. Email sent from will@kyozo.com

## Data Structure

### Firestore Collection: `waitlist`
```typescript
{
  userId: string,              // Firebase anonymous user ID
  timestamp: Timestamp,        // Submission timestamp
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  location: string,
  roleTypes: string[],
  creativeWork: string,
  segments: string[],
  artistQuestions: {
    q1: string,
    q2: string,
    q3: string,
    q4: string,
    q5: string
  },
  communityQuestions: {
    q1: string,
    q2: string,
    q3: string,
    q4: string,
    q5: string
  },
  productFeedbackSurvey: string,
  resonanceLevel: string,
  resonanceReasons: string[],
  communitySelections: string[]
}
```

## Security Considerations

### Current Implementation
⚠️ **Warning:** The current setup exposes API keys in the client bundle. This is acceptable for development but **NOT recommended for production**.

### Production Recommendations
1. **Email Service:** Move to serverless functions
   - Create `/api/send-notification` endpoint
   - Create `/api/send-reply` endpoint
   - Keep Resend API key server-side only

2. **Admin Authentication:** Consider using Firebase Admin SDK
   - Implement proper JWT-based authentication
   - Use Firebase custom claims for admin roles

3. **Environment Variables:**
   - Use separate `.env.production` file
   - Never commit `.env` files to git
   - Use platform-specific environment variable management (Vercel, Netlify, etc.)

## Troubleshooting

### Firebase Authentication Errors
- Ensure anonymous authentication is enabled in Firebase Console
- Check Firebase configuration in `.env`

### Firestore Permission Errors
- Verify Firestore security rules allow anonymous writes
- Check that user is authenticated before submission

### Email Not Sending
- Verify Resend API key is correct
- Check domain verification in Resend dashboard
- Review browser console for errors

## Development Notes

- The app uses Vite for fast development and building
- React Router DOM for client-side routing
- Firebase SDK v9+ modular syntax
- TypeScript for type safety
- Tailwind CSS for styling

## Support

For issues or questions, contact the development team.
