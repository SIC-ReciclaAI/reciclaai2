'use client';

import Image from 'next/image';
import { History, Loader2, RefreshCw } from 'lucide-react';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';
import { usePredictionHistory } from '@/api/queries/use-history';

const CATEGORY_LABELS: Record<string, string> = {
  plastic: 'Plástico',
  glass: 'Vidro',
  metal: 'Metal',
  paper: 'Papel',
  cardboard: 'Papelão',
  trash: 'Lixo comum'
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default function PredictionHistoryList() {
  const { token } = useAuth();
  const { data, isLoading, isError, refetch } = usePredictionHistory(token, 5);

  if (!token) {
    return null;
  }

  return (
    <Card className="border-primary/20 bg-card/80 p-6 backdrop-blur">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="size-4 text-primary" />
          <h3 className="font-semibold">Últimas análises</h3>
        </div>
        <Button className="h-8 gap-2 px-3" onClick={() => refetch()} variant="ghost">
          <RefreshCw className="size-4" />
          Atualizar
        </Button>
      </div>
      {isLoading && (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="size-5 animate-spin text-primary" />
        </div>
      )}
      {isError && <p className="text-muted-foreground text-sm">Não foi possível carregar o histórico.</p>}
      {!isLoading && data?.items.length === 0 && (
        <p className="text-muted-foreground text-sm">Suas próximas análises aparecerão aqui.</p>
      )}
      <div className="space-y-4">
        {data?.items.map((item) => (
          <HistoryRow key={item.id} createdAt={item.createdAt} image={item.imageData} predictions={item.predictions} />
        ))}
      </div>
    </Card>
  );
}

type HistoryRowProps = {
  image: string;
  predictions: Record<string, number>;
  createdAt: string;
};

function HistoryRow({ image, predictions, createdAt }: HistoryRowProps) {
  const [topCategory, topConfidence] = useMemo(() => {
    const sorted = Object.entries(predictions).sort(([, a], [, b]) => b - a);
    return sorted[0] ?? ['desconhecido', 0];
  }, [predictions]);

  return (
    <div className="flex items-center gap-3 rounded-lg border border-primary/10 p-3">
      <div className="relative h-16 w-16 overflow-hidden rounded-md border border-primary/20">
        <Image alt="Histórico" className="object-cover" fill sizes="64px" src={image} />
      </div>
      <div className="flex-1">
        <p className="font-medium">
          {CATEGORY_LABELS[topCategory] || 'Desconhecido'} - {(topConfidence * 100).toFixed(1)}%
        </p>
        <p className="text-muted-foreground text-xs">{formatDate(createdAt)}</p>
      </div>
    </div>
  );
}


