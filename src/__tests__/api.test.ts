import { extractEpisodeIds } from '@/services/api';

describe('API Service', () => {
  describe('extractEpisodeIds', () => {
    it('should extract episode IDs from URLs correctly', () => {
      const episodeUrls = [
        'https://rickandmortyapi.com/api/episode/1',
        'https://rickandmortyapi.com/api/episode/2',
        'https://rickandmortyapi.com/api/episode/28'
      ];

      const result = extractEpisodeIds(episodeUrls);
      expect(result).toEqual([1, 2, 28]);
    });

    it('should return empty array for empty input', () => {
      const result = extractEpisodeIds([]);
      expect(result).toEqual([]);
    });

    it('should filter out invalid URLs', () => {
      const episodeUrls = [
        'https://rickandmortyapi.com/api/episode/1',
        'invalid-url',
        'https://rickandmortyapi.com/api/episode/2'
      ];

      const result = extractEpisodeIds(episodeUrls);
      expect(result).toEqual([1, 2]);
    });

    it('should handle single episode URL', () => {
      const episodeUrls = ['https://rickandmortyapi.com/api/episode/42'];

      const result = extractEpisodeIds(episodeUrls);
      expect(result).toEqual([42]);
    });
  });
}); 