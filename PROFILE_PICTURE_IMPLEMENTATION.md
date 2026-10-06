# Profile Picture Upload Implementation

This document describes the complete implementation of the profile picture upload feature for the fintech application.

## Overview

The profile picture upload feature allows:
- **Admin only:** Upload/update customer profile pictures
- **Max file size:** 2MB
- **Supported formats:** JPEG, PNG, WebP
- **Storage:** Firebase Cloud Storage
- **Display:** Bold display on customer profile
- **Security:** Role-based access control via Firestore rules

## Architecture

```
User Interface (React Components)
    ↓
Profile Picture Upload Component
    ↓
Firebase Storage Utility (profilePicture.js)
    ↓
Firebase Storage
    ↓
Firestore (user metadata)
```

## Files Created

### 1. `src/lib/profilePicture.js`
Core utility for handling profile picture uploads to Firebase Storage.

**Functions:**
- `validateProfilePicture(file)` - Validates file type and size (2MB max)
- `uploadProfilePicture(userId, file)` - Uploads file to Storage and returns download URL
- `deleteProfilePicture(userId, fileUrl)` - Removes old profile picture
- `getProfilePictureUrl(userId)` - Retrieves user's profile picture reference

**Error Handling:**
- File validation with detailed error messages
- Firebase permission errors
- Storage quota errors
- Network errors

### 2. `src/components/ui/ProfilePictureUpload.jsx`
Reusable React component for file upload UI.

**Features:**
- Image preview (before upload)
- Drag-and-drop ready (can be extended)
- Progress indicator during upload
- Success/error toast notifications
- Disabled state during upload
- Requirements display

**Props:**
- `userId` (string, required) - Unique identifier for the user
- `onUploadSuccess` (function, optional) - Callback when upload completes
- `currentImageUrl` (string, optional) - Currently displayed image URL

## Files Modified

### 1. `src/pages/dashboard/admin/AddCustomer.jsx`
Added profile picture upload during customer creation.

**Changes:**
- Imported `ProfilePictureUpload` component
- Added `profilePictureUrl` to form state
- Added new section "4. Profile Picture" with upload UI
- Pass uploaded URL to `adminCreateUser` profile data

**Flow:**
1. Admin fills customer details
2. Admin uploads profile picture
3. Picture is stored in Firebase Storage
4. URL is saved to customer document in Firestore
5. Customer can see picture on their profile

### 2. `src/pages/dashboard/admin/EditCustomer.jsx`
Added profile picture update when editing customer.

**Changes:**
- Imported `ProfilePictureUpload` component
- Added `profilePictureUrl` to editable fields
- Added new section "4. Profile Picture" with upload UI
- New picture URL is saved when updating customer

### 3. `src/pages/dashboard/Profile.jsx`
Updated profile display to show profile picture.

**Changes:**
- Check for `user.profilePictureUrl`
- Display uploaded image if available
- Fall back to default avatar if no picture

## Data Flow

### Creating a Customer with Picture

```
Admin fills form
    ↓
Admin uploads picture
    ↓
profilePicture.uploadProfilePicture()
    ↓
File uploaded to Firebase Storage
    ↓
Download URL returned
    ↓
URL stored in form state
    ↓
Admin clicks "Submit"
    ↓
adminCreateUser() called with profilePictureUrl
    ↓
User document in Firestore includes profilePictureUrl
```

### Displaying Profile Picture

```
Customer views profile
    ↓
Profile component loads user data from Firestore
    ↓
If profilePictureUrl exists:
  Display uploaded image
Else:
  Display default avatar
```

## Security

### Firebase Storage Rules

```json
match /profile-pictures/{userId}/{allPaths=**} {
  // Admins can upload/delete any profile picture
  allow write: if request.auth.uid == userId || 
                  user.role == 'admin';
  
  // Authenticated users can view pictures
  allow read: if request.auth != null;
  
  // Only admins can delete
  allow delete: if user.role == 'admin';
}
```

**Security Features:**
- Only authenticated users can upload
- Only admins can upload on behalf of customers
- Public read access prevented (authenticated only)
- Automatic timestamp prevents name collisions
- Role-based access control

### File Validation

**Client-side (immediate feedback):**
- File type validation (JPEG, PNG, WebP only)
- File size validation (2MB max)
- Detailed error messages

**Server-side (Firebase Rules):**
- Authentication check
- Authorization check (admin role)
- Storage quota enforcement

## Error Handling

### Validation Errors

```javascript
validateProfilePicture(file)
// Returns array of errors:
// - "No file selected"
// - "Only JPEG, PNG, and WebP images are allowed"
// - "File size must be less than 2MB (current: 2.5MB)"
```

