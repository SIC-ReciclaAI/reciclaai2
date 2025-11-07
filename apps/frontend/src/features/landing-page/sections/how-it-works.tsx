import { Card } from '@/components/ui/card';

export default function HowItWorksSection() {
  const steps = [
    'Envie uma foto do resíduo para análise',
    'O sistema classifica automaticamente em: plástico, vidro, papel, metal ou orgânico',
    'Receba dicas de descarte e reciclagem personalizadas',
    'Consulte o histórico de imagens e pontos de coleta próximos',
    'Ajude a melhorar o sistema enviando seu feedback'
  ];

  return (
    <section className="fade-in slide-in-from-bottom mt-20 w-full max-w-3xl animate-in border-t pt-16 text-center duration-1000">
      <h2 className="mb-8 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text font-bold text-2xl text-transparent">
        Como funciona?
      </h2>
      <Card className="border-primary/10 bg-gradient-to-br from-card to-card/50 p-8 backdrop-blur-sm">
        <ol className="space-y-4 text-left">
          {steps.map((step, index) => (
            <li className="group flex items-start gap-4 transition-all duration-300 hover:translate-x-1" key={index}>
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 font-bold text-primary-foreground text-sm shadow-lg transition-transform duration-300 group-hover:scale-110">
                {index + 1}
              </span>
              <span className="pt-1 text-foreground/80 text-sm leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </Card>
    </section>
  );
}
