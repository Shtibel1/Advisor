import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Nadav AI – יועץ ומומחה בינה מלאכותית לעסקים'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #0f0f0f 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Glow circle */}
        <div
          style={{
            position: 'absolute',
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
          }}
        />

        {/* Logo / Name */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-2px',
            display: 'flex',
            gap: 12,
            alignItems: 'center',
          }}
        >
          <span style={{ color: '#818cf8' }}>Nadav</span>
          <span>AI</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 30,
            color: '#a1a1aa',
            marginTop: 24,
            maxWidth: 800,
            textAlign: 'center',
            lineHeight: 1.4,
            display: 'flex',
          }}
        >
          יועץ ומומחה בינה מלאכותית לעסקים
        </div>

        {/* Divider */}
        <div
          style={{
            width: 80,
            height: 3,
            background: 'linear-gradient(90deg, #6366f1, #818cf8)',
            borderRadius: 4,
            marginTop: 32,
            display: 'flex',
          }}
        />

        {/* Sub-tagline */}
        <div
          style={{
            fontSize: 20,
            color: '#71717a',
            marginTop: 28,
            display: 'flex',
          }}
        >
          nadav-shtibel.com
        </div>
      </div>
    ),
    { ...size }
  )
}
