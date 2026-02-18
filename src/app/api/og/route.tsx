import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#0f172a',
          padding: '60px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              backgroundColor: '#171717',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '28px',
              fontWeight: 700,
            }}
          >
            P
          </div>
          <span
            style={{
              fontSize: '44px',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.02em',
            }}
          >
            Pulse Pro
          </span>
        </div>

        <div
          style={{
            fontSize: '28px',
            color: '#94a3b8',
            textAlign: 'center',
            maxWidth: '700px',
            lineHeight: 1.4,
            marginBottom: '48px',
          }}
        >
          Project management for people who don't need project management.
        </div>

        <div
          style={{
            display: 'flex',
            gap: '16px',
          }}
        >
          {['Projects', 'Tasks', 'Clients', 'Bookmarks', 'Calendar'].map(
            (feature) => (
              <div
                key={feature}
                style={{
                  padding: '10px 24px',
                  borderRadius: '9999px',
                  border: '1px solid #1e293b',
                  color: '#58a6ff',
                  fontSize: '18px',
                  fontWeight: 500,
                }}
              >
                {feature}
              </div>
            )
          )}
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            fontSize: '18px',
            color: '#475569',
            fontWeight: 500,
          }}
        >
          pulsepro.work
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
