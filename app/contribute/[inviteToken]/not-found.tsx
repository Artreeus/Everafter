export default function ContributeNotFound() {
  return (
    <main className="min-h-screen bg-ivory flex flex-col items-center justify-center text-center px-6 gap-3">
      <div className="space-y-3 max-w-sm">
        <p className="text-xs text-warm-gray uppercase tracking-widest font-medium">Everafter</p>
        <h1 className="font-display text-2xl font-light text-charcoal">Link not found</h1>
        <p className="text-sm text-warm-gray leading-relaxed">
          This contribution link is invalid or has expired. Ask the capsule creator to send you a new invite.
        </p>
      </div>
    </main>
  )
}
