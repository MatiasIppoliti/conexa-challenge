import axios from 'axios';
import { Character, Episode, ApiResponse } from '@/types/rick-and-morty';

const BASE_URL = 'https://rickandmortyapi.com/api';

const api = axios.create({
  baseURL: BASE_URL,
});

export const getCharacters = async (page: number = 1): Promise<ApiResponse<Character>> => {
  const response = await api.get(`/character?page=${page}`);
  return response.data;
};

export const getEpisodes = async (episodeIds: number[]): Promise<Episode[]> => {
  if (episodeIds.length === 0) return [];
  
  if (episodeIds.length === 1) {
    const response = await api.get(`/episode/${episodeIds[0]}`);
    return [response.data];
  }
  
  const response = await api.get(`/episode/${episodeIds.join(',')}`);
  return response.data;
};

export const extractEpisodeIds = (episodeUrls: string[]): number[] => {
  return episodeUrls.map(url => {
    const match = url.match(/\/episode\/(\d+)$/);
    return match ? parseInt(match[1], 10) : 0;
  }).filter(id => id > 0);
}; 