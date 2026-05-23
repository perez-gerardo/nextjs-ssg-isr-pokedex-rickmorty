import Link from 'next/link';
import { Metadata } from 'next';
import { Character, CharacterListResponse } from '@/types/rickandmorty';
import Image from 'next/image';

interface CharacterPageProps {
  params: Promise<{
    id: string;
  }>;
}

// ISR: Revalidación cada 10 días (864000 segundos)
async function getCharacter(id: string): Promise<Character> {
  // Intentar hasta 3 veces en caso de fallo de red
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`, {
        next: { revalidate: 864000 }, // 10 días
      });

      if (res.ok) {
        return res.json();
      }
      
      // Si es un 404 real, no reintentar
      if (res.status === 404) throw new Error('Personaje no encontrado');
      
    } catch (err) {
      if (attempt === 2) throw err instanceof Error ? err : new Error('Error al cargar personaje');
      // Esperar antes de reintentar
      await new Promise(r => setTimeout(r, 500));
    }
  }
  throw new Error('Personaje no encontrado');
}

// SSG: Genera los parámetros estáticos para todos los personajes válidos
export async function generateStaticParams() {
  const allIds: { id: string }[] = [];

  try {
    const firstRes = await fetch('https://rickandmortyapi.com/api/character');
    if (!firstRes.ok) return [];
    const firstData: CharacterListResponse = await firstRes.json();

    firstData.results.forEach(c => allIds.push({ id: c.id.toString() }));

    // Obtener el resto de páginas en paralelo (máximo 42 páginas ~826 personajes)
    const pagePromises = [];
    for (let i = 2; i <= firstData.info.pages; i++) {
      pagePromises.push(fetch(`https://rickandmortyapi.com/api/character?page=${i}`));
    }

    const responses = await Promise.allSettled(pagePromises);
    for (const result of responses) {
      if (result.status === 'fulfilled' && result.value.ok) {
        const data: CharacterListResponse = await result.value.json();
        data.results.forEach(c => allIds.push({ id: c.id.toString() }));
      }
    }
  } catch {
    // Si falla, devolver un conjunto mínimo para no romper el build
    return Array.from({ length: 20 }, (_, i) => ({ id: String(i + 1) }));
  }

  return allIds;
}

// Metadata dinámica para SEO
export async function generateMetadata({ params }: CharacterPageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const character = await getCharacter(id);

    return {
      title: `${character.name} — Rick and Morty`,
      description: `${character.name} is a ${character.species} from ${character.origin.name}. Status: ${character.status}.`,
    };
  } catch {
    return {
      title: 'Character — Rick and Morty',
      description: 'Character detail page',
    };
  }
}

const statusStyles: Record<string, { color: string; glow: string }> = {
  Alive: { color: '#39FF14', glow: '0 0 10px rgba(57,255,20,0.5)' },
  Dead: { color: '#ff2d78', glow: '0 0 10px rgba(255,45,120,0.5)' },
  unknown: { color: '#8baab8', glow: 'none' },
};

export default async function CharacterDetail({ params }: CharacterPageProps) {
  const { id } = await params;
  const character = await getCharacter(id);

  const st = statusStyles[character.status] || statusStyles.unknown;
  const episodeCount = character.episode.length;
  const episodeIds = character.episode.map(ep => ep.split('/').pop()).slice(0, 10);

  return (
    <div className="min-h-[80vh] px-6 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Link href="/rickandmorty"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest mb-8 px-5 py-2.5 transition-all hover:scale-105"
          style={{
            fontFamily: 'var(--font-orbitron), sans-serif',
            border: '2px solid #39FF14',
            color: '#39FF14',
          }}>
          ← Back to Characters
        </Link>

        {/* Main card */}
        <div className="rounded overflow-hidden"
          style={{
            backgroundColor: 'rgba(6,6,16,0.95)',
            border: '1px solid rgba(57,255,20,0.3)',
            boxShadow: '0 0 40px rgba(57,255,20,0.1)',
          }}>
          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            <div className="relative md:w-96 flex-shrink-0">
              <div className="relative aspect-square">
                <Image
                  src={character.image}
                  alt={character.name}
                  fill
                  className="object-cover"
                  priority
                />
                {/* Neon frame glow */}
                <div className="absolute inset-0 pointer-events-none"
                  style={{ boxShadow: 'inset 0 0 30px rgba(57,255,20,0.15), inset 0 0 60px rgba(0,245,255,0.1)' }} />
              </div>
              {/* Status bar */}
              <div className="absolute bottom-0 left-0 right-0 px-4 py-3 flex items-center gap-2"
                style={{ backgroundColor: 'rgba(6,6,16,0.85)', backdropFilter: 'blur(8px)' }}>
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: st.color, boxShadow: st.glow }} />
                <span className="text-sm font-semibold" style={{ color: st.color }}>{character.status}</span>
                <span className="text-sm" style={{ color: '#8baab8' }}>— {character.species}</span>
              </div>
            </div>

            {/* Info Section */}
            <div className="flex-1 p-8">
              {/* Name */}
              <h1 className="text-3xl md:text-4xl font-bold mb-2"
                style={{ fontFamily: 'var(--font-orbitron), sans-serif', color: '#e8f4f8' }}>
                {character.name}
              </h1>
              <p className="text-sm mb-8" style={{ color: '#00f5ff', fontFamily: 'var(--font-orbitron), sans-serif' }}>
                ID #{character.id} · {character.gender}
              </p>

              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {[
                  { label: 'Species', value: character.species, icon: '🧬' },
                  { label: 'Type', value: character.type || 'N/A', icon: '🔬' },
                  { label: 'Gender', value: character.gender, icon: '⚧' },
                  { label: 'Status', value: character.status, icon: '💀' },
                  { label: 'Origin', value: character.origin.name, icon: '🌍' },
                  { label: 'Location', value: character.location.name, icon: '📍' },
                ].map(info => (
                  <div key={info.label} className="p-3 rounded"
                    style={{ backgroundColor: 'rgba(0,245,255,0.04)', border: '1px solid rgba(0,245,255,0.1)' }}>
                    <p className="text-[10px] uppercase tracking-widest mb-1"
                      style={{ color: '#8baab8', fontFamily: 'var(--font-orbitron), sans-serif' }}>
                      {info.icon} {info.label}
                    </p>
                    <p className="text-sm font-semibold truncate" style={{ color: '#e8f4f8' }}>
                      {info.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Episodes */}
              <div>
                <h3 className="text-xs uppercase tracking-widest mb-3"
                  style={{ fontFamily: 'var(--font-orbitron), sans-serif', color: '#00f5ff' }}>
                  🎬 Featured in {episodeCount} episode{episodeCount !== 1 ? 's' : ''}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {episodeIds.map(epId => (
                    <span key={epId} className="px-3 py-1 text-xs rounded-full"
                      style={{
                        border: '1px solid rgba(123,47,255,0.4)',
                        color: '#7b2fff',
                        fontFamily: 'var(--font-orbitron), sans-serif',
                      }}>
                      EP {epId}
                    </span>
                  ))}
                  {episodeCount > 10 && (
                    <span className="px-3 py-1 text-xs" style={{ color: '#8baab8' }}>
                      +{episodeCount - 10} more
                    </span>
                  )}
                </div>
              </div>

              {/* Created date */}
              <p className="mt-8 text-[10px] uppercase tracking-widest"
                style={{ color: '#8baab8', fontFamily: 'var(--font-orbitron), sans-serif' }}>
                Created: {new Date(character.created).toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
