import { ReactNode } from "react";
import { Metadata } from "next";
import { Creepster, Orbitron, Exo_2 } from "next/font/google";
import Link from "next/link";

const creepster = Creepster({ weight: "400", subsets: ["latin"], variable: "--font-creepster" });
const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" });
const exo2 = Exo_2({ subsets: ["latin"], variable: "--font-exo2" });

export const metadata: Metadata = {
  title: "Rick and Morty — Interdimensional Explorer",
  description: "Explora el multiverso de Rick and Morty con SSG e ISR",
};

interface RickAndMortyLayoutProps {
  children: ReactNode;
}

export default function RickAndMortyLayout({ children }: RickAndMortyLayoutProps) {
  return (
    <div className={`${creepster.variable} ${orbitron.variable} ${exo2.variable} min-h-screen relative overflow-hidden`}
      style={{ backgroundColor: '#060610', fontFamily: '"Exo 2", system-ui, sans-serif' }}>
      
      {/* Starfield background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 120 }).map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white animate-pulse"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.1,
              animationDuration: `${Math.random() * 4 + 2}s`,
              animationDelay: `${Math.random() * 3}s`,
            }} />
        ))}
      </div>

      {/* Grid overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,245,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.04) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b"
        style={{
          backgroundColor: 'rgba(6,6,16,0.92)',
          backdropFilter: 'blur(16px)',
          borderColor: 'rgba(57,255,20,0.2)',
        }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/rickandmorty" className="flex items-center gap-3 group">
            {/* Portal icon */}
            <div className="w-10 h-10 rounded-full animate-spin flex-shrink-0"
              style={{
                background: 'conic-gradient(#39FF14, #00f5ff, #7b2fff, #39FF14)',
                animationDuration: '6s',
                boxShadow: '0 0 20px rgba(57,255,20,0.4)',
              }}>
              <div className="w-full h-full rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#060610', margin: '2px', width: 'calc(100% - 4px)', height: 'calc(100% - 4px)' }}>
                <span className="text-sm" style={{ color: '#39FF14' }}>🌀</span>
              </div>
            </div>
            <span className="text-2xl font-bold tracking-wide"
              style={{ fontFamily: 'var(--font-creepster), cursive', color: '#39FF14', textShadow: '0 0 10px rgba(57,255,20,0.5), 0 0 30px rgba(57,255,20,0.2)' }}>
              RICK & MORTY
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/rickandmorty" className="text-xs uppercase tracking-widest transition-colors hover:text-[#39FF14]"
              style={{ fontFamily: 'var(--font-orbitron), sans-serif', color: '#8baab8' }}>
              Characters
            </Link>
            <Link href="/pokemon" className="text-xs uppercase tracking-widest transition-colors hover:text-[#39FF14]"
              style={{ fontFamily: 'var(--font-orbitron), sans-serif', color: '#8baab8' }}>
              Pokédex
            </Link>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t py-6 text-center"
        style={{ borderColor: 'rgba(57,255,20,0.1)' }}>
        <p className="text-xs" style={{ color: '#8baab8', fontFamily: 'var(--font-orbitron), sans-serif' }}>
          WUBBA LUBBA DUB DUB! — Powered by Rick and Morty API
        </p>
      </footer>
    </div>
  );
}
