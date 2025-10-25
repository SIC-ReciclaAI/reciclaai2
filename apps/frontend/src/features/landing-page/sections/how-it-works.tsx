export default function HowItWorksSection() {
  return (
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
  );
}
