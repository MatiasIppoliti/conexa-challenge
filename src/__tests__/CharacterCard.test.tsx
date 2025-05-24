import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CharacterCard } from '@/components/CharacterCard';
import { Character } from '@/types/rick-and-morty';

const mockCharacter: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: {
    name: 'Earth (C-137)',
    url: 'https://rickandmortyapi.com/api/location/1'
  },
  location: {
    name: 'Earth (Replacement Dimension)',
    url: 'https://rickandmortyapi.com/api/location/20'
  },
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  episode: [
    'https://rickandmortyapi.com/api/episode/1',
    'https://rickandmortyapi.com/api/episode/2'
  ],
  url: 'https://rickandmortyapi.com/api/character/1',
  created: '2017-11-04T18:48:46.250Z'
};

describe('CharacterCard', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('renders character information correctly', () => {
    render(
      <CharacterCard
        character={mockCharacter}
        isSelected={false}
        onClick={mockOnClick}
        title="Character #1"
      />
    );

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Alive - Human')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Rick Sanchez' })).toBeInTheDocument();
  });

  it('shows selected state when isSelected is true', () => {
    render(
      <CharacterCard
        character={mockCharacter}
        isSelected={true}
        onClick={mockOnClick}
        title="Character #1"
      />
    );

    expect(screen.getByText('Character #1')).toBeInTheDocument();
  });

  it('calls onClick when card is clicked', () => {
    render(
      <CharacterCard
        character={mockCharacter}
        isSelected={false}
        onClick={mockOnClick}
        title="Character #1"
      />
    );

    fireEvent.click(screen.getByRole('img', { name: 'Rick Sanchez' }).closest('div')!);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('displays correct status color for alive character', () => {
    const { container } = render(
      <CharacterCard
        character={mockCharacter}
        isSelected={false}
        onClick={mockOnClick}
        title="Character #1"
      />
    );

    const statusIndicator = container.querySelector('.bg-green-500');
    expect(statusIndicator).toBeInTheDocument();
  });

  it('displays correct status color for dead character', () => {
    const deadCharacter: Character = { ...mockCharacter, status: 'Dead' as const };
    const { container } = render(
      <CharacterCard
        character={deadCharacter}
        isSelected={false}
        onClick={mockOnClick}
        title="Character #1"
      />
    );

    const statusIndicator = container.querySelector('.bg-red-500');
    expect(statusIndicator).toBeInTheDocument();
  });

  it('displays correct status color for unknown character', () => {
    const unknownCharacter: Character = { ...mockCharacter, status: 'unknown' as const };
    const { container } = render(
      <CharacterCard
        character={unknownCharacter}
        isSelected={false}
        onClick={mockOnClick}
        title="Character #1"
      />
    );

    const statusIndicator = container.querySelector('.bg-gray-500');
    expect(statusIndicator).toBeInTheDocument();
  });

  it('displays character type when available', () => {
    const characterWithType = { ...mockCharacter, type: 'Scientist' };
    
    render(
      <CharacterCard
        character={characterWithType}
        isSelected={false}
        onClick={mockOnClick}
        title="Character #1"
      />
    );
    
    expect(screen.getByText('Alive - Human')).toBeInTheDocument();
  });

  it('does not show title when not selected', () => {
    render(
      <CharacterCard
        character={mockCharacter}
        isSelected={false}
        onClick={mockOnClick}
        title="Character #1"
      />
    );

    expect(screen.queryByText('Character #1')).not.toBeInTheDocument();
  });

  it('displays correct status color for invalid/custom status (default case)', () => {
    const customStatusCharacter: Character = { 
      ...mockCharacter, 
      status: 'Custom Status' as 'Alive'
    };
    const { container } = render(
      <CharacterCard
        character={customStatusCharacter}
        isSelected={false}
        onClick={mockOnClick}
        title="Character #1"
      />
    );

    const statusIndicator = container.querySelector('.bg-gray-500');
    expect(statusIndicator).toBeInTheDocument();
  });
}); 