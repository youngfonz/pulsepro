import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { readFile } from 'fs/promises'
import path from 'path'

export async function GET() {
  await requireAdmin()

  const filePath = path.join(process.cwd(), 'docs', 'features.html')
  const html = await readFile(filePath, 'utf-8')

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
