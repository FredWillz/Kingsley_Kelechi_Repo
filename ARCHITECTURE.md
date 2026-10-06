# Architecture: Firebase + Node Backend

This document explains how your frontend, Firebase, and Node backend work together.

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     REACT FRONTEND (Vite)                       │
│                   http://localhost:5173                         │
│                                                                 │
│  ┌──────────────────────┐         ┌──────────────────────┐    │
│  │  Auth Components     │         │  Dashboard/Pages     │    │
│  │  - LoginForm         │         │  - User Profile      │    │
│  │  - SignupForm        │         │  - Transactions      │    │
│  │                      │         │  - User List         │    │
│  └──────────────────────┘         └──────────────────────┘    │
└──────────┬──────────────────────────────┬─────────────────────┘
           │                              │
           │ Uses apiClient.js            │ Uses axios/apiClient.js
           │ (axios HTTP client)          │
           │                              │
    ┌──────▼──────────┐         ┌────────▼──────────┐
    │  Firebase Auth  │         │  Node.js Backend  │
    │  + Firestore    │         │  + JSON Storage   │
    │ localhost:PORT  │         │  localhost:3000   │
    └─────────────────┘         └───────────────────┘
           │                              │
    Authentication                    User Data
    User Profiles (JSON)             (users.json)
```

## Data Flow

### 1. USER SIGNUP/CREATION

```
Step 1: User signs up in React app
   ↓
Step 2: adminCreateUser() is called
   ├─ Creates Firebase Auth user
   ├─ Creates Firestore profile
   └─ Sends data to Node backend (POST /api/users)
   ↓
Step 3: Backend receives and stores
   └─ Saves to users.json file
   ↓
Both systems now have the user data!
```

### 2. USER LOGIN

```
Step 1: User logs in with email/password
   ↓
Step 2: Firebase authenticates user
   ├─ Returns user UID
   └─ Loads Firestore profile into context
   ↓
Step 3: (Optional) Fetch additional data from backend
   └─ GET /api/users/:uid from backend
```

### 3. USER DATA UPDATES

```
Step 1: User updates profile in React
   ↓
Step 2: Update both systems
   ├─ updateUserProfile(uid, data) → Firebase/Firestore
   └─ updateBackendUser(uid, data) → Node backend
   ↓
Both systems stay in sync!
```

## Files Structure

```
fintech_kingsley/
├── src/
│   ├── lib/
│   │   ├── firebase.js              # Firebase config
│   │   ├── adminCreateUser.js       # ✨ Creates Firebase + Backend user
│   │   ├── userProfile.js           # Firestore user profile CRUD
│   │   ├── apiClient.js             # ✨ Axios HTTP client for backend
│   │   └── apiUsageExample.jsx      # ✨ Examples of API usage
│   ├── context/
│   │   ├── AuthContext.js
│   │   └── AuthProvider.jsx         # Provides user to entire app
│   └── components/
│       └── Login/
│           └── LoginForm.jsx
│
└── backend/
    ├── server.js                    # ✨ Express server + endpoints
    ├── users.json                   # ✨ User data storage (auto-created)
    ├── package.json                 # Dependencies
    └── README.md                    # Backend documentation

✨ = New files created for this Node backend integration
```

## API Endpoints

### POST /api/users
**Called when:** User signs up (from adminCreateUser.js)

```javascript
Request Body:
{
  "uid": "firebase_uid_xyz",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "555-1234",
  "accountNumber": "ACC123"
}

Response:
{
  "id": "1698765432100",
  "message": "User created successfully",
  "user": { /* full user object */ }
}
```

### GET /api/users
**Called from:** Dashboard or user listing page

```javascript
Response: Array of all users
[
  { id: "...", uid: "...", email: "...", ... },
  { id: "...", uid: "...", email: "...", ... },
  ...
]
```

### GET /api/users/:uid
**Called from:** User detail pages

```javascript
Response: Single user object
{
  "id": "1698765432100",
  "uid": "firebase_uid",
  "email": "user@example.com",
  ...
}
```

### PUT /api/users/:uid
**Called from:** Profile update forms

```javascript
Request Body:
{
  "firstName": "Jane",
  "phone": "555-5678"
}

Response: Updated user object
```

## How to Use

### In Your Components

```javascript
import { useAuth } from '../hooks/useAuth.js'
import { getUserByUid, updateBackendUser } from '../lib/apiClient.js'

function UserProfile() {
  const { user } = useAuth() // From Firebase
  const [backendUser, setBackendUser] = useState(null)

  useEffect(() => {
    // Fetch additional data from backend
    getUserByUid(user.uid).then(setBackendUser)
  }, [user])

  async function handleUpdate(updates) {
    // Update backend
    await updateBackendUser(user.uid, updates)
    // Optionally update Firebase too
    // await updateUserProfile(user.uid, updates)
  }

  return (
    <div>
      <h1>{backendUser?.firstName}</h1>
      <p>{backendUser?.email}</p>
    </div>
  )
}
```

### Running Both Systems

**Terminal 1 - Frontend:**
```bash
cd fintech_kingsley
npm run dev
# Starts at http://localhost:5173
```

**Terminal 2 - Backend:**
```bash
cd fintech_kingsley/backend
npm run dev
# Starts at http://localhost:3000
# Swagger docs at http://localhost:3000/api-docs
```

## Key Concepts

### Firebase (Cloud)
- **Purpose:** Authentication, real-time sync, cloud storage
- **Stores:** User auth credentials, user profiles (Firestore)
- **Best for:** Long-term data, cloud backups, scalability

### Node Backend (Local)
- **Purpose:** Learning, additional processing, custom API
- **Stores:** User data in JSON file (simple database)
- **Best for:** Development, quick prototyping, understanding servers

### Why Both?
✅ Keep Firebase for security and authentication  
✅ Add Node backend to learn server concepts  
✅ Both stay in sync automatically  
✅ Can upgrade Node backend to real database later  

## Common Tasks

### Task: Display all users in a table
```javascript
import { getAllUsers } from '../lib/apiClient.js'

// In component:
const users = await getAllUsers()
return <UserTable data={users} />
```

### Task: Update user profile
```javascript
import { updateBackendUser } from '../lib/apiClient.js'
import { updateUserProfile } from '../lib/userProfile.js'

async function saveProfile(uid, data) {
  await updateUserProfile(uid, data)        // Firebase
  await updateBackendUser(uid, data)        // Node backend
}
```

### Task: Check backend data
```bash
# Look at users.json in backend folder
cat backend/users.json

# Or use Swagger UI
open http://localhost:3000/api-docs
```

## Next Steps

1. **Run both servers:**
   - Terminal 1: `npm run dev` (frontend)
   - Terminal 2: `cd backend && npm run dev` (backend)

2. **Create a test user** in your app

3. **Check backend/users.json** - your user will be there!

4. **Explore Swagger docs** - test endpoints at http://localhost:3000/api-docs

5. **Look at apiUsageExample.jsx** - see more examples of API usage

## Troubleshooting

**Q: Backend not receiving user data?**
- Make sure backend is running: `npm run dev` in backend folder
- Check console logs - should see "✅ User created: email"

**Q: CORS errors?**
- Ensure frontend is on http://localhost:5173
- Backend has CORS configured for this port

**Q: Can't find users.json?**
- It's auto-created when first user is added
- Check: `backend/users.json`

**Q: Want to clear all data?**
- Delete `backend/users.json` file
- It will be recreated on next user signup
