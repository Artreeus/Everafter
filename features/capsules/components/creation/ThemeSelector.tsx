'use client'

import Link     from 'next/link'
import { Lock } from 'lucide-react'
import { cn }   from '@/lib/utils/cn'
import type { CapsuleTheme } from '@/types/capsule.types'
import { PREMIUM_THEMES }   from '@/lib/billing/plans'

interface Theme {
  id:          CapsuleTheme
  label:       string
  description: string
  bg:          string
  accent:      string
}

const THEMES: Theme[] = [
  { id: 'classic',  label: 'Classic',  description: 'Warm ivory and parchment',  bg: 'bg-cream',         accent: 'bg-stone'           },
  { id: 'floral',   label: 'Floral',   description: 'Soft rose and blush',       bg: 'bg-rose/20',       accent: 'bg-rose'            },
  { id: 'midnight', label: 'Midnight', description: 'Deep charcoal and silver',  bg: 'bg-charcoal',      accent: 'bg-warm-gray'       },
  { id: 'golden',   label: 'Golden',   description: 'Warm gold and cream',       bg: 'bg-gold/20',       accent: 'bg-gold'            },
  { id: 'sakura',   label: 'Sakura',   description: 'Cherry blossom pink',       bg: 'bg-[#FCE4ED]',     accent: 'bg-[#D4789A]'      },
  { id: 'ocean',    label: 'Ocean',    description: 'Deep teal and silver',      bg: 'bg-[#C8E8ED]',     accent: 'bg-[#2A8FA0]'      },
  { id: 'ember',    label: 'Ember',    description: 'Warm terracotta glow',      bg: 'bg-[#FAE4D4]',     accent: 'bg-[#C4673A]'      },
  { id: 'velvet',   label: 'Velvet',   description: 'Deep indigo luxury',        bg: 'bg-[#2D1F45]',     accent: 'bg-[#8B5CF6]'      },
]

interface ThemeSelectorProps {
  value:    CapsuleTheme
  onChange: (theme: CapsuleTheme) => void
  userPlan?: 'free' | 'plus'
}

export function ThemeSelector({ value, onChange, userPlan = 'free' }: ThemeSelectorProps) {
  const isPlusUser = userPlan === 'plus'

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {THEMES.map((theme) => {
          const isSelected = value === theme.id
          const isLocked   = PREMIUM_THEMES.includes(theme.id as typeof PREMIUM_THEMES[number]) && !isPlusUser

          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => { if (!isLocked) onChange(theme.id) }}
              className={cn(
                'relative rounded-xl p-4 text-left transition-all duration-200 border-2',
                isLocked
                  ? 'border-stone opacity-70 cursor-default'
                  : isSelected
                    ? 'border-charcoal shadow-card'
                    : 'border-stone hover:border-warm-gray/50',
              )}
            >
              {/* Preview swatch */}
              <div className={cn('rounded-lg h-12 mb-3 flex items-end p-2 gap-1', theme.bg)}>
                <div className={cn('h-1.5 w-8 rounded-full opacity-60', theme.accent)} />
                <div className={cn('h-1.5 w-5 rounded-full opacity-40', theme.accent)} />
              </div>

              <p className="text-sm font-medium text-charcoal">{theme.label}</p>
              <p className="text-xs text-warm-gray mt-0.5">{theme.description}</p>

              {isSelected && !isLocked && (
                <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-charcoal" />
              )}

              {isLocked && (
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full bg-gold/20 px-1.5 py-0.5">
                  <Lock size={9} className="text-gold" />
                  <span className="text-[9px] font-medium text-gold uppercase tracking-wide">Plus</span>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {!isPlusUser && (
        <p className="text-xs text-warm-gray">
          4 premium themes available on{' '}
          <Link href="/settings/billing" className="text-gold hover:underline">
            Everafter Plus
          </Link>
          .
        </p>
      )}
    </div>
  )
}