### Upload Errors

```javascript
uploadProfilePicture(userId, file)
// Throws with messages:
// - "You do not have permission to upload..."
// - "Storage quota exceeded..."
// - Firebase network errors
```

### UI Error Feedback

- Toast notifications for success/failure
- User-friendly error messages
- Form state preserved on error
- Retry capability

## File Storage Structure

```
Firebase Storage Bucket: project.appspot.com
└── profile-pictures/
    ├── user_id_1/
    │   ├── user_id_1-1692893400000.jpg
    │   └── user_id_1-1692893500000.jpg
    └── user_id_2/
        └── user_id_2-1692893600000.png
```

**Naming Convention:**
- Path: `profile-pictures/{userId}/{userId}-{timestamp}`
- Timestamp ensures unique names for multiple uploads
- Latest upload is used in UI

## Configuration

### Environment Variables

Add to `.env.local`:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=project_id
VITE_FIREBASE_STORAGE_BUCKET=project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=sender_id
VITE_FIREBASE_APP_ID=app_id
```

### Constants

In `profilePicture.js`:

```javascript
const MAX_FILE_SIZE = 2 * 1024 * 1024  // 2MB
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp'
]
```

## Testing Checklist

- [ ] Admin can upload picture when creating customer
- [ ] Picture displays in new customer's profile
- [ ] Picture displays in customer list (if added)
- [ ] Admin can update customer's picture
- [ ] Old picture is replaced with new one
- [ ] File size validation works (try uploading 3MB file)
- [ ] File type validation works (try uploading .txt file)
- [ ] Error messages are clear and helpful
- [ ] Customer cannot upload their own picture
- [ ] Customer can view their profile picture
- [ ] Default avatar shows when no picture uploaded
- [ ] Pictures persist after refresh/logout/login

## Performance Considerations

### Current Implementation
- Direct upload without compression
- Browser caches images via HTTP cache headers
- One image file per upload attempt

### Optimization Options

1. **Image Compression** (Optional)
   ```bash
   npm install browser-image-compression
   ```
   Then modify `profilePicture.js` to compress before upload.

2. **Image Resizing**
   - Could resize to standard dimensions (e.g., 400x400px)
   - Reduces storage costs

3. **CDN Caching**
   - Firebase Storage URLs are cached by CDN
   - No additional setup needed

## Limitations & Future Enhancements

### Current Limitations
- One active picture per customer (older ones stored but not used)
- No picture cropping/editing UI
- No bulk upload for multiple customers
- No image optimization/resizing

### Future Enhancements
- [ ] Image cropping tool
- [ ] Multiple profile pictures with gallery
- [ ] Bulk upload CSV of pictures
- [ ] Picture history/versioning
- [ ] Automatic image optimization
- [ ] Picture analytics (upload dates, sizes)
- [ ] Integration with customer search/filters

## Support & Troubleshooting

See `FIREBASE_SETUP.md` for:
- Setup instructions
- Security rules
- Troubleshooting common issues
- Performance optimization
- Production deployment

## Dependencies

- `firebase` - ^12.17.0 (already in project)
- `react` - ^19.2.8 (already in project)
- `react-toastify` - ^11.1.0 (already in project)

No additional dependencies required.

## Code Examples

### Using ProfilePictureUpload Component

```jsx
<ProfilePictureUpload
  userId={customer.uid}
  currentImageUrl={customer.profilePictureUrl}
  onUploadSuccess={(url) => {
    // Update customer data with new picture URL
    updateCustomer({ ...customer, profilePictureUrl: url })
  }}
/>
```

### Uploading Programmatically

```jsx
import { uploadProfilePicture } from '../lib/profilePicture.js'

const file = await getUserFileInput()
const url = await uploadProfilePicture(userId, file)
await updateUserProfile(userId, { profilePictureUrl: url })
```

### Displaying Profile Picture

```jsx
{user?.profilePictureUrl ? (
  <img
    src={user.profilePictureUrl}
    alt={user.name}
    className="w-32 h-32 rounded-lg object-cover"
  />
) : (
  <div className="w-32 h-32 rounded-lg bg-gray-200">
    {/* Default avatar */}
  </div>
)}
```

## Rollback Plan

If issues occur:

1. **Disable uploads:** Comment out ProfilePictureUpload from forms
2. **Keep display:** Leave profile picture display code (fallback works)
3. **Data retention:** All uploaded pictures remain in Storage
4. **No DB changes:** Firestore can handle missing profilePictureUrl field
