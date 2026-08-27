async function getStatus() {
  // Server-side fetch to prove data fetching works end to end.
  // Using a public, keyless endpoint so this works with no env vars.
  const res = await fetch("https://api.github.com/zen", {
    cache: "no-store",
  })
  const message = await res.text()
  return {
    ok: res.ok,
    message,
    checkedAt: new Date().toISOString(),
  }
}

export default async function Health() {
  const status = await getStatus()

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1
        className="text-3xl italic text-plum mb-6"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Health check
      </h1>
      <div className="border border-lavender/30 rounded-xl p-6">
        <p className="text-sm text-plum/70 mb-2">Status</p>
        <p className="text-lg mb-4">
          {status.ok ? "✓ Server fetch working" : "✗ Fetch failed"}
        </p>
        <p className="text-sm text-plum/70 mb-2">Fetched data</p>
        <p className="text-plum mb-4">&ldquo;{status.message}&rdquo;</p>
        <p className="text-xs text-plum/70">Checked at {status.checkedAt}</p>
      </div>
    </div>
  )
}