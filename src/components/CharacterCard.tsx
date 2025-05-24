import { Character } from '@/types/rick-and-morty';
import Image from 'next/image';

interface CharacterCardProps {
  character: Character;
  isSelected: boolean;
  onClick: () => void;
  title: string;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  isSelected,
  onClick,
  title
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Alive':
        return 'bg-green-500';
      case 'Dead':
        return 'bg-red-500';
      case 'unknown':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div
      className={`relative cursor-pointer transition-all duration-200 border border-gray-300 bg-white w-full h-32 ${
        isSelected
          ? 'ring-2 ring-blue-500 shadow-lg'
          : 'hover:shadow-md'
      }`}
      onClick={onClick}
    >
      <div className="flex h-full">
        <div className="w-2/5 h-full flex-shrink-0 relative">
          <Image
            src={character.image}
            alt={character.name}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="w-3/5 p-4 flex flex-col justify-center min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate mb-2">
            {character.name}
          </h3>
          <div className="flex items-center text-sm text-gray-600">
            <div className={`w-3 h-3 rounded-full mr-3 flex-shrink-0 ${getStatusColor(character.status)}`}></div>
            <span className="truncate">{character.status} - {character.species}</span>
          </div>
        </div>
      </div>
      
      {isSelected && (
        <div className="absolute -top-2 -left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
          {title}
        </div>
      )}
    </div>
  );
}; 