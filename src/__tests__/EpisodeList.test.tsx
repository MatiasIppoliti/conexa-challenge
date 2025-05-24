import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EpisodeList } from '@/components/EpisodeList';
import { Episode } from '@/types/rick-and-morty';

const mockEpisodes: Episode[] = [
  {
    id: 1,
    name: 'Pilot',
    air_date: 'December 2, 2013',
    episode: 'S01E01',
    characters: [
      'https://rickandmortyapi.com/api/character/1',
      'https://rickandmortyapi.com/api/character/2'
    ],
    url: 'https://rickandmortyapi.com/api/episode/1',
    created: '2017-11-10T12:56:33.798Z'
  },
  {
    id: 2,
    name: 'Lawnmower Dog',
    air_date: 'December 9, 2013',
    episode: 'S01E02',
    characters: [
      'https://rickandmortyapi.com/api/character/1',
      'https://rickandmortyapi.com/api/character/2',
      'https://rickandmortyapi.com/api/character/3'
    ],
    url: 'https://rickandmortyapi.com/api/episode/2',
    created: '2017-11-10T12:56:33.916Z'
  }
];

describe('EpisodeList', () => {
  it('renders episode list with episodes correctly', () => {
    render(
      <EpisodeList
        title="Test Episodes"
        episodes={mockEpisodes}
      />
    );

    expect(screen.getByText('Test Episodes (2)')).toBeInTheDocument();
    expect(screen.getByText('Pilot')).toBeInTheDocument();
    expect(screen.getByText('Lawnmower Dog')).toBeInTheDocument();
    expect(screen.getByText('S01E01')).toBeInTheDocument();
    expect(screen.getByText('S01E02')).toBeInTheDocument();
    expect(screen.getByText('Air Date: December 2, 2013')).toBeInTheDocument();
    expect(screen.getByText('Air Date: December 9, 2013')).toBeInTheDocument();
    expect(screen.getByText('Characters: 2')).toBeInTheDocument();
    expect(screen.getByText('Characters: 3')).toBeInTheDocument();
  });

  it('shows empty state when no episodes provided', () => {
    render(
      <EpisodeList
        title="No Episodes"
        episodes={[]}
        emptyMessage="No episodes available"
      />
    );

    expect(screen.getByText('No Episodes (0)')).toBeInTheDocument();
    expect(screen.getByText('📺')).toBeInTheDocument();
    expect(screen.getByText('No episodes available')).toBeInTheDocument();
  });

  it('shows default empty message when no custom message provided', () => {
    render(
      <EpisodeList
        title="Empty List"
        episodes={[]}
      />
    );

    expect(screen.getByText('No episodes found')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(
      <EpisodeList
        title="Loading Episodes"
        episodes={[]}
        loading={true}
      />
    );

    expect(screen.getByText('Loading Episodes')).toBeInTheDocument();
    
    const { container } = render(
      <EpisodeList
        title="Loading Episodes"
        episodes={[]}
        loading={true}
      />
    );
    
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('renders single episode correctly', () => {
    const singleEpisode = [mockEpisodes[0]];
    
    render(
      <EpisodeList
        title="Single Episode"
        episodes={singleEpisode}
      />
    );

    expect(screen.getByText('Single Episode (1)')).toBeInTheDocument();
    expect(screen.getByText('Pilot')).toBeInTheDocument();
    expect(screen.getByText('S01E01')).toBeInTheDocument();
  });

  it('renders with scrollable container when many episodes', () => {
    const { container } = render(
      <EpisodeList
        title="Many Episodes"
        episodes={mockEpisodes}
      />
    );

    const scrollableContainer = container.querySelector('.max-h-80.overflow-y-auto');
    expect(scrollableContainer).toBeInTheDocument();
  });
}); 