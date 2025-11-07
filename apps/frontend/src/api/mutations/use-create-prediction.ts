import { useMutation } from '@tanstack/react-query';

export const useCreatePredictionMutation = () => {
  const mutation = useMutation({
    mutationFn: async (imageData: string) => {
      const req = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        body: JSON.stringify({ imageData }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!req.ok) {
        throw new Error('Network response was not ok');
      }
      const res = await req.json();
      return res as { success: boolean; id: string };
    }
  });

  return mutation;
};
