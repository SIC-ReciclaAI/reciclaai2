import { Card } from '@/components/ui/card';
import HeroPictureSelector from '@/features/landing-page/picture-selector';
import ExampleImagesSection from '@/features/landing-page/sections/example-images';
import FeaturesSection from '@/features/landing-page/sections/features';
import HeroSection from '@/features/landing-page/sections/hero';
import HowItWorksSection from '@/features/landing-page/sections/how-it-works';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-background px-4 pb-16">
      <HeroSection />

      <Card className="mt-4 flex w-full max-w-md flex-col items-center bg-card p-8 text-foreground shadow-lg">
        <HeroPictureSelector />
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
