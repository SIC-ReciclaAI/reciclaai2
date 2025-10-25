'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import ExampleImagesSection from './sections/example-images';
import HeroPictureSelector from './picture-selector';

export default function ImageUploadSection() {
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  return (
    <>
      <Card className="mt-4 flex w-full max-w-md flex-col items-center bg-card p-8 text-foreground shadow-lg">
        <HeroPictureSelector imageBase64={imageBase64} onImageSelect={setImageBase64} />
      </Card>

      <ExampleImagesSection onSelectImage={setImageBase64} />
    </>
  );
}
