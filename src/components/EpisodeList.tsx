import { Episode } from '@/types/rick-and-morty';

interface EpisodeListProps {
  title: string;
  episodes: Episode[];
  loading?: boolean;
  emptyMessage?: string;
}

export const EpisodeList: React.FC<EpisodeListProps> = ({
  title,
  episodes,
  loading = false,
  emptyMessage = 'No episodes found',
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">{title}</h3>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4 text-gray-800">
        {title} ({episodes.length})
      </h3>
      
      {episodes.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <div className="text-4xl mb-2">📺</div>
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {episodes.map((episode) => (
            <div
              key={episode.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-lg font-semibold text-gray-800">
                  {episode.name}
                </h4>
                <span className="text-sm font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {episode.episode}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-2">
                Air Date: {episode.air_date}
              </p>
              
              <div className="text-xs text-gray-500">
                Characters: {episode.characters.length}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 