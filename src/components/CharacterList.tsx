'use client';

import { useState, useEffect, useMemo } from 'react';
import { Character, ApiResponse } from '@/types/rick-and-morty';
import { getCharacters } from '@/services/api';
import { CharacterCard } from './CharacterCard';
import { LoadingSpinner } from './LoadingSpinner';

interface CharacterListProps {
  title: string;
  selectedCharacter: Character | null;
  onCharacterSelect: (character: Character) => void;
}

export const CharacterList: React.FC<CharacterListProps> = ({
  title,
  selectedCharacter,
  onCharacterSelect,
}) => {
  const [allCharacters, setAllCharacters] = useState<Character[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const charactersPerPage = 6;

  const filteredCharacters = useMemo(() => {
    if (!searchTerm.trim()) {
      return allCharacters;
    }
    return allCharacters.filter(character => 
      character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      character.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
      character.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allCharacters, searchTerm]);

  const totalPages = Math.ceil(filteredCharacters.length / charactersPerPage);
  
  const startIndex = (currentPage - 1) * charactersPerPage;
  const endIndex = startIndex + charactersPerPage;
  const currentCharacters = filteredCharacters.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    fetchAllCharacters();
  }, []);

  const fetchAllCharacters = async () => {
    setLoading(true);
    setError(null);
    try {
      const firstResponse: ApiResponse<Character> = await getCharacters(1);
      const totalApiPages = firstResponse.info.pages;
      
      let allCharactersList: Character[] = [...firstResponse.results];

      for (let page = 2; page <= totalApiPages; page++) {
        const response: ApiResponse<Character> = await getCharacters(page);
        allCharactersList = [...allCharactersList, ...response.results];
      }

      setAllCharacters(allCharactersList);
    } catch (err) {
      setError('Failed to fetch characters');
      console.error('Error fetching characters:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 mx-1 rounded ${
            currentPage === i
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex justify-center items-center mt-6 space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        {pages}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">{title}</h2>
        <LoadingSpinner size="lg" message="Loading characters..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">{title}</h2>
        <div className="text-center text-red-500 p-4 bg-red-50 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">{title}</h2>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search characters by name, species, or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto">
        {currentCharacters.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            isSelected={selectedCharacter?.id === character.id}
            onClick={() => onCharacterSelect(character)}
            title={title}
          />
        ))}
      </div>

      {filteredCharacters.length === 0 && searchTerm.trim() && (
        <div className="text-center text-gray-500 py-8">
          <div className="text-4xl mb-2">🔍</div>
          <p>No characters found matching &quot;{searchTerm}&quot;</p>
        </div>
      )}

      <div className="text-center mt-4 text-sm text-gray-600">
        Showing {startIndex + 1} to {Math.min(endIndex, filteredCharacters.length)} of {filteredCharacters.length} characters
        {searchTerm.trim() && (
          <span className="ml-2 text-blue-600">(filtered from {allCharacters.length} total)</span>
        )}
      </div>

      {renderPagination()}
    </div>
  );
}; 