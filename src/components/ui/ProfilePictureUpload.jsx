import { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { uploadProfilePicture, validateProfilePicture } from '../../lib/profilePicture.js'
import Text from './Text.jsx'

export default function ProfilePictureUpload({ userId, onUploadSuccess, currentImageUrl = null }) {
  const fileInputRef = useRef(null)
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl)

  function handleFileSelect(event) {
    const file = event.target.files?.[0]
    if (!file) return

    const errors = validateProfilePicture(file)
    if (errors.length > 0) {
      toast.error(errors.join('. '))
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => setPreviewUrl(e.target.result)
    reader.readAsDataURL(file)

    handleUpload(file)
  }

  async function handleUpload(file) {
    setIsUploading(true)
    try {
      const downloadURL = await uploadProfilePicture(userId, file)
      setPreviewUrl(downloadURL)
      toast.success('Profile picture uploaded successfully')
      onUploadSuccess?.(downloadURL)
    } catch (error) {
      toast.error(error.message || 'Failed to upload profile picture')
      setPreviewUrl(currentImageUrl)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-3">
          <div className="relative h-32 w-32 overflow-hidden rounded-lg border-2 border-dashed border-text-secondary/30 bg-surface">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Profile preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-1/2 w-1/2 text-text-secondary/40"
                  aria-label="Default profile photo"
                >
                  <circle cx="12" cy="8" r="4" fill="currentColor" />
                  <path
                    fill="currentColor"
                    d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6v1H4z"
                  />
                </svg>
              </div>
            )}
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            disabled={isUploading}
            className="hidden"
            aria-label="Upload profile picture"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="rounded-lg bg-primary px-4 py-2 font-body text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {isUploading ? 'Uploading...' : 'Upload Photo'}
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <Text variant="small" className="font-medium">
            Profile Picture Requirements
          </Text>
          <ul className="space-y-1 font-body text-xs text-text-secondary">
            <li>• Maximum file size: 2MB</li>
            <li>• Formats: JPEG, PNG, WebP</li>
            <li>• Square image recommended</li>
            <li>• High resolution preferred</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
