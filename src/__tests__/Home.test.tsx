import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '@/app/page';
import { getCharacters } from '@/services/api';
import { useEpisodeComparison } from '@/hooks/useEpisodeComparison';

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

jest.mock('@/hooks/useEpisodeComparison');
const mockUseEpisodeComparison = useEpisodeComparison as jest.MockedFunction<typeof useEpisodeComparison>;

const mockCharacter1 = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive' as const,
  species: 'Human',
  type: '',
  gender: 'Male' as const,
  origin: { name: 'Earth (C-137)', url: 'https://rickandmortyapi.com/api/location/1' },
  location: { name: 'Earth', url: 'https://rickandmortyapi.com/api/location/20' },
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  episode: ['https://rickandmortyapi.com/api/episode/1'],
  url: 'https://rickandmortyapi.com/api/character/1',
  created: '2017-11-04T18:48:46.250Z'
};

const mockCharacter2 = {
  id: 2,
  name: 'Morty Smith',
  status: 'Alive' as const,
  species: 'Human',
  type: '',
  gender: 'Male' as const,
  origin: { name: 'Earth (C-137)', url: 'https://rickandmortyapi.com/api/location/1' },
  location: { name: 'Earth', url: 'https://rickandmortyapi.com/api/location/20' },
  image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
  episode: ['https://rickandmortyapi.com/api/episode/1'],
  url: 'https://rickandmortyapi.com/api/character/2',
  created: '2017-11-04T18:48:46.250Z'
};

describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockGetCharacters.mockResolvedValue({
      info: { count: 2, pages: 1, next: null, prev: null },
      results: [mockCharacter1, mockCharacter2]
    });

    mockUseEpisodeComparison.mockReturnValue({
      episodeComparison: {
        characterOnlyEpisodes: [],
        sharedEpisodes: [],
        characterTwoOnlyEpisodes: []
      },
      loading: false,
      error: null
    });

    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  it('renders the main title correctly', () => {
    render(<Home />);
    
    expect(screen.getByText('Rick & Morty')).toBeInTheDocument();
    expect(screen.getByText('Character Comparison')).toBeInTheDocument();
  });

  it('renders two character selection lists', () => {
    render(<Home />);
    
    expect(screen.getByText('Character #1')).toBeInTheDocument();
    expect(screen.getByText('Character #2')).toBeInTheDocument();
  });

  it('initially shows reset button as disabled when no characters are selected', () => {
    render(<Home />);
    
    const resetButton = screen.getByText('Reset Selections');
    expect(resetButton).toBeDisabled();
  });

  it('calls useEpisodeComparison hook with correct parameters initially', () => {
    render(<Home />);
    
    expect(mockUseEpisodeComparison).toHaveBeenCalledWith(null, null);
  });

  it('contains reset button with proper styling', () => {
    render(<Home />);
    
    const resetButton = screen.getByText('Reset Selections');
    expect(resetButton).toHaveClass('group', 'relative', 'inline-flex', 'items-center', 'justify-center');
  });

  it('includes SVG icon in reset button', () => {
    render(<Home />);
    
    const resetButton = screen.getByText('Reset Selections');
    const svg = resetButton.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('w-5', 'h-5', 'mr-2');
  });

  it('has proper styling classes for the main layout', () => {
    const { container } = render(<Home />);
    
    const mainElement = container.querySelector('main');
    expect(mainElement).toHaveClass('min-h-screen', 'bg-gradient-to-br', 'from-blue-50', 'to-indigo-100');
  });

  it('displays the header with gradient background', () => {
    const { container } = render(<Home />);
    
    const headerSection = container.querySelector('.bg-gradient-to-r.from-green-400.via-blue-500.to-purple-600');
    expect(headerSection).toBeInTheDocument();
  });

  it('displays character grid layout correctly', () => {
    const { container } = render(<Home />);
    
    const characterGrid = container.querySelector('.grid.grid-cols-1.lg\\:grid-cols-2.gap-8');
    expect(characterGrid).toBeInTheDocument();
  });

  it('has responsive text classes in header', () => {
    const { container } = render(<Home />);
    
    const headerText = container.querySelector('.text-5xl.lg\\:text-6xl');
    expect(headerText).toBeInTheDocument();
  });
}); 