# Profile Picture Upload Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        ADMIN INTERFACE                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────┐      ┌──────────────────────┐             │
│  │  Add Customer Page   │      │ Edit Customer Page   │             │
│  │  (/admin/customers/  │      │ (/admin/customers/   │             │
│  │   add)               │      │  {id}/edit)          │             │
│  └──────────────────────┘      └──────────────────────┘             │
│           ↓                              ↓                           │
│  ┌────────────────────────────────────────────────────┐             │
│  │    ProfilePictureUpload Component                  │             │
│  │  (src/components/ui/ProfilePictureUpload.jsx)      │             │
│  │                                                    │             │
│  │  • File input                                     │             │
│  │  • Image preview                                  │             │
│  │  • Upload button                                  │             │
│  │  • Progress indicator                             │             │
│  │  • Error messages                                 │             │
│  └────────────────────────────────────────────────────┘             │
│                         ↓                                            │
│  ┌────────────────────────────────────────────────────┐             │
│  │   profilePicture Utility (src/lib/profilePicture.js)│            │
│  │                                                    │             │
│  │  Functions:                                       │             │
│  │  • validateProfilePicture()                       │             │
│  │  • uploadProfilePicture()                         │             │
│  │  • deleteProfilePicture()                         │             │
│  │  • getProfilePictureUrl()                         │             │
│  │                                                    │             │
│  │  Validations:                                     │             │
│  │  • File type (JPEG, PNG, WebP)                   │             │
│  │  • File size (≤ 2MB)                              │             │
│  └────────────────────────────────────────────────────┘             │
│                         ↓                                            │
└─────────────────────────────────────────────────────────────────────┘
                          ↓
            ┌─────────────────────────┐
            │   Authentication        │
            │   (Firebase Auth)       │
            │                         │
            │   ✓ Verify admin role   │
            │   ✓ Get auth token      │
            └─────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────────┐
│                     FIREBASE BACKEND                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────────────────────────────────────────────┐        │
│  │         Firebase Storage                                │        │
│  │     (profile-pictures bucket)                           │        │
│  │                                                         │        │
│  │  Structure:                                            │        │
│  │  ├── profile-pictures/                                 │        │
│  │  │   ├── {userId_1}/                                   │        │
│  │  │   │   ├── {userId_1}-{timestamp_1}.jpg             │        │
│  │  │   │   └── {userId_1}-{timestamp_2}.jpg             │        │
│  │  │   └── {userId_2}/                                   │        │
│  │  │       └── {userId_2}-{timestamp_1}.png             │        │
│  │                                                         │        │
│  │  ✓ Enforced by Storage Rules                           │        │
│  │  ✓ Download URLs with auth tokens                      │        │
│  │  ✓ Automatic expiration handling                       │        │
│  └─────────────────────────────────────────────────────────┘        │
│                          ↓                                           │
│  ┌─────────────────────────────────────────────────────────┐        │
│  │         Firestore Database                              │        │
│  │     (users collection)                                  │        │
│  │                                                         │        │
│  │  Document: users/{uid}                                 │        │
│  │  {                                                      │        │
│  │    name: "John Doe",                                   │        │
│  │    email: "john@example.com",                          │        │
│  │    role: "user",                                       │        │
│  │    profilePictureUrl: "https://...",  ← NEW FIELD     │        │
│  │    ... other fields                                    │        │
│  │  }                                                      │        │
│  │                                                         │        │
│  │  ✓ Enforced by Firestore Rules                         │        │
│  │  ✓ Admin-only write access                             │        │
│  │  ✓ User read access to own data                        │        │
│  └─────────────────────────────────────────────────────────┘        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      CUSTOMER INTERFACE                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│                    ┌──────────────────────┐                         │
│                    │  Customer Profile    │                         │
│                    │  Page                │                         │
│                    │  (/dashboard/        │                         │
│                    │   profile)           │                         │
│                    └──────────────────────┘                         │
│                            ↓                                        │
│        ┌───────────────────────────────────────┐                   │
│        │   Profile Component                   │                   │
│        │   (src/pages/dashboard/Profile.jsx)   │                   │
│        │                                       │                   │
│        │   Display Logic:                      │                   │
│        │   if (user?.profilePictureUrl) {      │                   │
│        │     <img src={pictureUrl} />          │                   │
│        │   } else {                            │                   │
│        │     <DefaultAvatar />                 │                   │
│        │   }                                   │                   │
│        └───────────────────────────────────────┘                   │
│                            ↓                                        │
│        ┌───────────────────────────────────────┐                   │
│        │   Profile Picture Display             │                   │
│        │   • Bold 2x1 grid layout              │                   │
│        │   • Aspect square image               │                   │
│        │   • Rounded corners                   │                   │
│        │   • Loaded from Firebase CDN          │                   │
│        └───────────────────────────────────────┘                   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### Upload Flow

```
User selects file
    ↓
validateProfilePicture()
├─ Check file exists
├─ Check file type (JPEG/PNG/WebP)
├─ Check file size (≤ 2MB)
    ↓ If validation passes
uploadProfilePicture()
├─ Get Firebase Storage reference
├─ Create storage path: profile-pictures/{userId}/{userId}-{timestamp}
├─ Upload file with uploadBytes()
├─ Get download URL
├─ Return URL string
    ↓ If upload successful
Update form state with URL
    ↓
Submit form with profilePictureUrl
    ↓
adminCreateUser() saves to Firestore
├─ Creates user document
├─ Includes profilePictureUrl field
    ↓
Display success message
```

### Display Flow

