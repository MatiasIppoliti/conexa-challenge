'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Character } from '@/types/rick-and-morty';
import { CharacterList } from '@/components/CharacterList';
import { EpisodeList } from '@/components/EpisodeList';
import { useEpisodeComparison } from '@/hooks/useEpisodeComparison';

export default function Home() {
  const [character1, setCharacter1] = useState<Character | null>(null);
  const [character2, setCharacter2] = useState<Character | null>(null);
  const episodeAnalysisRef = useRef<HTMLDivElement>(null);

  const { episodeComparison, loading: episodeLoading } = useEpisodeComparison(
    character1,
    character2
  );

  useEffect(() => {
    if (character1 && character2 && episodeAnalysisRef.current) {
      episodeAnalysisRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [character1, character2]);

  const resetSelection = () => {
    setCharacter1(null);
    setCharacter2(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="relative bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/10">
          <div className="absolute inset-0 bg-[url('/patterns/dots.svg')]"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-green-300">
                  Rick & Morty
                </span>
                <br />
                <span className="text-3xl lg:text-4xl font-bold text-white/90">
                  Character Comparison
                </span>
              </h1>
            </div>
            
            <div className="flex flex-col items-center">
              <button
                onClick={resetSelection}
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl shadow-lg hover:from-red-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 hover:shadow-2xl border-2 border-white/20"
                disabled={!character1 && !character2}
              >
                <svg className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,6V9L16,5L12,1V4A8,8 0 0,0 4,12C4,13.57 4.46,15.03 5.24,16.26L6.7,14.8C6.25,13.97 6,13 6,12A6,6 0 0,1 12,6M18.76,7.74L17.3,9.2C17.74,10.04 18,11 18,12A6,6 0 0,1 12,18V15L8,19L12,23V20A8,8 0 0,0 20,12C20,10.43 19.54,8.97 18.76,7.74Z"/>
                </svg>
                Reset Selections
                <span className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <CharacterList
            title="Character #1"
            selectedCharacter={character1}
            onCharacterSelect={setCharacter1}
          />
          
          <CharacterList
            title="Character #2"
            selectedCharacter={character2}
            onCharacterSelect={setCharacter2}
          />
        </div>

        {(character1 || character2) && (
          <div className="mb-8" ref={episodeAnalysisRef}>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
                Characters Selected
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {character1 && (
                  <div className="text-center">
                    <Image
                      src={character1.image}
                      alt={character1.name}
                      width={96}
                      height={96}
                      className="w-24 h-24 rounded-full mx-auto mb-2 object-cover border-4 border-blue-500"
                    />
                    <h3 className="text-lg font-semibold text-gray-800">
                      {character1.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {character1.species} • {character1.status}
                    </p>
                  </div>
                )}
                
                {character2 && (
                  <div className="text-center">
                    <Image
                      src={character2.image}
                      alt={character2.name}
                      width={96}
                      height={96}
                      className="w-24 h-24 rounded-full mx-auto mb-2 object-cover border-4 border-green-500"
                    />
                    <h3 className="text-lg font-semibold text-gray-800">
                      {character2.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {character2.species} • {character2.status}
                    </p>
                  </div>
                )}
              </div>
              
              {!character1 || !character2 ? (
                <div className="text-center text-gray-500 py-8">
                  <div className="text-6xl mb-4">⚠️</div>
                  <p className="text-lg">
                    Please select both characters to see episode comparison
                  </p>
                </div>
              ) : null}
            </div>

            {character1 && character2 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <EpisodeList
                  title={`${character1.name} - Only Episodes`}
                  episodes={episodeComparison.characterOnlyEpisodes}
                  loading={episodeLoading}
                  emptyMessage={`No exclusive episodes for ${character1.name}`}
                />
                
                <EpisodeList
                  title="Shared Episodes"
                  episodes={episodeComparison.sharedEpisodes}
                  loading={episodeLoading}
                  emptyMessage="No shared episodes found"
                />
                
                <EpisodeList
                  title={`${character2.name} - Only Episodes`}
                  episodes={episodeComparison.characterTwoOnlyEpisodes}
                  loading={episodeLoading}
                  emptyMessage={`No exclusive episodes for ${character2.name}`}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
