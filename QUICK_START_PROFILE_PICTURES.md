# Quick Start: Profile Picture Upload

## TL;DR - Setup in 5 minutes

### 1. Enable Firebase Storage (1 min)
- Go to [Firebase Console](https://console.firebase.google.com)
- Select your project
- Click Build → Storage → Create bucket
- Select any region, keep defaults
- Click Done

### 2. Update Security Rules (1 min)
- Click Rules tab in Storage
- Copy-paste the rules from `FIREBASE_SETUP.md` Step 3
- Click Publish

### 3. Add Environment Variables (1 min)
Update `.env.local` (already done if Firebase is working):

```env
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
```

(The other FIREBASE_* variables should already be there)

### 4. Restart Dev Server (1 min)
```bash
npm run dev
```

### 5. Test Upload (1 min)
1. Go to Admin Console → Add Customer
2. Fill in details
3. Scroll to "Profile Picture" section
4. Click "Upload Photo"
5. Select a JPG/PNG file under 2MB
6. Done! Picture saves with customer account

## What's Implemented

✅ **Upload** - Admins upload pictures when creating customers
✅ **Validation** - File type & size checks (max 2MB)
✅ **Security** - Firestore rules prevent unauthorized uploads
✅ **Display** - Pictures show boldly on customer profiles
✅ **Error Handling** - User-friendly error messages
✅ **Edit** - Admins can update pictures on existing customers

## File Overview

| File | Purpose |
|------|---------|
| `src/lib/profilePicture.js` | Upload logic & validation |
| `src/components/ui/ProfilePictureUpload.jsx` | Reusable upload component |
| `src/pages/dashboard/admin/AddCustomer.jsx` | Upload during creation (MODIFIED) |
| `src/pages/dashboard/admin/EditCustomer.jsx` | Update picture (MODIFIED) |
| `src/pages/dashboard/Profile.jsx` | Display picture (MODIFIED) |

## Security Rules (Copy-Paste Ready)

**Storage Rules** - Place in Firebase Console → Storage → Rules:

```json
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /profile-pictures/{userId}/{allPaths=**} {
      allow write: if request.auth != null && 
                      (request.auth.uid == userId || 
                       get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow read: if request.auth != null;
      allow delete: if request.auth != null && 
                       get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

## Usage Examples

### For Admins: Adding Customer with Picture
1. Admin Console → Add Customer
2. Fill personal details
3. Scroll to "4. Profile Picture"
4. Click "Upload Photo"
5. Select image (JPG, PNG, WebP)
6. Click "Submit" when done

### For Admins: Updating Customer Picture
1. Admin Console → All Customers
2. Click "Edit" on a customer
3. Scroll to "4. Profile Picture"
4. Click "Upload Photo" to replace
5. Click "Save changes"

### For Customers: Viewing Picture
1. Click Profile in sidebar
2. Picture displays in right sidebar
3. If none uploaded, shows default avatar

## Troubleshooting

### Upload fails: "Permission denied"
**Problem:** Firebase rules blocking upload
**Solution:** 
1. Make sure you're logged in as admin
2. Check user's `role` field in Firestore is "admin"
3. Verify rules are published (should see green checkmark)

### Upload fails: "File too large"
**Problem:** Image exceeds 2MB
**Solution:** 
- Compress before uploading
- Use online tool: https://tinypng.com

### Upload fails: "Unsupported file type"
**Problem:** File is not JPEG/PNG/WebP
**Solution:**
- Convert to JPG using online tool
- Or use online converter: https://cloudconvert.com

### Picture doesn't appear on profile
**Problem:** URL not saved to Firestore
**Solution:**
1. Check customer record in Firestore has `profilePictureUrl` field
2. Refresh page (might be cached)
3. Try uploading again

### "Storage bucket not configured"
**Problem:** Missing `VITE_FIREBASE_STORAGE_BUCKET` env var
**Solution:**
1. Add to `.env.local`: `VITE_FIREBASE_STORAGE_BUCKET=project.appspot.com`
2. Restart dev server: `npm run dev`
3. Find bucket name in Firebase Console → Project Settings

## Features Included

### File Validation
- ✅ Type checking (JPEG, PNG, WebP only)
- ✅ Size checking (max 2MB)
- ✅ Clear error messages

### Upload Process
- ✅ Progress indicator
- ✅ Toast notifications
- ✅ Automatic refresh on success
- ✅ Timestamp-based naming (no collisions)

### Security
- ✅ Admin-only uploads
- ✅ Authentication required
- ✅ Firestore role checks
- ✅ Storage bucket rules

### User Experience
- ✅ Image preview before upload
- ✅ Disabled state during upload
- ✅ Error handling with recovery
- ✅ Requirements display

## Configuration

All defaults are set. Only customization point:

In `src/lib/profilePicture.js`:
```javascript
const MAX_FILE_SIZE = 2 * 1024 * 1024  // Change to allow larger files
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']  // Add more types
```

## Database Schema

Customer document in Firestore:

```javascript
{
  name: "John Doe",
  email: "john@example.com",
  profilePictureUrl: "https://...", // ← New field
  // ... other fields
}
```

## Performance

- Pictures cached by browser (standard HTTP cache)
- Firebase Storage CDN handles distribution
- No additional costs for first 5GB/month

## Support

For detailed info, see:
- **Setup:** `FIREBASE_SETUP.md`
- **Implementation:** `PROFILE_PICTURE_IMPLEMENTATION.md`
- **Troubleshooting:** `FIREBASE_SETUP.md` Troubleshooting section

## Next Steps

1. ✅ Enable Firebase Storage (if not done)
2. ✅ Add/update security rules
3. ✅ Verify `.env.local` has storage bucket
4. ✅ Restart dev server
5. ✅ Test upload as admin
6. ✅ Verify picture displays on profile
7. ✅ Deploy to production

---

**Questions?** Check `FIREBASE_SETUP.md` for comprehensive documentation.
