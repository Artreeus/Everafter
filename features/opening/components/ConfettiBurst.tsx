'use client'

import { useEffect, useState } from 'react'

const COLORS = ['#C4A55A', '#C9A0A0', '#2C2825', '#E8E2D9', '#FAF7F2', '#C4A55A']
const COUNT  = 48

interface Particle {
  id:       number
  x:        number
  y:        number
  color:    string
  size:     number
  angle:    number
  speed:    number
  rotation: number
  shape:    'circle' | 'rect'
}

export function ConfettiBurst() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [visible,   setVisible]   = useState(true)

  useEffect(() => {
    const ps: Particle[] = Array.from({ length: COUNT }, (_, i) => ({
      id:       i,
      x:        40 + Math.random() * 20, // center area (vw %)
      y:        30 + Math.random() * 20, // center area (vh %)
      color:    COLORS[Math.floor(Math.random() * COLORS.length)],
      size:     Math.random() * 7 + 4,
      angle:    Math.random() * 360,
      speed:    Math.random() * 200 + 100,
      rotation: Math.random() * 720 - 360,
      shape:    Math.random() > 0.5 ? 'rect' : 'circle',
    }))
    setParticles(ps)

    const t = setTimeout(() => setVisible(false), 2800)
    return () => clearTimeout(t)
  }, [])

  if (!visible || particles.length === 0) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left:             `${p.x}%`,
            top:              `${p.y}%`,
            width:            p.shape === 'circle' ? p.size : p.size * 0.6,
            height:           p.shape === 'circle' ? p.size : p.size * 1.4,
            backgroundColor:  p.color,
            borderRadius:     p.shape === 'circle' ? '50%' : '2px',
            animation:        `confetti-fall ${p.speed / 100}s ease-out forwards`,
            animationDelay:   `${Math.random() * 0.3}s`,
            transform:        `rotate(${p.rotation}deg)`,
            opacity:          1,
          }}
        />
      ))}

      <style>{`
        @keyframes confetti-fall {
          0%   { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(
            ${Math.random() > 0.5 ? '' : '-'}${Math.floor(Math.random() * 200 + 50)}px,
            ${Math.floor(Math.random() * 300 + 100)}px
          ) rotate(${Math.floor(Math.random() * 720)}deg); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
