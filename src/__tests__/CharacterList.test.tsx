import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CharacterList } from '@/components/CharacterList';
import { getCharacters } from '@/services/api';
import { Character, ApiResponse } from '@/types/rick-and-morty';

jest.mock('@/services/api');
const mockGetCharacters = getCharacters as jest.MockedFunction<typeof getCharacters>;

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, fill, ...props }: { src: string; alt: string; fill?: boolean; [key: string]: unknown }) => {
    const validImgProps = Object.fromEntries(
      Object.entries(props).filter(([key]) => 
        !['sizes', 'priority', 'placeholder', 'blurDataURL', 'quality', 'loader', 'unoptimized', 'onLoad', 'onError'].includes(key)
      )
    );
    
    return (
      <img 
        src={src} 
        alt={alt} 
        {...validImgProps}
        style={{ 
          ...(typeof props.style === 'object' ? props.style : {}),
          ...(fill ? { width: '100%', height: '100%', objectFit: 'cover' } : {})
        }}
      />
    );
  },
}));

const mockCharacters: Character[] = [
  {
    id: 1,
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Male',
    origin: { name: 'Earth (C-137)', url: 'https://rickandmortyapi.com/api/location/1' },
    location: { name: 'Earth', url: 'https://rickandmortyapi.com/api/location/20' },
    image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
    episode: ['https://rickandmortyapi.com/api/episode/1'],
    url: 'https://rickandmortyapi.com/api/character/1',
    created: '2017-11-04T18:48:46.250Z'
  },
  {
    id: 2,
    name: 'Morty Smith',
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Male',
    origin: { name: 'Earth (C-137)', url: 'https://rickandmortyapi.com/api/location/1' },
    location: { name: 'Earth', url: 'https://rickandmortyapi.com/api/location/20' },
    image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
    episode: ['https://rickandmortyapi.com/api/episode/1'],
    url: 'https://rickandmortyapi.com/api/character/2',
    created: '2017-11-04T18:48:46.250Z'
  },
  {
    id: 3,
    name: 'Summer Smith',
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Female',
    origin: { name: 'Earth (C-137)', url: 'https://rickandmortyapi.com/api/location/1' },
    location: { name: 'Earth', url: 'https://rickandmortyapi.com/api/location/20' },
    image: 'https://rickandmortyapi.com/api/character/avatar/3.jpeg',
    episode: ['https://rickandmortyapi.com/api/episode/1'],
    url: 'https://rickandmortyapi.com/api/character/3',
    created: '2017-11-04T18:48:46.250Z'
  }
];

const mockApiResponse: ApiResponse<Character> = {
  info: {
    count: 3,
    pages: 1,
    next: null,
    prev: null
  },
  results: mockCharacters
};

