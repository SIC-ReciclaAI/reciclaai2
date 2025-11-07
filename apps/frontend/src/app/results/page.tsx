'use client';

import { ArrowLeft, Camera, CheckCircle2, Leaf, LoaderIcon, Recycle, Sparkles, Trash2 } from 'lucide-react';
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
      <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-background to-background/80 p-4">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 animate-ping rounded-full bg-primary/20 blur-xl" />
            <LoaderIcon className="relative mx-auto size-16 animate-spin text-primary" />
          </div>
          <h1 className="mb-3 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text font-bold text-2xl text-transparent">
            Analisando imagem...
          </h1>
          <p className="text-muted-foreground">O processo pode levar até 15 segundos.</p>
          <div className="mx-auto mt-6 h-2 w-64 overflow-hidden rounded-full bg-muted">
            <div className="slide-in-from-left-full repeat-infinite h-full w-1/3 animate-in rounded-full bg-primary/50 duration-1000" />
          </div>
        </div>
      </div>
    );
  }

  const { predictions, imageData } = predictionData;
  const sortedPredictions = Object.entries(predictions).sort(([, a], [, b]) => b - a);
  const [topCategory, topConfidence] = sortedPredictions[0];
  const categoryInfo = CATEGORY_INFO[topCategory] || CATEGORY_INFO.trash;

  return (
    <div className="min-h-screen bg-linear-to-br from-background to-background/80 p-4 pb-16">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="fade-in slide-in-from-top mb-6 flex animate-in items-center justify-between duration-500">
          <Link href="/">
            <Button className="gap-2" variant="ghost">
              <ArrowLeft className="size-4" />
              Voltar
            </Button>
          </Link>
          <Badge className="gap-1.5 shadow-sm" variant="outline">
            <CheckCircle2 className="size-3.5 text-green-600" />
            Análise concluída
          </Badge>
        </div>

        {/* Main Result Card */}
        <div className="fade-in zoom-in-95 relative mb-8 animate-in duration-700">
          <div className="-inset-1 absolute rounded-2xl bg-linear-to-r from-primary/30 via-primary/20 to-primary/30 opacity-75 blur-xl" />
          <Card className="relative overflow-hidden border-primary/20 shadow-2xl">
            <div className="grid gap-6 p-6 md:grid-cols-2">
              {/* Image Preview */}
              <div className="flex items-center justify-center">
                <div className="relative h-80 w-full overflow-hidden rounded-xl shadow-lg ring-2 ring-primary/10">
                  <Image
                    alt="Imagem analisada"
                    className="object-contain transition-transform duration-300 hover:scale-105"
                    draggable="false"
                    fill
                    src={imageData}
                  />
                </div>
              </div>

              {/* Classification Result */}
              <div className="flex flex-col justify-center">
                <div className={`mb-4 ${categoryInfo.color}`}>{categoryInfo.icon}</div>
                <h1 className="mb-2 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text font-bold text-3xl text-transparent">
                  {categoryInfo.label}
                </h1>
                <p className="mb-6 text-muted-foreground leading-relaxed">{categoryInfo.description}</p>
                <div className="rounded-lg border border-primary/10 bg-linear-to-br from-muted/50 to-muted/30 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium text-sm">Nível de confiança:</span>
                    <span className="font-bold text-lg">{(topConfidence * 100).toFixed(1)}%</span>
                  </div>
                  <Progress className="h-3" value={topConfidence * 100} />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Disposal Instructions */}
        <Card className="fade-in slide-in-from-bottom-4 mb-8 animate-in border-primary/10 bg-linear-to-br from-card to-card/50 p-6 shadow-lg backdrop-blur-sm duration-700">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-full bg-linear-to-br from-green-500/20 to-green-600/10">
              <Leaf className="size-6 text-green-600" />
            </div>
            <h2 className="font-bold text-xl">Instruções de Descarte</h2>
          </div>
          <ul className="space-y-3">
            {categoryInfo.instructions.map((instruction, index) => (
              <li className="group flex items-start gap-3 transition-all duration-300 hover:translate-x-1" key={index}>
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-600 transition-transform duration-300 group-hover:scale-110" />
                <span className="leading-relaxed">{instruction}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* All Predictions */}
        <Card className="fade-in slide-in-from-bottom-5 animate-in border-primary/10 bg-linear-to-br from-card to-card/50 p-6 shadow-lg backdrop-blur-sm duration-700">
          <h2 className="mb-6 font-bold text-xl">Todas as Classificações</h2>
          <div className="space-y-4">
            {sortedPredictions.map(([category, confidence], index) => {
              const info = CATEGORY_INFO[category] || CATEGORY_INFO.trash;
              return (
                <div key={category}>
                  {index > 0 && <Separator className="my-4" />}
                  <div className="group space-y-3 rounded-lg p-3 transition-all duration-300 hover:bg-muted/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`font-semibold ${info.color}`}>{info.label}</span>
                        {index === 0 && (
                          <Badge className="text-xs shadow-sm" variant="default">
                            Mais provável
                          </Badge>
                        )}
                      </div>
                      <span className="font-bold text-sm">{(confidence * 100).toFixed(1)}%</span>
                    </div>
                    <Progress className="h-2.5" value={confidence * 100} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Actions */}
        <div className="fade-in slide-in-from-bottom-6 mt-8 flex animate-in flex-col gap-3 duration-700 sm:flex-row">
          <Link className="flex-1" href="/">
            <Button className="w-full shadow-md transition-all hover:shadow-lg" size="lg" variant="outline">
              <Camera className="mr-2 size-4" />
              Analisar outra imagem
            </Button>
          </Link>
          <Button
            className="flex-1 shadow-md transition-all hover:shadow-lg"
            onClick={() => {
              // TODO: Implement share functionality
              toast.success('Funcionalidade em desenvolvimento');
            }}
            size="lg"
            variant="default"
          >
            <Sparkles className="mr-2 size-4" />
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
