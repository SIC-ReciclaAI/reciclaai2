'use client';

import clsx from 'clsx';
import { Camera, LoaderIcon, Upload } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAnalyzeImage } from '@/api/mutations/use-analyze-image';

export default function HeroPictureSelector() {
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const analyzeImageMutation = useAnalyzeImage();

  const handleInputFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!imageBase64) return;
    
    toast.info('Enviando imagem para análise...', {
      id: 'image-upload'
    });

    analyzeImageMutation.mutate(new File([], 'image.jpg'), {
      onSuccess: () => {
        toast.success('Imagem enviada com sucesso!', { id: 'image-upload' });
      }
    });
  };

  return (
    <>
      <div
        className={clsx(
          'mb-4 flex items-center justify-center overflow-hidden rounded-lg border-2 border-primary/20 bg-muted',
          !imageBase64 && 'size-28',
          imageBase64 && 'size-64 border-none'
        )}
      >
        {imageBase64 ? (
          <img alt="Selected" className="h-full w-full object-fill" draggable="false" src={imageBase64} />
        ) : (
          <Camera className="h-12 w-12 text-primary/60" />
        )}
      </div>

      <div className="flex w-full items-center justify-center gap-x-2">
        <Button
          className="flex w-full items-center gap-2 font-semibold"
          disabled={analyzeImageMutation.isPending}
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
            className="!h-full flex items-center gap-2 font-semibold"
            disabled={analyzeImageMutation.isPending}
            onClick={handleSubmit}
            variant="outline"
          >
            {analyzeImageMutation.isPending ? <LoaderIcon className="h-4 w-4 animate-spin" /> : <Upload />}
          </Button>
        )}
      </div>
      <p className="text-foreground/60 text-sm">O processo de classificação pode demorar até 15 segundos.</p>
    </>
  );
}
