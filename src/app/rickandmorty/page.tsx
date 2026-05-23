import { Character, CharacterListResponse } from "@/types/rickandmorty";
import SearchClient from "./SearchClient";

// SSG: Forzar el caché en la petición
async function getAllCharacters(): Promise<Character[]> {
  const allCharacters: Character[] = [];
  
  // Obtener primera página para conocer el total de páginas
  const firstRes = await fetch("https://rickandmortyapi.com/api/character", {
    cache: "force-cache", // SSG: fuerza el caché estático
  });
  
  if (!firstRes.ok) throw new Error("Error al cargar personajes");
  const firstData: CharacterListResponse = await firstRes.json();
  allCharacters.push(...firstData.results);
  
  // Obtener páginas 2 a 5 para tener ~100 personajes iniciales
  const pagesToFetch = Math.min(firstData.info.pages, 5);
  for (let i = 2; i <= pagesToFetch; i++) {
    const res = await fetch(`https://rickandmortyapi.com/api/character?page=${i}`, {
      cache: "force-cache",
    });
    if (res.ok) {
      const data: CharacterListResponse = await res.json();
      allCharacters.push(...data.results);
    }
  }
  
  return allCharacters;
}

export default async function RickAndMortyPage() {
  const characters = await getAllCharacters();

  return <SearchClient initialCharacters={characters} />;
}
