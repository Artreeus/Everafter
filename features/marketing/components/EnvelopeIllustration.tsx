import { cn } from '@/lib/utils/cn'

interface EnvelopeIllustrationProps {
  className?: string
}

export function EnvelopeIllustration({ className }: EnvelopeIllustrationProps) {
  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      aria-hidden
    >
      {/* Envelope body */}
      <rect
        x="4"
        y="30"
        width="192"
        height="126"
        rx="8"
        fill="var(--color-cream)"
        stroke="var(--color-stone)"
        strokeWidth="1.5"
      />

      {/* Envelope flap (closed) */}
      <path
        d="M4 38 L100 95 L196 38"
        stroke="var(--color-stone)"
        strokeWidth="1.5"
        fill="none"
      />

      {/* Wax seal */}
      <circle cx="100" cy="95" r="14" fill="var(--color-gold)" opacity="0.9" />
      <circle cx="100" cy="95" r="10" stroke="var(--color-cream)" strokeWidth="1" fill="none" />

      {/* Seal letter E */}
      <text
        x="100"
        y="100"
        textAnchor="middle"
        fontSize="11"
        fill="var(--color-cream)"
        fontFamily="serif"
        fontStyle="italic"
      >
        E
      </text>

      {/* Bottom envelope folds */}
      <path
        d="M4 156 L68 100 M196 156 L132 100"
        stroke="var(--color-stone)"
        strokeWidth="1"
        opacity="0.5"
      />
    </svg>
  )
}
