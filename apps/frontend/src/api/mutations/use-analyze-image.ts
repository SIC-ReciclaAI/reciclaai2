import { useMutation } from '@tanstack/react-query';

export const useAnalyzeImage = () => {
  const mutation = useMutation({
    mutationFn: async (_imageFile: File) => {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(null);
        }, 2000);
      });
    }
  });

  return mutation;
};
