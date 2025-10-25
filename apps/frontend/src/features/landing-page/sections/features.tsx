import { ArrowRight, Camera, MapPin, Sparkles } from 'lucide-react';

export default function FeaturesSection() {
  return (
    <section className="mt-10 flex w-full max-w-3xl flex-col items-center justify-center gap-8 border-t pt-10 text-center md:flex-row">
      <div className="flex flex-1 flex-col items-center gap-2">
        <Camera className="mb-2 h-8 w-8 text-primary/80" />
        <h4 className="font-semibold text-foreground">Envie uma foto</h4>
        <p className="text-foreground/70 text-sm">Processamento rápido e seguro de imagens para análise de resíduos.</p>
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
        <p className="text-foreground/70 text-sm">Receba orientações de descarte e encontre locais para reciclagem.</p>
      </div>
    </section>
  );
}
