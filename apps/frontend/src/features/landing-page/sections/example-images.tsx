'use client';

import Image, { type StaticImageData } from 'next/image';
import Organicos from '@/assets/landing-page/exemplos-reciclaveis/maca.jpg';
import Metais from '@/assets/landing-page/exemplos-reciclaveis/metais.webp';
import Papel from '@/assets/landing-page/exemplos-reciclaveis/papel.jpg';
import Plasticos from '@/assets/landing-page/exemplos-reciclaveis/plasticos.jpg';
import Vidros from '@/assets/landing-page/exemplos-reciclaveis/vidros.jpg';
import { Button } from '@/components/ui/button';

interface ExampleImagesSectionProps {
  onSelectImage?: (imageSrc: string) => void;
}

export default function ExampleImagesSection({ onSelectImage }: ExampleImagesSectionProps) {
  const handleImageClick = async (imageData: StaticImageData, imageName: string) => {
    try {
      const response = await fetch(imageData.src);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onload = () => {
        onSelectImage?.(reader.result as string);
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error(`Erro ao carregar imagem ${imageName}:`, error);
    }
  };

  return (
    <section className="fade-in slide-in-from-bottom-3 mx-auto mt-10 mb-2 w-full max-w-2xl animate-in text-center duration-700">
      <h3 className="mb-6 font-semibold text-base text-foreground/80">Ou experimente com estas imagens de exemplo:</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        <Button
          className="group flex h-auto w-full flex-col items-center gap-2 rounded-lg border border-primary/10 bg-card/50 p-3 transition-all duration-300 hover:scale-105 hover:border-primary/30 hover:bg-card hover:shadow-xl focus:scale-105 focus:outline-none active:scale-100"
          onClick={() => handleImageClick(Plasticos, 'Plástico')}
          size="lg"
          tabIndex={0}
          type="button"
          variant="ghost"
        >
          <span className="block size-20 overflow-hidden rounded-lg shadow-md transition-transform duration-300 group-hover:shadow-xl">
            <Image
              alt="Exemplo Plástico"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              height={80}
              src={Plasticos}
              width={80}
            />
          </span>
          <span className="font-medium text-foreground/70 text-xs transition-colors duration-300 group-hover:text-foreground">
            Plástico
          </span>
        </Button>
        <Button
          className="group flex h-auto w-full flex-col items-center gap-2 rounded-lg border border-primary/10 bg-card/50 p-3 transition-all duration-300 hover:scale-105 hover:border-primary/30 hover:bg-card hover:shadow-xl focus:scale-105 focus:outline-none active:scale-100"
          onClick={() => handleImageClick(Vidros, 'Vidro')}
          size="lg"
          tabIndex={0}
          type="button"
          variant="ghost"
        >
          <span className="block size-20 overflow-hidden rounded-lg shadow-md transition-transform duration-300 group-hover:shadow-xl">
            <Image
              alt="Exemplo Vidro"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              height={80}
              src={Vidros}
              width={80}
            />
          </span>
          <span className="font-medium text-foreground/70 text-xs transition-colors duration-300 group-hover:text-foreground">
            Vidro
          </span>
        </Button>
        <Button
          className="group flex h-auto w-full flex-col items-center gap-2 rounded-lg border border-primary/10 bg-card/50 p-3 transition-all duration-300 hover:scale-105 hover:border-primary/30 hover:bg-card hover:shadow-xl focus:scale-105 focus:outline-none active:scale-100"
          onClick={() => handleImageClick(Papel, 'Papel')}
          size="lg"
          tabIndex={0}
          type="button"
          variant="ghost"
        >
          <span className="block size-20 overflow-hidden rounded-lg shadow-md transition-transform duration-300 group-hover:shadow-xl">
            <Image
              alt="Exemplo Papel"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              height={80}
              src={Papel}
              width={80}
            />
          </span>
          <span className="font-medium text-foreground/70 text-xs transition-colors duration-300 group-hover:text-foreground">
            Papel
          </span>
        </Button>
        <Button
          className="group flex h-auto w-full flex-col items-center gap-2 rounded-lg border border-primary/10 bg-card/50 p-3 transition-all duration-300 hover:scale-105 hover:border-primary/30 hover:bg-card hover:shadow-xl focus:scale-105 focus:outline-none active:scale-100"
          onClick={() => handleImageClick(Metais, 'Metal')}
          size="lg"
          tabIndex={0}
          type="button"
          variant="ghost"
        >
          <span className="block size-20 overflow-hidden rounded-lg shadow-md transition-transform duration-300 group-hover:shadow-xl">
            <Image
              alt="Exemplo Metal"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              height={80}
              src={Metais}
              width={80}
            />
          </span>
          <span className="font-medium text-foreground/70 text-xs transition-colors duration-300 group-hover:text-foreground">
            Metal
          </span>
        </Button>
        <Button
          className="group flex h-auto w-full flex-col items-center gap-2 rounded-lg border border-primary/10 bg-card/50 p-3 transition-all duration-300 hover:scale-105 hover:border-primary/30 hover:bg-card hover:shadow-xl focus:scale-105 focus:outline-none active:scale-100"
          onClick={() => handleImageClick(Organicos, 'Orgânico')}
          size="lg"
          tabIndex={0}
          type="button"
          variant="ghost"
        >
          <span className="block size-20 overflow-hidden rounded-lg shadow-md transition-transform duration-300 group-hover:shadow-xl">
            <Image
              alt="Exemplo Orgânico"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              height={80}
              src={Organicos}
              width={80}
            />
          </span>
          <span className="font-medium text-foreground/70 text-xs transition-colors duration-300 group-hover:text-foreground">
            Orgânico
          </span>
        </Button>
      </div>
    </section>
  );
}
