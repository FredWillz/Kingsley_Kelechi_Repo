import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import app from './firebase.js'

const MAX_FILE_SIZE = 2 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export function validateProfilePicture(file) {
  const errors = []

  if (!file) {
    errors.push('No file selected')
    return errors
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    errors.push('Only JPEG, PNG, and WebP images are allowed')
  }

  if (file.size > MAX_FILE_SIZE) {
    errors.push(`File size must be less than 2MB (current: ${(file.size / 1024 / 1024).toFixed(2)}MB)`)
  }

  return errors
}

export async function uploadProfilePicture(userId, file) {
  const errors = validateProfilePicture(file)
  if (errors.length > 0) {
    throw new Error(errors.join('. '))
  }

  try {
    const storage = getStorage(app)
    const fileName = `${userId}-${Date.now()}`
    const storageRef = ref(storage, `profile-pictures/${userId}/${fileName}`)

    await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(storageRef)

    return downloadURL
  } catch (error) {
    if (error.code === 'storage/unauthorized') {
      throw new Error('You do not have permission to upload profile pictures. Only admins can upload.')
    }
    if (error.code === 'storage/quota-exceeded') {
      throw new Error('Storage quota exceeded. Please contact support.')
    }
    throw error
  }
}

export async function deleteProfilePicture(userId, fileUrl) {
  try {
    const storage = getStorage(app)
    const fileRef = ref(storage, fileUrl)
    await deleteObject(fileRef)
  } catch (error) {
    console.error('Failed to delete profile picture:', error)
  }
}

export async function getProfilePictureUrl(userId) {
  try {
    const storage = getStorage(app)
    const folderRef = ref(storage, `profile-pictures/${userId}`)
    return folderRef
  } catch (error) {
    console.error('Failed to get profile picture URL:', error)
    return null
  }
}
