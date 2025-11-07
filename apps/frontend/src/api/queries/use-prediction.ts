import { useQuery } from '@tanstack/react-query';

export const usePrediction = (id: string) => {
  return useQuery({
    queryKey: ['prediction', id],
    queryFn: async () => {
      const req = await fetch(`http://localhost:8000/predictions/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!req.ok) {
        throw new Error('Failed to fetch prediction result');
      }
      const res = await req.json();
      return res as { predictions: Record<string, number>; imageData: string };
    },
    enabled: !!id,
    retry: 3,
    retryDelay: 1000
  });
};
