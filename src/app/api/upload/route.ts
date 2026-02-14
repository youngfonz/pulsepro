import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { requireUserId } from '@/lib/auth'

// Configure route for larger file uploads
export const maxDuration = 60 // 60 seconds

export async function POST(request: NextRequest) {
  try {
    await requireUserId()

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const rawType = formData.get('type') as string || 'general'
    const allowedUploadTypes = ['projects', 'tasks', 'general']
    const type = allowedUploadTypes.includes(rawType) ? rawType : 'general'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type - allow images and PDFs
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf'
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        error: 'Invalid file type. Only images (JPEG, PNG, GIF, WebP) and PDFs are allowed'
      }, { status: 400 })
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File must be less than 10MB' }, { status: 400 })
    }

    // Create unique filename
    const timestamp = Date.now()
    const ext = file.name.split('.').pop()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filename = `${type}/${timestamp}-${originalName}`

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
    })

    return NextResponse.json({
      path: blob.url,
      name: file.name,
      type: file.type,
      size: file.size,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({
      error: 'Upload failed',
    }, { status: 500 })
  }
}
