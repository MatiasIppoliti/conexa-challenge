import { useState, useEffect } from 'react';
import { Character, EpisodeComparison } from '@/types/rick-and-morty';
import { getEpisodes, extractEpisodeIds } from '@/services/api';

export const useEpisodeComparison = (character1: Character | null, character2: Character | null) => {
  const [episodeComparison, setEpisodeComparison] = useState<EpisodeComparison>({
    characterOnlyEpisodes: [],
    sharedEpisodes: [],
    characterTwoOnlyEpisodes: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const compareEpisodes = async () => {
      if (!character1 || !character2) {
        setEpisodeComparison({
          characterOnlyEpisodes: [],
          sharedEpisodes: [],
          characterTwoOnlyEpisodes: [],
        });
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const char1EpisodeIds = extractEpisodeIds(character1.episode);
        const char2EpisodeIds = extractEpisodeIds(character2.episode);
        
        const sharedEpisodeIds = char1EpisodeIds.filter(id => char2EpisodeIds.includes(id));
        
        const char1OnlyIds = char1EpisodeIds.filter(id => !char2EpisodeIds.includes(id));
        
        const char2OnlyIds = char2EpisodeIds.filter(id => !char1EpisodeIds.includes(id));

        const [sharedEpisodes, char1OnlyEpisodes, char2OnlyEpisodes] = await Promise.all([
          getEpisodes(sharedEpisodeIds),
          getEpisodes(char1OnlyIds),
          getEpisodes(char2OnlyIds),
        ]);

        setEpisodeComparison({
          characterOnlyEpisodes: char1OnlyEpisodes,
          sharedEpisodes,
          characterTwoOnlyEpisodes: char2OnlyEpisodes,
        });
      } catch (err) {
        setError('Error fetching episode data');
        console.error('Error comparing episodes:', err);
      } finally {
        setLoading(false);
      }
    };

    compareEpisodes();
  }, [character1, character2]);

  return { episodeComparison, loading, error };
}; 