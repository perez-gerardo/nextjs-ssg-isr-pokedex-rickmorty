import Link from 'next/link'
import { IoSearch } from 'react-icons/io5'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <IoSearch size={100} className="text-purple-500" />
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-white">?</span>
          </div>
        </div>
        <h2 className="text-4xl font-bold text-gray-800 mb-2">404</h2>
        <h3 className="text-2xl font-bold text-gray-700 mb-4">Pokémon extraviado</h3>
        <p className="text-gray-500 mb-8">
          Parece que el Pokémon que buscas no se encuentra en esta región o la ruta es incorrecta.
        </p>
        <Link
          href="/pokemon"
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition transform hover:scale-105"
        >
          Volver a la Pokédex
        </Link>
      </div>
    </div>
  )
}
