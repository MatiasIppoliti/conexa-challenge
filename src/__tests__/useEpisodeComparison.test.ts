import { renderHook, waitFor } from '@testing-library/react';
import { useEpisodeComparison } from '@/hooks/useEpisodeComparison';
import { Character, EpisodeComparison } from '@/types/rick-and-morty';
import * as api from '@/services/api';

jest.mock('@/services/api');
const mockApi = api as jest.Mocked<typeof api>;

const mockCharacter1: Character = {
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
    'https://rickandmortyapi.com/api/episode/2',
    'https://rickandmortyapi.com/api/episode/3'
  ],
  url: 'https://rickandmortyapi.com/api/character/1',
  created: '2017-11-04T18:48:46.250Z'
};

const mockCharacter2: Character = {
  id: 2,
  name: 'Morty Smith',
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
  image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
  episode: [
    'https://rickandmortyapi.com/api/episode/2',
    'https://rickandmortyapi.com/api/episode/3',
    'https://rickandmortyapi.com/api/episode/4'
  ],
  url: 'https://rickandmortyapi.com/api/character/2',
  created: '2017-11-04T18:48:46.250Z'
};

const mockEpisodes = [
  {
    id: 1,
    name: 'Pilot',
    air_date: 'December 2, 2013',
    episode: 'S01E01',
    characters: ['https://rickandmortyapi.com/api/character/1'],
    url: 'https://rickandmortyapi.com/api/episode/1',
    created: '2017-11-10T12:56:33.798Z'
  },
  {
    id: 2,
    name: 'Lawnmower Dog',
    air_date: 'December 9, 2013',
    episode: 'S01E02',
    characters: ['https://rickandmortyapi.com/api/character/1', 'https://rickandmortyapi.com/api/character/2'],
    url: 'https://rickandmortyapi.com/api/episode/2',
    created: '2017-11-10T12:56:33.916Z'
  },
  {
    id: 3,
    name: 'Anatomy Park',
    air_date: 'December 16, 2013',
    episode: 'S01E03',
    characters: ['https://rickandmortyapi.com/api/character/1', 'https://rickandmortyapi.com/api/character/2'],
    url: 'https://rickandmortyapi.com/api/episode/3',
    created: '2017-11-10T12:56:34.022Z'
  },
  {
    id: 4,
    name: 'M. Night Shaym-Aliens!',
    air_date: 'January 13, 2014',
    episode: 'S01E04',
    characters: ['https://rickandmortyapi.com/api/character/2'],
    url: 'https://rickandmortyapi.com/api/episode/4',
    created: '2017-11-10T12:56:34.130Z'
  }
];

describe('useEpisodeComparison', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockApi.extractEpisodeIds.mockImplementation((urls: string[]) => 
      urls.map(url => parseInt(url.split('/').pop() || '0', 10)).filter(id => id > 0)
    );
  });

  it('should return empty arrays when no characters are provided', async () => {
    const { result } = renderHook(() => useEpisodeComparison(null, null));

    expect(result.current.episodeComparison).toEqual({
      characterOnlyEpisodes: [],
      sharedEpisodes: [],
      characterTwoOnlyEpisodes: [],
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should return empty arrays when only one character is provided', async () => {
    const { result } = renderHook(() => useEpisodeComparison(mockCharacter1, null));

    expect(result.current.episodeComparison).toEqual({
      characterOnlyEpisodes: [],
      sharedEpisodes: [],
      characterTwoOnlyEpisodes: [],
    });
  });

  it('should correctly compare episodes for two characters', async () => {
    mockApi.getEpisodes
      .mockResolvedValueOnce([mockEpisodes[1], mockEpisodes[2]])
      .mockResolvedValueOnce([mockEpisodes[0]])
      .mockResolvedValueOnce([mockEpisodes[3]]);

    const { result } = renderHook(() => useEpisodeComparison(mockCharacter1, mockCharacter2));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.episodeComparison).toEqual({
      characterOnlyEpisodes: [mockEpisodes[0]],
      sharedEpisodes: [mockEpisodes[1], mockEpisodes[2]],
      characterTwoOnlyEpisodes: [mockEpisodes[3]],
    });
    expect(result.current.error).toBeNull();

    expect(mockApi.getEpisodes).toHaveBeenCalledTimes(3);
    expect(mockApi.getEpisodes).toHaveBeenCalledWith([2, 3]);
    expect(mockApi.getEpisodes).toHaveBeenCalledWith([1]);
    expect(mockApi.getEpisodes).toHaveBeenCalledWith([4]);
  });

  it('should handle API errors', async () => {
    mockApi.getEpisodes.mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useEpisodeComparison(mockCharacter1, mockCharacter2));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Error fetching episode data');
    expect(result.current.episodeComparison).toEqual({
      characterOnlyEpisodes: [],
      sharedEpisodes: [],
      characterTwoOnlyEpisodes: [],
    });
  });

  it('should update when characters change', async () => {
    mockApi.getEpisodes.mockResolvedValue([]);

    const { result, rerender } = renderHook<
      { episodeComparison: EpisodeComparison, loading: boolean, error: string | null },
      { char1: Character | null, char2: Character | null }
    >(
      ({ char1, char2 }) => useEpisodeComparison(char1, char2),
      {
        initialProps: { char1: mockCharacter1, char2: mockCharacter2 }
      }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    rerender({ char1: mockCharacter1, char2: null });

    expect(result.current.episodeComparison).toEqual({
      characterOnlyEpisodes: [],
      sharedEpisodes: [],
      characterTwoOnlyEpisodes: [],
    });
  });
}); 