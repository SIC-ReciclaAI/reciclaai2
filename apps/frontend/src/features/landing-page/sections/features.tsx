import { ArrowRight, Camera, MapPin, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function FeaturesSection() {
  return (
    <section className="mt-16 flex w-full max-w-5xl flex-col items-center justify-center gap-6 border-t pt-16 text-center md:flex-row">
      <Card className="group fade-in slide-in-from-bottom-4 flex flex-1 animate-in flex-col items-center gap-3 border-primary/10 bg-gradient-to-br from-card to-card/50 p-6 backdrop-blur-sm transition-all duration-300 duration-700 hover:border-primary/30 hover:shadow-xl">
        <div className="flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 transition-transform duration-300 group-hover:scale-110">
          <Camera className="h-8 w-8 text-primary" />
        </div>
        <h4 className="font-bold text-foreground text-lg">Envie uma foto</h4>
        <p className="text-foreground/60 text-sm leading-relaxed">
          Processamento rápido e seguro de imagens para análise de resíduos.
        </p>
      </Card>

      <span className="mx-2 hidden animate-pulse text-primary/40 md:inline-flex">
        <ArrowRight className="h-6 w-6" />
      </span>

      <Card className="group fade-in slide-in-from-bottom-5 flex flex-1 animate-in flex-col items-center gap-3 border-primary/10 bg-gradient-to-br from-card to-card/50 p-6 backdrop-blur-sm transition-all duration-300 duration-700 hover:border-primary/30 hover:shadow-xl">
        <div className="flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 transition-transform duration-300 group-hover:scale-110">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <h4 className="font-bold text-foreground text-lg">Classificação automática</h4>
        <p className="text-foreground/60 text-sm leading-relaxed">
          IA identifica o tipo de material: plástico, vidro, papel, metal ou orgânico.
        </p>
      </Card>

      <span className="mx-2 hidden animate-pulse text-primary/40 md:inline-flex">
        <ArrowRight className="h-6 w-6" />
      </span>

      <Card className="group fade-in slide-in-from-bottom-6 flex flex-1 animate-in flex-col items-center gap-3 border-primary/10 bg-gradient-to-br from-card to-card/50 p-6 backdrop-blur-sm transition-all duration-300 duration-700 hover:border-primary/30 hover:shadow-xl">
        <div className="flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 transition-transform duration-300 group-hover:scale-110">
          <MapPin className="h-8 w-8 text-primary" />
        </div>
        <h4 className="font-bold text-foreground text-lg">Dicas e pontos de coleta</h4>
        <p className="text-foreground/60 text-sm leading-relaxed">
          Receba orientações de descarte e encontre locais para reciclagem.
        </p>
      </Card>
    </section>
  );
}
