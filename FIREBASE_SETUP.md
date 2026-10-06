# Firebase Setup Guide: Profile Picture Upload

This guide covers setting up Firebase Storage and Firestore Security Rules to support the profile picture upload feature.

## Prerequisites

- Firebase project created in Firebase Console (https://console.firebase.google.com)
- Firebase CLI installed (`npm install -g firebase-tools`)
- Admin account for initial setup

## Step 1: Enable Firebase Storage

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. In the left sidebar, click **Build** → **Storage**
4. Click **Create bucket** or **Get Started**
5. Select region (recommended: closest to your users, e.g., `us-central1`)
6. Keep security rules as default for now (we'll update them)
7. Click **Done**

## Step 2: Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll to "Your apps" section
3. Click on your web app (or create one if not present)
4. Copy the configuration object
5. Update your `.env.local` file with these variables:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Important:** Never commit `.env.local` to version control. Add it to `.gitignore`.

## Step 3: Update Firebase Security Rules

### Storage Rules

1. Go to **Build** → **Storage** in Firebase Console
2. Click the **Rules** tab
3. Replace all existing rules with:

```json
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Only allow authenticated uploads to profile-pictures folder
    match /profile-pictures/{userId}/{allPaths=**} {
      // Only the user can upload their own profile picture
      allow write: if request.auth != null && 
                      (request.auth.uid == userId || 
                       get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin');
      
      // Anyone authenticated can read profile pictures
      allow read: if request.auth != null;
      
      // Admin can delete any profile picture
      allow delete: if request.auth != null && 
                       get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Deny all other storage access
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

4. Click **Publish**

### Firestore Rules (if using Firestore for user data)

1. Go to **Build** → **Firestore Database**
2. Click the **Rules** tab
3. Replace with:

```json
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      // Users can read their own data
      allow read: if request.auth.uid == userId;
      
      // Admins can read all user data
      allow read: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      
      // Only admins can create users
      allow create: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      
      // Only admins can update user profiles
      allow update: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      
      // Only admins can delete users
      allow delete: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Deny all other access
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

4. Click **Publish**

## Step 4: Authentication Setup

Ensure Firebase Authentication is enabled:

1. Go to **Build** → **Authentication**
2. Click **Get Started**
3. Enable **Email/Password** provider
4. Optionally enable other providers (Google, GitHub, etc.)

## Step 5: Environment Variables

Make sure your `.env.local` file is properly set up:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Restart your development server after adding/updating environment variables:

```bash
npm run dev
```

## Step 6: Deploy Rules (Optional - for Production)

Using Firebase CLI:

```bash
# Login to Firebase
firebase login

# Select your project
firebase use your_project_id

# Deploy rules
firebase deploy --only firestore:rules,storage

# Or deploy everything
firebase deploy
```

## File Structure

The profile picture files are organized in Firebase Storage as:

```
profile-pictures/
├── user_id_1/
│   ├── user_id_1-1234567890.jpg
│   └── user_id_1-1234567891.jpg
├── user_id_2/
│   └── user_id_2-1234567890.png
```

Each upload is timestamped to create unique files and support multiple uploads per user (latest one is used).

## Testing the Setup

### 1. Test Upload with Admin

1. Log in as admin
2. Go to Admin Console → Add Customer
3. Scroll to "Profile Picture" section
4. Click "Upload Photo"
5. Select a JPEG, PNG, or WebP file (max 2MB)
6. Verify success message appears

### 2. Test Retrieval

1. After upload, view the customer's profile
2. Profile picture should display in the profile card
3. Check browser DevTools Network tab to verify image URL

### 3. Test Security Rules

- Try uploading from a customer account (should fail)
- Try accessing admin-only files (should fail)
- Use Firebase Console Storage tab to verify files exist

## Troubleshooting

### Upload fails with "permission denied"

- **Cause:** Security rules are too strict
- **Solution:** Check that your user has admin role in Firestore users collection
- **Verify:** In Firebase Console → Firestore → users collection, check the `role` field is "admin"

### Upload fails with "File too large"

- **Cause:** File exceeds 2MB limit
- **Solution:** Compress image before uploading
- **Tools:** Use online tools like TinyPNG or ImageOptim

### Upload fails with "Unsupported file type"

- **Cause:** File is not JPEG, PNG, or WebP
- **Solution:** Convert file to one of the supported formats
- **Supported types:** JPEG (.jpg, .jpeg), PNG (.png), WebP (.webp)

### Profile picture doesn't display after upload

- **Cause:** Image URL is not persisted to Firestore
- **Solution:** Verify that `profilePictureUrl` is being saved to the user document in Firestore
- **Check:** In Firebase Console → Firestore → users → [user_id] → profilePictureUrl field

### CORS errors when loading images

- **Cause:** Incorrect Firebase configuration
- **Solution:** Clear browser cache and restart dev server
- **Verify:** Check console for the correct storage bucket URL

### Authentication required but user isn't logged in

- **Cause:** Session expired or not authenticated
- **Solution:** Log in again
- **Note:** Storage rules require authentication; public access is not allowed

## Performance Optimization

### Image Compression

For production, consider adding image compression before upload. Install a library:

```bash
npm install browser-image-compression
```

Then modify `src/lib/profilePicture.js`:

```javascript
import imageCompression from 'browser-image-compression';

export async function uploadProfilePicture(userId, file) {
  const errors = validateProfilePicture(file);
  if (errors.length > 0) {
    throw new Error(errors.join('. '));
  }

  try {
    // Compress image if larger than 500KB
    let fileToUpload = file;
    if (file.size > 500 * 1024) {
      fileToUpload = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });
    }

    const storage = getStorage(app);
    const fileName = `${userId}-${Date.now()}`;
    const storageRef = ref(storage, `profile-pictures/${userId}/${fileName}`);

    await uploadBytes(storageRef, fileToUpload);
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  } catch (error) {
    // ... error handling
  }
}
```

### Caching

Profile pictures are cached by browser. To bust cache when updating:

```javascript
// Add timestamp parameter to force fresh download
const cachebustedUrl = `${user.profilePictureUrl}?t=${Date.now()}`;
```

## Security Best Practices

1. **Never expose private keys** - Keep `.env.local` out of version control
2. **Use HTTPS only** - Firebase Storage requires HTTPS in production
3. **Validate on client and server** - Rules validate, but also validate in code
4. **Implement rate limiting** - Consider Firebase Cloud Functions for advanced protection
5. **Monitor storage usage** - Set alerts in Firebase Console for quota warnings
6. **Backup regularly** - Export Firestore data periodically

## Costs

Firebase Storage is FREE for:
- First 5GB stored per month
- First 5GB bandwidth per month

After that:
- $0.18 per GB stored per month
- $0.06 per GB downloaded per month

Monitor your usage in Firebase Console → Firestore → Storage.

## Additional Resources

- [Firebase Storage Documentation](https://firebase.google.com/docs/storage)
- [Firebase Security Rules Guide](https://firebase.google.com/docs/rules)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [Firebase Web SDK API](https://firebase.google.com/docs/web/setup)
