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
          'mb-4 flex items-center justify-center overflow-hidden rounded-lg border-2 border-primary/20 bg-muted',
          !imageBase64 && 'size-28',
          imageBase64 && 'relative size-64 border-none'
        )}
      >
        {imageBase64 ? (
          <Image alt="Selected" className="object-fill" draggable="false" fill src={imageBase64} />
        ) : (
          <Camera className="h-12 w-12 text-primary/60" />
        )}
      </div>

      <div className="flex w-full items-center justify-center gap-x-2">
        <Button
          className="flex w-full items-center gap-2 font-semibold"
          onClick={() => document.getElementById('image-upload')?.click()}
          variant="default"
        >
          <Camera className="size-4" /> Enviar {imageBase64 && 'outra'} foto
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
            className="flex h-full! items-center gap-2 font-semibold"
            disabled={createPredictionMutation.isPending}
            onClick={handleSubmit}
            variant="outline"
          >
            <Upload />
          </Button>
        )}
      </div>
      <p className="text-foreground/60 text-sm">O processo de classificação pode demorar até 15 segundos.</p>
    </>
  );
}
