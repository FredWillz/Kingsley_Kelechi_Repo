# Fintech Backend API

Node.js + Express API that works alongside your Firebase setup.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install dev dependencies:
```bash
npm install -D nodemon
```

## Running the Server

Development (with auto-reload):
```bash
npm run dev
```

Production:
```bash
npm start
```

The server runs on `http://localhost:3000`

## API Documentation

Interactive Swagger docs: `http://localhost:3000/api-docs`

### Endpoints

#### POST /api/users
Create a new user when they sign up in Firebase.

**Request:**
```json
{
  "uid": "firebase_uid_123",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "1234567890",
  "accountNumber": "ACC123456"
}
```

**Response:**
```json
{
  "id": "1698765432100",
  "message": "User created successfully",
  "user": {
    "id": "1698765432100",
    "uid": "firebase_uid_123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "1234567890",
    "accountNumber": "ACC123456",
    "createdAt": "2024-10-31T12:34:56.789Z"
  }
}
```

#### GET /api/users
Get all users stored in the backend.

**Response:**
```json
[
  {
    "id": "1698765432100",
    "uid": "firebase_uid_123",
    "email": "user@example.com",
    ...
  }
]
```

#### GET /api/users/:uid
Get a specific user by Firebase UID.

**Response:**
```json
{
  "id": "1698765432100",
  "uid": "firebase_uid_123",
  "email": "user@example.com",
  ...
}
```

#### PUT /api/users/:uid
Update user data.

**Request:**
```json
{
  "firstName": "Jane",
  "phone": "9876543210"
}
```

**Response:**
Updated user object

## How It Works

### Flow:
1. **User signs up** in your React app → Firebase creates auth user
2. **Firestore profile created** → User data stored in Firebase
3. **Backend notified** → Axios sends user data to `POST /api/users`
4. **Backend stores** → User data saved to `users.json` file

### Files:
- `users.json` - JSON file storing all user data (created automatically)
- `server.js` - Main Express server with all endpoints

### Frontend Integration:
- `src/lib/apiClient.js` - Axios client for making requests
- `src/lib/adminCreateUser.js` - Automatically calls backend when user is created

## Environment Setup

Make sure your frontend is running on:
```
http://localhost:5173
```

The backend CORS is configured to allow requests from this origin.

## Database

Currently using a simple JSON file (`users.json`) for storage. This is perfect for development and learning. 

For production, you could upgrade to:
- MongoDB
- PostgreSQL
- Firebase Realtime Database
- Any other database

## Testing

Test endpoints in Swagger UI: `http://localhost:3000/api-docs`

Or with curl:
```bash
# Create user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"uid":"test123","email":"test@example.com","firstName":"John"}'

# Get all users
curl http://localhost:3000/api/users

# Get specific user
curl http://localhost:3000/api/users/test123
```

## Development

- **Nodemon** auto-restarts the server when you change code
- **CORS** allows requests from your React app
- **Swagger** provides interactive API docs
- **JSON file storage** makes it easy to inspect data
