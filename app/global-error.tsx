'use client'

// Last-resort boundary for errors thrown in the root layout itself. Must render
// its own <html>/<body>. Keeps the site from ever showing a bare crash screen.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0 }}>
        <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 16, textAlign: 'center' }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1E2026' }}>Something went wrong</h1>
          <p style={{ color: '#6B6862', fontSize: 14, maxWidth: 320 }}>
            Please try again in a moment.
          </p>
          <button
            onClick={reset}
            style={{ padding: '10px 20px', background: '#B57F50', color: '#fff', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer' }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  )
}
