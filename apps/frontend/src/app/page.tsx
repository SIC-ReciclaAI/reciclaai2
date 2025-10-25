import ImageUploadSection from '@/features/landing-page/image-upload-section';
import FeaturesSection from '@/features/landing-page/sections/features';
import HeroSection from '@/features/landing-page/sections/hero';
import HowItWorksSection from '@/features/landing-page/sections/how-it-works';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-background px-4 pb-16">
      <HeroSection />
      <ImageUploadSection />
      <FeaturesSection />
      <HowItWorksSection />

      <footer className="mt-16 w-full text-center text-foreground/60 text-xs">
        &copy; 2025 ReciclaAI. Projeto Samsung Innovation Campus.
      </footer>
    </main>
  );
}
