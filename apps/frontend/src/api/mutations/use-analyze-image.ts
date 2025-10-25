import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../client';

export interface PredictionResult {
  class: string;
  name: string;
  category: string;
  bin_color: string;
  confidence: number;
  confidence_percentage: string;
}

export interface ClassPrediction {
  class: string;
  name: string;
  confidence: number;
}

export interface AnalysisResponse {
  success: boolean;
  prediction: PredictionResult;
  instructions: string[];
  all_predictions: ClassPrediction[];
  metadata: {
    image_size: [number, number];
    image_mode: string;
    filename: string;
  };
}

export const useAnalyzeImage = () => {
  const mutation = useMutation({
    mutationKey: ['analyze-image'],
    mutationFn: async (base64Image: string): Promise<AnalysisResponse> => {
      const response = await apiClient.post('analyze-image', {
        body: JSON.stringify({ image: base64Image }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = (await response.json()) as { detail?: string };
        throw new Error(error.detail || 'Erro ao analisar imagem');
      }

      const data = await response.json();
      return data as AnalysisResponse;
    },
  });

  return mutation;
};
