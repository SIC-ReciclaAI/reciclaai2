export default function HeroSection() {
  return (
    <section className="mt-16 mb-8 flex w-full max-w-2xl flex-col items-center text-center">
      <h1 className="mb-4 flex items-center gap-x-2 font-bold font-geist-sans text-5xl text-foreground leading-tight md:text-6xl">
        ReciclaAI
      </h1>
      <p className="mx-auto mb-6 max-w-xl text-foreground/80 text-lg">
        Identifique resíduos recicláveis com IA e visão computacional. Envie uma foto, receba dicas de descarte e ajude
        o planeta!
      </p>
    </section>
  );
}
