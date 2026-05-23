'use client'

import { useState, useEffect } from 'react'
import { Character, CharacterListResponse } from '@/types/rickandmorty'
import Image from 'next/image'
import Link from 'next/link'

interface Props {
  initialCharacters: Character[]
}

const STATUS_OPTIONS = ['', 'Alive', 'Dead', 'unknown']
const GENDER_OPTIONS = ['', 'Female', 'Male', 'Genderless', 'unknown']

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { dot: string; text: string; border: string }> = {
    Alive: { dot: '#39FF14', text: '#39FF14', border: 'rgba(57,255,20,0.3)' },
    Dead: { dot: '#ff2d78', text: '#ff2d78', border: 'rgba(255,45,120,0.3)' },
    unknown: { dot: '#8baab8', text: '#8baab8', border: 'rgba(139,170,184,0.3)' },
  }
  const c = colors[status] || colors.unknown

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ border: `1px solid ${c.border}`, color: c.text }}>
      <span className="w-2 h-2 rounded-full flex-shrink-0"
        style={{
          backgroundColor: c.dot,
          boxShadow: status === 'Alive' ? `0 0 6px ${c.dot}` : 'none',
          animation: status === 'Alive' ? 'pulse 2s infinite' : 'none',
        }} />
      {status}
    </span>
  )
}

