import { useMutation } from '@tanstack/react-query';
import { API_BASE_URL } from '@/lib/env';

type PredictionPayload = {
  imageData: string;
  token: string;
};

export const useCreatePredictionMutation = () => {
  const mutation = useMutation({
    mutationFn: async ({ imageData, token }: PredictionPayload) => {
      const req = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        body: JSON.stringify({ imageData }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      if (!req.ok) {
        const errorBody = await req.json().catch(() => ({}));
        throw new Error(errorBody?.detail ?? 'Erro ao enviar imagem');
      }
      const res = await req.json();
      return res as { success: boolean; id: string };
    }
  });

  return mutation;
};
