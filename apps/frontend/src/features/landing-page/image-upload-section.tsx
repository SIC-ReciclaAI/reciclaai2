'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import HeroPictureSelector from './picture-selector';
import ExampleImagesSection from './sections/example-images';

export default function ImageUploadSection() {
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  return (
    <>
      <div className="fade-in zoom-in-95 relative mt-4 w-full max-w-md animate-in duration-700">
        <div className="-inset-1 absolute rounded-xl bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 opacity-75 blur-lg" />
        <Card className="relative flex flex-col items-center border-primary/20 bg-card/95 p-8 text-foreground shadow-2xl backdrop-blur-sm">
          <HeroPictureSelector imageBase64={imageBase64} onImageSelect={setImageBase64} />
        </Card>
      </div>

      <ExampleImagesSection onSelectImage={setImageBase64} />
    </>
  );
}
