'use client' // Error components must be Client Components

import { useEffect } from 'react'
import { IoWarning } from 'react-icons/io5'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <IoWarning size={80} className="text-red-500 animate-pulse" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-3">¡Ouch! Un error salvaje apareció.</h2>
        <p className="text-gray-500 mb-6">
          {error.message || 'No pudimos cargar los datos del Pokémon.'}
        </p>
        <button
          onClick={() => reset()}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-lg transition"
        >
          Intentar capturarlo de nuevo
        </button>
      </div>
    </div>
  )
}
