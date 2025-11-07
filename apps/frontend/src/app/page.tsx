import ImageUploadSection from '@/features/landing-page/image-upload-section';
import FeaturesSection from '@/features/landing-page/sections/features';
import HeroSection from '@/features/landing-page/sections/hero';
import HowItWorksSection from '@/features/landing-page/sections/how-it-works';

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-start bg-background px-4 pb-16">
      {/* Subtle background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-transparent" />

      <div className="relative z-10 flex w-full flex-col items-center">
        <HeroSection />
        <ImageUploadSection />
        <FeaturesSection />
        <HowItWorksSection />

        <footer className="mt-20 w-full border-t pt-8 text-center text-foreground/50 text-xs">
          <p>&copy; 2025 ReciclaAI. Projeto Samsung Innovation Campus.</p>
          <p className="mt-2 text-foreground/40">Desenvolvido com 💚 para um planeta mais sustentável</p>
        </footer>
      </div>
    </main>
  );
}
