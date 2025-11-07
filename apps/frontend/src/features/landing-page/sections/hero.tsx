import { Sparkles } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="mt-16 mb-8 flex w-full max-w-2xl flex-col items-center text-center">
      <div className="fade-in slide-in-from-top-3 mb-6 inline-flex animate-in items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 backdrop-blur-sm duration-700">
        <Sparkles className="size-4 text-primary" />
        <span className="font-medium text-primary text-sm">Tecnologia de IA avançada</span>
      </div>
      <h1 className="fade-in slide-in-from-top-4 mb-4 flex animate-in items-center gap-x-2 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text font-bold font-geist-sans text-5xl text-transparent leading-tight duration-1000 md:text-6xl">
        ReciclaAI
      </h1>
      <p className="fade-in slide-in-from-top-5 mx-auto mb-6 max-w-xl animate-in text-foreground/70 text-lg leading-relaxed duration-1000">
        Identifique resíduos recicláveis com{' '}
        <span className="font-semibold text-primary">IA e visão computacional</span>. Envie uma foto, receba dicas de
        descarte e ajude o planeta! 🌍
      </p>
    </section>
  );
}
