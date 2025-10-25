import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ExampleImagesSection from '@/features/landing-page/sections/example-images';
import FeaturesSection from '@/features/landing-page/sections/features';
import HeroSection from '@/features/landing-page/sections/hero';
import HowItWorksSection from '@/features/landing-page/sections/how-it-works';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-background px-4 pb-16">
      <HeroSection />

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

      <ExampleImagesSection />
      <FeaturesSection />
      <HowItWorksSection />

      <footer className="mt-16 w-full text-center text-foreground/60 text-xs">
        &copy; 2025 ReciclaAI. Projeto Samsung Innovation Campus.
      </footer>
    </main>
  );
}