describe('CharacterList', () => {
  const mockOnCharacterSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('displays loading state initially', () => {
    mockGetCharacters.mockReturnValue(new Promise(() => {}));

    render(
      <CharacterList
        title="Test Characters"
        selectedCharacter={null}
        onCharacterSelect={mockOnCharacterSelect}
      />
    );

    expect(screen.getByText('Test Characters')).toBeInTheDocument();
    expect(screen.getByText('Loading characters...')).toBeInTheDocument();
  });

  it('displays characters after successful fetch', async () => {
    mockGetCharacters.mockResolvedValue(mockApiResponse);

    render(
      <CharacterList
        title="Test Characters"
        selectedCharacter={null}
        onCharacterSelect={mockOnCharacterSelect}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
      expect(screen.getByText('Morty Smith')).toBeInTheDocument();
      expect(screen.getByText('Summer Smith')).toBeInTheDocument();
    });
  });

  it('displays error state when fetch fails', async () => {
    mockGetCharacters.mockRejectedValue(new Error('API Error'));

    render(
      <CharacterList
        title="Test Characters"
        selectedCharacter={null}
        onCharacterSelect={mockOnCharacterSelect}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch characters')).toBeInTheDocument();
    });
  });

  it('handles character selection', async () => {
    mockGetCharacters.mockResolvedValue(mockApiResponse);

    render(
      <CharacterList
        title="Test Characters"
        selectedCharacter={null}
        onCharacterSelect={mockOnCharacterSelect}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    });

    const rickCard = screen.getByText('Rick Sanchez').closest('div');
    fireEvent.click(rickCard!);

    expect(mockOnCharacterSelect).toHaveBeenCalledWith(mockCharacters[0]);
  });

  it('highlights selected character', async () => {
    mockGetCharacters.mockResolvedValue(mockApiResponse);

    const { rerender } = render(
      <CharacterList
        title="Test Characters"
        selectedCharacter={null}
        onCharacterSelect={mockOnCharacterSelect}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    });

    rerender(
      <CharacterList
        title="Test Characters"
        selectedCharacter={mockCharacters[0]}
        onCharacterSelect={mockOnCharacterSelect}
      />
    );

    expect(screen.getByText('Test Characters', { selector: '.absolute' })).toBeInTheDocument();
  });

  it('filters characters by search term', async () => {
    mockGetCharacters.mockResolvedValue(mockApiResponse);

    render(
      <CharacterList
        title="Test Characters"
        selectedCharacter={null}
        onCharacterSelect={mockOnCharacterSelect}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search characters by name, species, or status...');
    fireEvent.change(searchInput, { target: { value: 'Rick' } });

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.queryByText('Morty Smith')).not.toBeInTheDocument();
    expect(screen.queryByText('Summer Smith')).not.toBeInTheDocument();
  });

  it('shows no results message when search has no matches', async () => {
    mockGetCharacters.mockResolvedValue(mockApiResponse);

    render(
      <CharacterList
        title="Test Characters"
        selectedCharacter={null}
        onCharacterSelect={mockOnCharacterSelect}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search characters by name, species, or status...');
    fireEvent.change(searchInput, { target: { value: 'NonexistentCharacter' } });

    expect(screen.getByText('No characters found matching "NonexistentCharacter"')).toBeInTheDocument();
  });

  it('filters by species', async () => {
    const charactersWithDifferentSpecies = [
      ...mockCharacters,
      {
        ...mockCharacters[0],
        id: 4,
        name: 'Alien Character',
        species: 'Alien'
      }
    ];

    mockGetCharacters.mockResolvedValue({
      ...mockApiResponse,
      results: charactersWithDifferentSpecies
    });

    render(
      <CharacterList
        title="Test Characters"
        selectedCharacter={null}
        onCharacterSelect={mockOnCharacterSelect}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Alien Character')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search characters by name, species, or status...');
    fireEvent.change(searchInput, { target: { value: 'Alien' } });

    expect(screen.getByText('Alien Character')).toBeInTheDocument();
    expect(screen.queryByText('Rick Sanchez')).not.toBeInTheDocument();
  });

  it('filters by status', async () => {
    const charactersWithDifferentStatus = [
      ...mockCharacters,
      {
        ...mockCharacters[0],
        id: 4,
        name: 'Dead Character',
        status: 'Dead' as const
      }
    ];

    mockGetCharacters.mockResolvedValue({
      ...mockApiResponse,
      results: charactersWithDifferentStatus
    });

    render(
      <CharacterList
        title="Test Characters"
        selectedCharacter={null}
        onCharacterSelect={mockOnCharacterSelect}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Dead Character')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search characters by name, species, or status...');
    fireEvent.change(searchInput, { target: { value: 'Dead' } });

    expect(screen.getByText('Dead Character')).toBeInTheDocument();
    expect(screen.queryByText('Rick Sanchez')).not.toBeInTheDocument();
  });

  it('resets to first page when search changes', async () => {
    const manyCharacters = Array.from({ length: 15 }, (_, i) => ({
      ...mockCharacters[0],
      id: i + 1,
      name: `Character ${i + 1}`
    }));

    mockGetCharacters.mockResolvedValue({
      ...mockApiResponse,
      results: manyCharacters
    });

    render(
      <CharacterList
        title="Test Characters"
        selectedCharacter={null}
        onCharacterSelect={mockOnCharacterSelect}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Character 1')).toBeInTheDocument();
    });

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    const searchInput = screen.getByPlaceholderText('Search characters by name, species, or status...');
    fireEvent.change(searchInput, { target: { value: 'Character 1' } });

    expect(screen.getByText('Character 1')).toBeInTheDocument();
  });

  it('handles pagination correctly', async () => {
    const manyCharacters = Array.from({ length: 10 }, (_, i) => ({
      ...mockCharacters[0],
      id: i + 1,
      name: `Character ${i + 1}`
    }));

    mockGetCharacters.mockResolvedValue({
      ...mockApiResponse,
      results: manyCharacters
    });

    render(
      <CharacterList
        title="Test Characters"
        selectedCharacter={null}
        onCharacterSelect={mockOnCharacterSelect}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Character 1')).toBeInTheDocument();
    });

    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('Previous')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Next'));

    expect(screen.getByText('Character 7')).toBeInTheDocument();
    expect(screen.queryByText('Character 1')).not.toBeInTheDocument();
  });

  it('disables pagination buttons appropriately', async () => {
    const manyCharacters = Array.from({ length: 10 }, (_, i) => ({
      ...mockCharacters[0],
      id: i + 1,
      name: `Character ${i + 1}`
    }));

    mockGetCharacters.mockResolvedValue({
      ...mockApiResponse,
      results: manyCharacters
    });

    render(
      <CharacterList
        title="Test Characters"
        selectedCharacter={null}
        onCharacterSelect={mockOnCharacterSelect}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Character 1')).toBeInTheDocument();
    });

    const previousButton = screen.getByText('Previous');
    expect(previousButton).toBeDisabled();

    fireEvent.click(screen.getByText('Next'));

    const nextButton = screen.getByText('Next');
    expect(nextButton).toBeDisabled();
  });

  it('displays character count information', async () => {
    mockGetCharacters.mockResolvedValue(mockApiResponse);

    render(
      <CharacterList
        title="Test Characters"
        selectedCharacter={null}
        onCharacterSelect={mockOnCharacterSelect}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Showing 1 to 3 of 3 characters')).toBeInTheDocument();
    });
  });

  it('shows filtered count when searching', async () => {
    mockGetCharacters.mockResolvedValue(mockApiResponse);

    render(
      <CharacterList
        title="Test Characters"
        selectedCharacter={null}
        onCharacterSelect={mockOnCharacterSelect}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search characters by name, species, or status...');
    fireEvent.change(searchInput, { target: { value: 'Rick' } });

    expect(screen.getByText(/Showing 1 to 1 of 1 characters/)).toBeInTheDocument();
    expect(screen.getByText(/\(filtered from 3 total\)/)).toBeInTheDocument();
  });

  it('does not show pagination when all characters fit on one page', async () => {
    mockGetCharacters.mockResolvedValue(mockApiResponse);

    render(
      <CharacterList
        title="Test Characters"
        selectedCharacter={null}
        onCharacterSelect={mockOnCharacterSelect}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    });

    expect(screen.queryByText('Next')).not.toBeInTheDocument();
    expect(screen.queryByText('Previous')).not.toBeInTheDocument();
  });

  it('fetches multiple pages from API', async () => {
    const firstPageResponse: ApiResponse<Character> = {
      info: { count: 4, pages: 2, next: 'page2', prev: null },
      results: [mockCharacters[0], mockCharacters[1]]
    };

    const secondPageResponse: ApiResponse<Character> = {
      info: { count: 4, pages: 2, next: null, prev: 'page1' },
      results: [mockCharacters[2], { ...mockCharacters[0], id: 4, name: 'Character 4' }]
    };

    mockGetCharacters
      .mockResolvedValueOnce(firstPageResponse)
      .mockResolvedValueOnce(secondPageResponse);

    render(
      <CharacterList
        title="Test Characters"
        selectedCharacter={null}
        onCharacterSelect={mockOnCharacterSelect}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
      expect(screen.getByText('Character 4')).toBeInTheDocument();
    });

    expect(mockGetCharacters).toHaveBeenCalledTimes(2);
    expect(mockGetCharacters).toHaveBeenNthCalledWith(1, 1);
    expect(mockGetCharacters).toHaveBeenNthCalledWith(2, 2);
  });
}); 