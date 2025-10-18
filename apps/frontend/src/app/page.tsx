import { ArrowRight, Camera, MapPin, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Organicos from '@/assets/landing-page/exemplos-reciclaveis/maca.jpg';
import Metais from '@/assets/landing-page/exemplos-reciclaveis/metais.webp';
import Papel from '@/assets/landing-page/exemplos-reciclaveis/papel.jpg';
import Plasticos from '@/assets/landing-page/exemplos-reciclaveis/plasticos.jpg';
import Vidros from '@/assets/landing-page/exemplos-reciclaveis/vidros.webp';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-background px-4 pb-16">
      {/* Hero Section */}
      <section className="mt-16 mb-8 flex w-full max-w-2xl flex-col items-center text-center">
        <h1 className="mb-4 font-bold font-geist-sans text-5xl text-foreground leading-tight md:text-6xl">ReciclaAI</h1>
        <p className="mx-auto mb-6 max-w-xl text-foreground/80 text-lg">
          Identifique resíduos recicláveis com IA e visão computacional. Envie uma foto, receba dicas de descarte e
          ajude o planeta!
        </p>
      </section>

      {/* Card Section - Mock Classification */}
      <Card className="mt-4 flex w-full max-w-md flex-col items-center bg-card p-8 text-foreground shadow-lg">
        <div className="mb-4 flex h-28 w-28 items-center justify-center overflow-hidden rounded-lg border-2 border-primary/20 bg-muted">
          {/* Mock image preview */}
          <Camera className="h-12 w-12 text-primary/60" />
        </div>
        <Button className="mb-2 flex w-full items-center gap-2 font-semibold" size="lg" variant="default">
          <Camera className="h-4 w-4" /> Enviar foto
        </Button>
        <p className="mb-2 text-foreground/60 text-sm">O processo de classificação pode demorar até 5 minutos.</p>
      </Card>

      {/* Example Images Section */}
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

      {/* Features Section */}
      <section className="mt-10 flex w-full max-w-3xl flex-col items-center justify-center gap-8 border-t pt-10 text-center md:flex-row">
        <div className="flex flex-1 flex-col items-center gap-2">
          <Camera className="mb-2 h-8 w-8 text-primary/80" />
          <h4 className="font-semibold text-foreground">Envie uma foto</h4>
          <p className="text-foreground/70 text-sm">
            Processamento rápido e seguro de imagens para análise de resíduos.
          </p>
        </div>
        <span className="mx-2 hidden text-primary/60 md:inline-flex">
          <ArrowRight className="h-8 w-8" />
        </span>
        <div className="flex flex-1 flex-col items-center gap-2">
          <Sparkles className="mb-2 h-8 w-8 text-primary/80" />
          <h4 className="font-semibold text-foreground">Classificação automática</h4>
          <p className="text-foreground/70 text-sm">
            IA identifica o tipo de material: plástico, vidro, papel, metal ou orgânico.
          </p>
        </div>
        <span className="mx-2 hidden text-primary/60 md:inline-flex">
          <ArrowRight className="h-8 w-8" />
        </span>
        <div className="flex flex-1 flex-col items-center gap-2">
          <MapPin className="mb-2 h-8 w-8 text-primary/80" />
          <h4 className="font-semibold text-foreground">Dicas e pontos de coleta</h4>
          <p className="text-foreground/70 text-sm">
            Receba orientações de descarte e encontre locais para reciclagem.
          </p>
        </div>
      </section>

      {/* How it works Section */}
      <section className="mt-16 w-full max-w-2xl border-t pt-10 text-center">
        <h2 className="mb-2 font-semibold text-foreground text-xl">Como funciona?</h2>
        <ol className="mx-auto max-w-md list-decimal pl-6 text-left text-base text-foreground/70">
          <li>Envie uma foto do resíduo para análise.</li>
          <li>O sistema classifica automaticamente em: plástico, vidro, papel, metal ou orgânico.</li>
          <li>Receba dicas de descarte e reciclagem personalizadas.</li>
          <li>Consulte o histórico de imagens e pontos de coleta próximos.</li>
          <li>Ajude a melhorar o sistema enviando seu feedback.</li>
        </ol>
      </section>

      <footer className="mt-16 w-full text-center text-foreground/60 text-xs">
        &copy; 2025 ReciclaAI. Projeto Samsung Innovation Campus.
      </footer>
    </main>
  );
}
