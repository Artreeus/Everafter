export default function OpenNotFound() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{ background: 'linear-gradient(160deg, #2C2825 0%, #1A1714 100%)' }}
    >
      <div className="space-y-4 max-w-sm">
        <p className="text-ivory/30 text-xs font-sans uppercase tracking-widest">
          Not found
        </p>
        <h1
          className="text-ivory text-2xl font-light"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          This link has expired<br />or no longer exists.
        </h1>
        <p className="text-ivory/40 text-sm font-sans leading-relaxed">
          Time capsule links are unique and single-use.
          If you believe this is an error, contact the person who sent it.
        </p>
      </div>
    </main>
  )
}
