import Image from 'next/image';
import Organicos from '@/assets/landing-page/exemplos-reciclaveis/maca.jpg';
import Metais from '@/assets/landing-page/exemplos-reciclaveis/metais.webp';
import Papel from '@/assets/landing-page/exemplos-reciclaveis/papel.jpg';
import Plasticos from '@/assets/landing-page/exemplos-reciclaveis/plasticos.jpg';
import Vidros from '@/assets/landing-page/exemplos-reciclaveis/vidros.webp';
import { Button } from '@/components/ui/button';

export default function ExampleImagesSection() {
  return (
    <section className="mx-auto mt-6 mb-2 w-full max-w-lg text-center">
      <h3 className="mb-2 font-semibold text-base text-foreground">Ou experimente com estas imagens de exemplo:</h3>
      <div className="flex flex-wrap justify-center gap-4">
        <Button
          className="flex h-24 w-20 flex-col items-center gap-1 p-0 transition-transform duration-150 hover:scale-105 focus:scale-105 focus:outline-none active:scale-100"
          size="lg"
          tabIndex={0}
          type="button"
          variant="ghost"
        >
          <span className="block h-16 w-16 overflow-hidden rounded shadow">
            <Image
              alt="Exemplo Plástico"
              className="h-full w-full object-cover"
              height={64}
              src={Plasticos}
              width={64}
            />
          </span>
          <span className="text-foreground/70 text-xs">Plástico</span>
        </Button>
        <Button
          className="flex h-24 w-20 flex-col items-center gap-1 p-0 transition-transform duration-150 hover:scale-105 focus:scale-105 focus:outline-none active:scale-100"
          size="lg"
          tabIndex={0}
          type="button"
          variant="ghost"
        >
          <span className="block h-16 w-16 overflow-hidden rounded shadow">
            <Image alt="Exemplo Vidro" className="h-full w-full object-cover" height={64} src={Vidros} width={64} />
          </span>
          <span className="text-foreground/70 text-xs">Vidro</span>
        </Button>
        <Button
          className="flex h-24 w-20 flex-col items-center gap-1 p-0 transition-transform duration-150 hover:scale-105 focus:scale-105 focus:outline-none active:scale-100"
          size="lg"
          tabIndex={0}
          type="button"
          variant="ghost"
        >
          <span className="block h-16 w-16 overflow-hidden rounded shadow">
            <Image alt="Exemplo Papel" className="h-full w-full object-cover" height={64} src={Papel} width={64} />
          </span>
          <span className="text-foreground/70 text-xs">Papel</span>
        </Button>
        <Button
          className="flex h-24 w-20 flex-col items-center gap-1 p-0 transition-transform duration-150 hover:scale-105 focus:scale-105 focus:outline-none active:scale-100"
          size="lg"
          tabIndex={0}
          type="button"
          variant="ghost"
        >
          <span className="block h-16 w-16 overflow-hidden rounded shadow">
            <Image alt="Exemplo Metal" className="h-full w-full object-cover" height={64} src={Metais} width={64} />
          </span>
          <span className="text-foreground/70 text-xs">Metal</span>
        </Button>
        <Button
          className="flex h-24 w-20 flex-col items-center gap-1 p-0 transition-transform duration-150 hover:scale-105 focus:scale-105 focus:outline-none active:scale-100"
          size="lg"
          tabIndex={0}
          type="button"
          variant="ghost"
        >
          <span className="block h-16 w-16 overflow-hidden rounded shadow">
            <Image
              alt="Exemplo Orgânico"
              className="h-full w-full object-cover"
              height={64}
              src={Organicos}
              width={64}
            />
          </span>
          <span className="text-foreground/70 text-xs">Orgânico</span>
        </Button>
      </div>
    </section>
  );
}
