'use client';

import clsx from 'clsx';
import { Camera, Upload } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCreatePredictionMutation } from '@/api/mutations/use-create-prediction';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HeroPictureSelectorProps {
  imageBase64: string | null;
  onImageSelect: (image: string | null) => void;
}

export default function HeroPictureSelector({ imageBase64, onImageSelect }: HeroPictureSelectorProps) {
  const router = useRouter();
  const createPredictionMutation = useCreatePredictionMutation();

  const handleInputFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      onImageSelect(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!imageBase64) return;

    createPredictionMutation.mutate(imageBase64, {
      onSuccess: (data) => {
        toast.success('Imagem enviada com sucesso!');
        router.push(`/results?id=${data.id}`);
      },
      onError: () => {
        toast.error('Erro ao analisar imagem. Tente novamente.');
      }
    });
  };

  return (
    <>
      <div
        className={clsx(
          'group mb-6 flex items-center justify-center overflow-hidden rounded-xl transition-all duration-300',
          !imageBase64 &&
            'size-32 border-2 border-primary/30 border-dashed bg-gradient-to-br from-muted to-muted/50 hover:border-primary/50 hover:shadow-lg',
          imageBase64 && 'relative size-72 border-none shadow-2xl ring-2 ring-primary/20'
        )}
      >
        {imageBase64 ? (
          <Image
            alt="Selected"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            draggable="false"
            fill
            src={imageBase64}
          />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Camera className="h-12 w-12 text-primary/60 transition-transform duration-300 group-hover:scale-110" />
            <span className="font-medium text-primary/60 text-xs">Clique abaixo</span>
          </div>
        )}
      </div>

      <div className="flex w-full items-center justify-center gap-x-2">
        <Button
          className="group flex w-full items-center gap-2 font-semibold shadow-md transition-all hover:shadow-lg"
          onClick={() => document.getElementById('image-upload')?.click()}
          variant="default"
        >
          <Camera className="size-4 transition-transform group-hover:scale-110" />
          {imageBase64 ? 'Enviar outra foto' : 'Enviar foto'}
        </Button>

        <Input
          accept="image/*"
          className="sr-only"
          id="image-upload"
          name="image-upload"
          onChange={handleInputFileChange}
          type="file"
        />

        {imageBase64 && (
          <Button
            className="group flex h-full items-center gap-2 font-semibold shadow-md transition-all hover:shadow-lg"
            disabled={createPredictionMutation.isPending}
            onClick={handleSubmit}
            variant="outline"
          >
            <Upload className="transition-transform group-hover:scale-110" />
          </Button>
        )}
      </div>
      <p className="mt-3 text-center text-foreground/50 text-xs">⚡ Análise rápida em até 15 segundos</p>
    </>
  );
}
