'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <h2 className="text-4xl md:text-6xl font-oswald font-bold uppercase mb-8">
          Etwas ist schiefgelaufen
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          {error.message || 'Ein unerwarteter Fehler ist aufgetreten.'}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-black text-white font-bold uppercase tracking-widest hover:opacity-80 transition-opacity"
          >
            Erneut versuchen
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-black font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück zur Startseite
          </Link>
        </div>
      </div>
    </div>
  )
}