```
Customer views profile
    ↓
Profile component mounts
    ↓
Load user data from Firestore
    ↓
Check for profilePictureUrl field
    ↓ If exists
Fetch image from Firebase Storage CDN
    ↓
Display in <img> tag
    ↓ If not exists
Show default avatar (SVG)
```

### Security Flow

```
Admin clicks "Upload Photo"
    ↓
File selected
    ↓
validateProfilePicture()
├─ Client-side validation
├─ User-friendly errors
    ↓ If valid
uploadProfilePicture()
    ↓
Firebase Storage Rules check
├─ Verify authentication (Firebase Auth)
├─ Verify authorization (user.role == 'admin')
├─ Check quota
    ↓ If authorized
File written to Storage
    ↓ If unauthorized
Error: "Permission denied"
```

## Component Hierarchy

```
AdminConsole
├── AllCustomers
│   └── (Customer list with edit links)
├── AddCustomer
│   ├── Form inputs
│   └── ProfilePictureUpload ← NEW
│       ├── File input
│       ├── Image preview
│       ├── Upload button
│       └── Requirements info
└── EditCustomer
    ├── Form inputs
    └── ProfilePictureUpload ← NEW

Dashboard
└── Profile
    ├── User info display
    └── Profile picture area
        ├── Image (if URL exists)
        └── Default avatar (SVG)
```

## State Management

```
Component State (React)
├── AddCustomer
│   ├── form.profilePictureUrl (string)
│   └── status (idle/submitting/success/error)
│
├── EditCustomer
│   ├── form.profilePictureUrl (string)
│   └── saveStatus (idle/saving/success/error)
│
└── ProfilePictureUpload
    ├── previewUrl (local preview before upload)
    ├── isUploading (boolean)
    └── fileInputRef (DOM ref)

Server State (Firestore)
└── users/{uid}
    └── profilePictureUrl (string URL)

File Storage (Firebase Storage)
└── profile-pictures/{userId}/{fileName}
    └── image binary data
```

## Error Handling Flow

```
User uploads file
    ↓
Validation error?
├─ File not selected → "No file selected"
├─ Wrong type → "Only JPEG, PNG, and WebP images are allowed"
└─ Too large → "File size must be less than 2MB (current: 2.5MB)"
    ↓ If validation fails
Show toast error
Reset file input
    ↓ If validation passes
Send to Firebase
    ↓
Upload error?
├─ Not authenticated → "Authentication required"
├─ Not authorized → "You do not have permission..."
├─ Quota exceeded → "Storage quota exceeded..."
└─ Network error → Firebase error message
    ↓ If upload fails
Show toast error
Revert preview URL
    ↓ If upload succeeds
Save URL to form state
Show success toast
```

## Security Rules Enforcement

```
Firebase Storage Rules
├── Rule 1: Match /profile-pictures/{userId}/**
│   ├── WRITE: auth exists AND (uid == userId OR user.role == 'admin')
│   ├── READ: auth exists
│   └── DELETE: auth exists AND user.role == 'admin'
│
└── Rule 2: Match all other paths
    ├── READ: false (denied)
    └── WRITE: false (denied)

Firestore Rules
├── Rule 1: Match /users/{userId}
│   ├── READ: auth.uid == userId OR user.role == 'admin'
│   ├── CREATE: user.role == 'admin'
│   ├── UPDATE: user.role == 'admin'
│   └── DELETE: user.role == 'admin'
│
└── Rule 2: Match all other paths
    ├── READ: false (denied)
    └── WRITE: false (denied)
```

## File Naming Convention

```
profile-pictures/
└── {userId}/                          (User's unique ID)
    └── {userId}-{timestamp}           (Unique file per upload)
        └── .{extension}               (jpg, png, or webp)

Example:
profile-pictures/
└── user_12345/
    ├── user_12345-1692893400000.jpg   (First upload: Aug 24 2023)
    ├── user_12345-1692893500000.jpg   (Second upload: Aug 24 2023)
    └── user_12345-1692980800000.png   (Third upload: Aug 25 2023)

Note: Latest URL is stored in Firestore profilePictureUrl field
```

## Technology Stack

```
Frontend
├── React 19.2.8
│   ├── Component state for forms
│   └── File input handling
├── React Router 7.18.2
│   └── Navigation between pages
└── React Toastify 11.1.0
    └── Success/error notifications

Backend
└── Firebase
    ├── Authentication (Firebase Auth)
    │   └── User role verification
    ├── Cloud Storage
    │   └── Image file storage
    ├── Firestore
    │   └── User metadata storage
    └── Security Rules
        └── Access control

Styling
└── Tailwind CSS 4.3.3
    └── Component styling
```

## Performance Characteristics

```
Upload Performance
├── File size: ≤ 2MB
├── Format: JPEG/PNG/WebP (compressed)
├── Network: Depends on connection
│   └── Typical: 1-5 seconds for 500KB file
├── Retry: Automatic on timeout
└── Caching: Browser HTTP cache

Display Performance
├── Image loading: Lazy via <img>
├── CDN: Firebase Storage CDN
├── Caching: Browser + CDN (weeks)
├── Cache bust: Add ?t=timestamp if needed
└── Typical load time: <1 second
```

## Deployment Architecture

```
Development
├── Local Firebase Emulator (optional)
└── Firebase Console

Staging
├── Firebase Staging Project
├── Same rules as production
└── Test data

Production
├── Firebase Production Project
├── Storage bucket (geographically distributed)
├── Firestore (replicated globally)
└── Security rules enforced
```
