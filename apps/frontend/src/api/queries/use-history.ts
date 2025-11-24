import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '@/lib/env';

export type HistoryItem = {
  id: string;
  predictions: Record<string, number>;
  imageData: string;
  createdAt: string;
};

export const usePredictionHistory = (token: string | null, limit = 5) => {
  return useQuery({
    queryKey: ['history', token, limit],
    enabled: Boolean(token),
    queryFn: async () => {
      const req = await fetch(`${API_BASE_URL}/history?limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      if (!req.ok) {
        const errorBody = await req.json().catch(() => ({}));
        throw new Error(errorBody?.detail ?? 'Erro ao carregar histórico');
      }
      const res = await req.json();
      return res as { total: number; items: HistoryItem[] };
    }
  });
};


