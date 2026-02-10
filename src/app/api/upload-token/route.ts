import { NextResponse } from 'next/server'
import { requireUserId } from '@/lib/auth'

export async function POST() {
  try {
    await requireUserId()

    const token = process.env.BLOB_READ_WRITE_TOKEN

    if (!token) {
      return NextResponse.json({ error: 'Upload token not configured' }, { status: 500 })
    }

    return NextResponse.json({ token })
  } catch (error) {
    console.error('Token generation error:', error)
    return NextResponse.json({ error: 'Failed to generate upload token' }, { status: 500 })
  }
}
