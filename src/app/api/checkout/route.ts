import { Checkout } from '@polar-sh/nextjs'

export const GET = Checkout({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  successUrl: process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}/settings?upgraded=true`
    : '/settings?upgraded=true',
  server: (process.env.POLAR_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
})