export default function SearchClient({ initialCharacters }: Props) {
  const [name, setName] = useState('')
  const [status, setStatus] = useState('')
  const [gender, setGender] = useState('')
  const [type, setType] = useState('')
  const [results, setResults] = useState<Character[]>(initialCharacters)
  const [searching, setSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const isFiltering = name || status || gender || type

  // CSR: Búsqueda en tiempo real con useEffect y debounce
  useEffect(() => {
    if (!isFiltering) {
      setResults(initialCharacters)
      setHasSearched(false)
      return
    }

    const timer = setTimeout(async () => {
      setSearching(true)
      setHasSearched(true)
      try {
        const params = new URLSearchParams()
        if (name) params.append('name', name)
        if (status) params.append('status', status)
        if (gender) params.append('gender', gender)
        // La API de Rick and Morty no soporta filtro "type" directamente en query
        // pero podemos filtrar localmente
        const url = `https://rickandmortyapi.com/api/character/?${params.toString()}`
        const res = await fetch(url)
        if (!res.ok) {
          setResults([])
          setSearching(false)
          return
        }
        const data: CharacterListResponse = await res.json()
        let filtered = data.results
        if (type) {
          filtered = filtered.filter(c => c.type.toLowerCase().includes(type.toLowerCase()))
        }
        setResults(filtered)
      } catch {
        setResults([])
      }
      setSearching(false)
    }, 400)

    return () => clearTimeout(timer)
  }, [name, status, gender, type, initialCharacters, isFiltering])

  const clearFilters = () => {
    setName('')
    setStatus('')
    setGender('')
    setType('')
  }

  return (
    <>
      {/* Hero Section */}
      <div className="relative py-16 px-6 text-center overflow-hidden">
        {/* Portal glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[500px] h-[500px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #39FF14 0%, transparent 70%)' }} />
        </div>
        <h1 className="relative text-6xl md:text-7xl font-bold mb-4"
          style={{ fontFamily: 'var(--font-creepster), cursive', color: '#39FF14', textShadow: '0 0 20px rgba(57,255,20,0.5), 0 0 60px rgba(57,255,20,0.2)' }}>
          RICK AND MORTY
        </h1>
        <p className="relative text-sm uppercase tracking-[0.2em] mb-10"
          style={{ fontFamily: 'var(--font-orbitron), sans-serif', color: '#00f5ff' }}>
          Explore the Multiverse — {initialCharacters.length} characters loaded
        </p>

        {/* Search Filters */}
        <div className="relative max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Name input */}
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Search by name..."
              className="w-full px-4 py-3 text-sm outline-none transition-all"
              style={{
                backgroundColor: 'rgba(0,245,255,0.06)',
                borderBottom: '2px solid #00f5ff',
                color: '#e8f4f8',
                fontFamily: 'var(--font-exo2), sans-serif',
              }}
            />
          </div>
          {/* Status select */}
          <select value={status} onChange={e => setStatus(e.target.value)}
            className="w-full px-4 py-3 text-sm outline-none cursor-pointer"
            style={{ backgroundColor: 'rgba(0,245,255,0.06)', borderBottom: '2px solid #00f5ff', color: '#e8f4f8', fontFamily: 'var(--font-exo2), sans-serif' }}>
            <option value="" style={{ backgroundColor: '#0d1b2a' }}>All Status</option>
            {STATUS_OPTIONS.filter(Boolean).map(s => (
              <option key={s} value={s} style={{ backgroundColor: '#0d1b2a' }}>{s}</option>
            ))}
          </select>
          {/* Gender select */}
          <select value={gender} onChange={e => setGender(e.target.value)}
            className="w-full px-4 py-3 text-sm outline-none cursor-pointer"
            style={{ backgroundColor: 'rgba(0,245,255,0.06)', borderBottom: '2px solid #00f5ff', color: '#e8f4f8', fontFamily: 'var(--font-exo2), sans-serif' }}>
            <option value="" style={{ backgroundColor: '#0d1b2a' }}>All Genders</option>
            {GENDER_OPTIONS.filter(Boolean).map(g => (
              <option key={g} value={g} style={{ backgroundColor: '#0d1b2a' }}>{g}</option>
            ))}
          </select>
          {/* Type input */}
          <div className="relative">
            <input
              type="text"
              value={type}
              onChange={e => setType(e.target.value)}
              placeholder="Filter by type..."
              className="w-full px-4 py-3 text-sm outline-none"
              style={{ backgroundColor: 'rgba(0,245,255,0.06)', borderBottom: '2px solid #00f5ff', color: '#e8f4f8', fontFamily: 'var(--font-exo2), sans-serif' }}
            />
          </div>
        </div>

        {/* Active filter indicator */}
        {isFiltering && (
          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="text-xs" style={{ color: '#8baab8' }}>
              {searching ? 'Searching...' : `${results.length} results`}
            </span>
            <button onClick={clearFilters}
              className="text-xs uppercase tracking-widest px-4 py-1.5 transition-all hover:scale-105"
              style={{ fontFamily: 'var(--font-orbitron), sans-serif', border: '1px solid #ff2d78', color: '#ff2d78' }}>
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Loading Spinner */}
      {searching && (
        <div className="flex justify-center py-16">
          <div className="w-16 h-16 rounded-full animate-spin"
            style={{ border: '3px solid transparent', borderTop: '3px solid #39FF14', borderRight: '3px solid #00f5ff', boxShadow: '0 0 20px rgba(57,255,20,0.3)' }} />
        </div>
      )}

      {/* No results */}
      {!searching && hasSearched && results.length === 0 && (
        <div className="text-center py-16 px-6">
          <p className="text-4xl mb-4">🌀</p>
          <p className="text-lg" style={{ color: '#ff2d78', fontFamily: 'var(--font-orbitron), sans-serif' }}>
            No characters found in this dimension
          </p>
          <p className="text-sm mt-2" style={{ color: '#8baab8' }}>Try different search parameters</p>
        </div>
      )}

      {/* Character Grid */}
      {!searching && results.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {results.map((character, idx) => (
              <Link
                key={character.id}
                href={`/rickandmorty/${character.id}`}
                className="group block transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="rounded overflow-hidden transition-all duration-300"
                  style={{
                    backgroundColor: 'rgba(6,6,16,0.9)',
                    border: '1px solid rgba(57,255,20,0.2)',
                    boxShadow: '0 0 15px rgba(57,255,20,0.05), inset 0 0 20px rgba(0,245,255,0.02)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(57,255,20,0.6)'
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(57,255,20,0.15), inset 0 0 30px rgba(0,245,255,0.05)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(57,255,20,0.2)'
                    e.currentTarget.style.boxShadow = '0 0 15px rgba(57,255,20,0.05), inset 0 0 20px rgba(0,245,255,0.02)'
                  }}
                >
                  {/* Character Image - Lazy Loading */}
                  <div className="relative overflow-hidden" style={{ aspectRatio: '1/1' }}>
                    <Image
                      src={character.image}
                      alt={character.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-all duration-500 group-hover:scale-105"
                      style={{ filter: 'saturate(0.85) brightness(0.9)' }}
                      priority={false} // Lazy Loading
                    />
                    {/* Green tint overlay */}
                    <div className="absolute inset-0 opacity-10 group-hover:opacity-0 transition-opacity"
                      style={{ background: 'linear-gradient(to bottom, transparent, rgba(57,255,20,0.15))' }} />
                    {/* Status badge on image */}
                    <div className="absolute top-3 right-3">
                      <StatusBadge status={character.status} />
                    </div>
                  </div>

                  {/* Character Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-base truncate mb-1"
                      style={{ fontFamily: 'var(--font-orbitron), sans-serif', color: '#e8f4f8' }}>
                      {character.name}
                    </h3>
                    <p className="text-xs mb-2" style={{ color: '#00f5ff' }}>
                      {character.species}{character.type ? ` — ${character.type}` : ''}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: '#8baab8' }}>
                        📍 {character.location.name.length > 20 ? character.location.name.slice(0, 20) + '...' : character.location.name}
                      </span>
                      <span className="text-xs" style={{ color: '#8baab8' }}>
                        🎬 {character.episode.length} eps
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Pulse animation keyframes */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </>
  )
}
