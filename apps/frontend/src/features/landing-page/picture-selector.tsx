import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function HeroPictureSelector() {
  return (
    <>
      <div className="mb-4 flex h-28 w-28 items-center justify-center overflow-hidden rounded-lg border-2 border-primary/20 bg-muted">
        {/* Mock image preview */}
        <Camera className="h-12 w-12 text-primary/60" />
      </div>

      <Label className="mb-2 w-full cursor-pointer" htmlFor="image-upload">
        <Button asChild className="flex w-full items-center gap-2 font-semibold" size="lg" variant="default">
          <span>
            <Camera className="h-4 w-4" /> Enviar foto
          </span>
        </Button>
      </Label>

      <Input accept="image/*" className="sr-only" id="image-upload" name="image-upload" type="file" />

      <p className="text-foreground/60 text-sm">O processo de classificação pode demorar até 5 minutos.</p>
    </>
  );
}
