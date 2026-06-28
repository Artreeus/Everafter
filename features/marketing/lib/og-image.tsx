import { ImageResponse } from 'next/og'

export const OG_SIZE         = { width: 1200, height: 630 }
export const OG_ALT          = 'Everafter — Some words deserve the perfect moment.'
export const OG_CONTENT_TYPE = 'image/png'

/**
 * Branded Open Graph / Twitter card, generated dynamically with next/og.
 * Charcoal canvas, gold wax-seal mark, wordmark, and tagline — matches the site.
 */
export function renderOgImage(): ImageResponse {
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
          backgroundColor: '#2C2825',
          position: 'relative',
        }}
      >
        {/* warm bloom */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            backgroundImage:
              'radial-gradient(circle at 50% 38%, rgba(196,165,90,0.20), rgba(44,40,37,0) 55%)',
          }}
        />

        {/* top gold rule */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: 4,
            display: 'flex',
            backgroundImage:
              'linear-gradient(90deg, rgba(196,165,90,0) 0%, rgba(196,165,90,0.7) 50%, rgba(196,165,90,0) 100%)',
          }}
        />

        {/* wax seal */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 104,
            height: 104,
            borderRadius: 9999,
            backgroundColor: '#C4A55A',
            backgroundImage: 'radial-gradient(circle at 35% 30%, #D4B870, #A8893A)',
            marginBottom: 44,
            color: '#FAF7F2',
            fontSize: 56,
            border: '2px solid rgba(250,247,242,0.55)',
          }}
        >
          E
        </div>

        {/* wordmark */}
        <div style={{ display: 'flex', fontSize: 112, fontWeight: 600, color: '#FAF7F2', letterSpacing: -3 }}>
          Everafter
        </div>

        {/* tagline */}
        <div style={{ display: 'flex', marginTop: 28, fontSize: 34, color: 'rgba(250,247,242,0.55)' }}>
          Some words deserve the perfect moment.
        </div>

        {/* bottom accent */}
        <div style={{ display: 'flex', marginTop: 52, width: 120, height: 2, backgroundColor: 'rgba(196,165,90,0.6)' }} />
      </div>
    ),
    { ...OG_SIZE },
  )
}
