'use client';

import { ArrowLeft, CheckCircle2, Leaf, LoaderIcon, Recycle, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { usePrediction } from '@/api/queries/use-prediction';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

const CATEGORY_INFO: Record<
  string,
  {
    label: string;
    color: string;
    icon: React.ReactNode;
    description: string;
    instructions: string[];
  }
> = {
  plastic: {
    label: 'Plástico',
    color: 'text-red-600',
    icon: <Recycle className="size-8" />,
    description: 'Material reciclável que pode ser transformado em novos produtos.',
    instructions: [
      'Lave e seque o item antes de descartar',
      'Remova rótulos e tampas quando possível',
      'Descarte em lixeira vermelha (plástico)',
      'Procure pontos de coleta seletiva próximos'
    ]
  },
  glass: {
    label: 'Vidro',
    color: 'text-green-600',
    icon: <Recycle className="size-8" />,
    description: 'Material 100% reciclável que pode ser reutilizado infinitamente.',
    instructions: [
      'Lave e seque o item antes de descartar',
      'Remova tampas e rótulos',
      'Descarte em lixeira verde (vidro)',
      'Cuidado com vidros quebrados - embale com segurança'
    ]
  },
  metal: {
    label: 'Metal',
    color: 'text-yellow-600',
    icon: <Recycle className="size-8" />,
    description: 'Material reciclável valioso que economiza energia na produção.',
    instructions: [
      'Lave e seque latas e embalagens',
      'Amasse latas para economizar espaço',
      'Descarte em lixeira amarela (metal)',
      'Leve a pontos de coleta ou cooperativas'
    ]
  },
  paper: {
    label: 'Papel',
    color: 'text-blue-600',
    icon: <Recycle className="size-8" />,
    description: 'Material reciclável que ajuda a preservar árvores.',
    instructions: [
      'Mantenha o papel limpo e seco',
      'Não misture com papel sujo ou engordurado',
      'Descarte em lixeira azul (papel)',
      'Papéis molhados ou sujos vão no lixo comum'
    ]
  },
  cardboard: {
    label: 'Papelão',
    color: 'text-orange-600',
    icon: <Recycle className="size-8" />,
    description: 'Material reciclável amplamente reutilizado na indústria.',
    instructions: [
      'Desmonte caixas para economizar espaço',
      'Mantenha seco e limpo',
      'Descarte em lixeira azul (papel/papelão)',
      'Papelão molhado ou sujo não é reciclável'
    ]
  },
  trash: {
    label: 'Lixo Comum',
    color: 'text-gray-600',
    icon: <Trash2 className="size-8" />,
    description: 'Material não reciclável ou resíduo orgânico.',
    instructions: [
      'Descarte em lixeira de lixo comum (cinza/preto)',
      'Se for orgânico, considere compostagem',
      'Não misture com recicláveis',
      'Embale adequadamente para evitar vazamentos'
    ]
  }
};

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const predictionId = searchParams.get('id');
  const {
    data: predictionData,
    isLoading: isPredictionLoading,
    isError: isPredictionError
  } = usePrediction(predictionId || '');

  // Handle prediction query errors (expired or not found)
  useEffect(() => {
    if (isPredictionError) {
      toast.error('Predição expirada ou não encontrada.');
      router.push('/');
    }
  }, [isPredictionError, router]);

  // Redirect if no prediction ID
  useEffect(() => {
    if (!predictionId) {
      router.push('/');
    }
  }, [predictionId, router]);

  if (isPredictionLoading || !predictionData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="text-center">
          <LoaderIcon className="mx-auto mb-4 size-16 animate-spin text-primary" />
          <h1 className="mb-2 font-bold text-2xl">Analisando imagem...</h1>
          <p className="text-muted-foreground">O processo pode levar até 15 segundos.</p>
        </div>
      </div>
    );
  }

  const { predictions, imageData } = predictionData;
  const sortedPredictions = Object.entries(predictions).sort(([, a], [, b]) => b - a);
  const [topCategory, topConfidence] = sortedPredictions[0];
  const categoryInfo = CATEGORY_INFO[topCategory] || CATEGORY_INFO.trash;

  return (
    <div className="min-h-screen bg-background p-4 pb-16">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 size-4" />
              Voltar
            </Button>
          </Link>
          <Badge className="gap-1" variant="outline">
            <CheckCircle2 className="size-3" />
            Análise concluída
          </Badge>
        </div>

        {/* Main Result Card */}
        <Card className="mb-6 overflow-hidden">
          <div className="grid gap-6 p-6 md:grid-cols-2">
            {/* Image Preview */}
            <div className="flex items-center justify-center">
              <div className="relative h-80 w-full">
                <Image
                  alt="Imagem analisada"
                  className="rounded-lg object-contain"
                  draggable="false"
                  fill
                  src={imageData}
                />
              </div>
            </div>

            {/* Classification Result */}
            <div className="flex flex-col justify-center">
              <div className={`mb-4 ${categoryInfo.color}`}>{categoryInfo.icon}</div>
              <h1 className="mb-2 font-bold text-3xl">{categoryInfo.label}</h1>
              <p className="mb-4 text-muted-foreground">{categoryInfo.description}</p>
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">Confiança:</span>
                <span className="font-bold text-lg">{(topConfidence * 100).toFixed(1)}%</span>
              </div>
              <Progress className="mt-2" value={topConfidence * 100} />
            </div>
          </div>
        </Card>

        {/* Disposal Instructions */}
        <Card className="mb-6 p-6">
          <div className="mb-4 flex items-center gap-2">
            <Leaf className="size-6 text-green-600" />
            <h2 className="font-bold text-xl">Instruções de Descarte</h2>
          </div>
          <ul className="space-y-2">
            {categoryInfo.instructions.map((instruction, index) => (
              <li className="flex items-start gap-2" key={index}>
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-600" />
                <span>{instruction}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* All Predictions */}
        <Card className="p-6">
          <h2 className="mb-4 font-bold text-xl">Todas as Classificações</h2>
          <div className="space-y-3">
            {sortedPredictions.map(([category, confidence], index) => {
              const info = CATEGORY_INFO[category] || CATEGORY_INFO.trash;
              return (
                <div key={category}>
                  {index > 0 && <Separator className="my-3" />}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${info.color}`}>{info.label}</span>
                        {index === 0 && (
                          <Badge className="text-xs" variant="default">
                            Mais provável
                          </Badge>
                        )}
                      </div>
                      <span className="font-semibold text-sm">{(confidence * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={confidence * 100} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link className="flex-1" href="/">
            <Button className="w-full" variant="outline">
              Analisar outra imagem
            </Button>
          </Link>
          <Button
            className="flex-1"
            onClick={() => {
              // TODO: Implement share functionality
              toast.success('Funcionalidade em desenvolvimento');
            }}
            variant="default"
          >
            Compartilhar resultado
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return <ResultsContent />;
}
