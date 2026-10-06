// Example: How to use the backend API from your React components

import { getAllUsers, getUserByUid, updateBackendUser } from './apiClient.js'

// ============================================
// 1. FETCH ALL USERS FROM BACKEND
// ============================================
export async function exampleFetchAllUsers() {
  try {
    const users = await getAllUsers()
    console.log('All users:', users)
    return users
  } catch (error) {
    console.error('Failed to fetch users:', error)
  }
}

// ============================================
// 2. FETCH SPECIFIC USER BY UID
// ============================================
export async function exampleFetchUserByUid(uid) {
  try {
    const user = await getUserByUid(uid)
    console.log('User data from backend:', user)
    return user
  } catch (error) {
    console.error('Failed to fetch user:', error)
  }
}

// ============================================
// 3. UPDATE USER DATA
// ============================================
export async function exampleUpdateUser(uid, updates) {
  try {
    // Example updates:
    const updatedUser = await updateBackendUser(uid, {
      phone: '555-1234',
      accountNumber: 'ACC-789456',
      firstName: 'Jane',
    })
    console.log('User updated:', updatedUser)
    return updatedUser
  } catch (error) {
    console.error('Failed to update user:', error)
  }
}

// ============================================
// 4. USAGE IN A REACT COMPONENT
// ============================================

import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth.js'

export function UserDashboardExample() {
  const { user } = useAuth() // Get current user from Firebase
  const [backendUser, setBackendUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user?.uid) return

    // Fetch user data from backend using Firebase UID
    const fetchUserData = async () => {
      try {
        setLoading(true)
        const data = await getUserByUid(user.uid)
        setBackendUser(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [user?.uid])

  if (loading) return <div>Loading user data...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h1>Welcome, {backendUser?.firstName || 'User'}</h1>
      <p>Email: {backendUser?.email}</p>
      <p>Account: {backendUser?.accountNumber || 'Not set'}</p>
      <p>Phone: {backendUser?.phone || 'Not set'}</p>
      <p>Joined: {new Date(backendUser?.createdAt).toLocaleDateString()}</p>
    </div>
  )
}

// ============================================
// 5. SYNCING DATA ACROSS SYSTEMS
// ============================================

export async function syncUserDataExample() {
  // Scenario: User updates their profile in React
  // We want to update BOTH Firebase and our Node backend

  const uid = 'user_firebase_uid'
  const updates = {
    firstName: 'Jane',
    phone: '+1-555-1234',
  }

  try {
    // 1. Update Firebase (already in your code)
    // await updateUserProfile(uid, updates)

    // 2. Also update backend
    await updateBackendUser(uid, updates)

    console.log('✅ User data synced to both Firebase and backend')
  } catch (error) {
    console.error('❌ Sync failed:', error)
  }
}

// ============================================
// 6. DISPLAYING USER LIST
// ============================================

export function UserListExample() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await getAllUsers()
        setUsers(allUsers)
      } catch (error) {
        console.error('Failed to load users:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (loading) return <div>Loading users...</div>

  return (
    <table>
      <thead>
        <tr>
          <th>Email</th>
          <th>Name</th>
          <th>Phone</th>
          <th>Account</th>
          <th>Joined</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id}>
            <td>{user.email}</td>
            <td>{user.firstName} {user.lastName}</td>
            <td>{user.phone || '-'}</td>
            <td>{user.accountNumber || '-'}</td>
            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
