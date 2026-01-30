'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface SignInDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const signInWithGoogle = async () => {
  throw new Error('Google sign-in not implemented yet for Hono auth');
};

export function SignInDialog({ open, onOpenChange }: SignInDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle />
        <DialogHeader className="flex flex-col items-center text-center">
          <Image src="/logos/nexus.svg" alt="Logo" width={32} height={32} className="mb-4" priority quality={100} />
          <DialogDescription>
            Faça login para começar a conversar.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center p-4">
          <Button
            className="w-full bg-accent border hover:bg-accent/80 border-[#3f3f3f] text-foreground"
            onClick={signInWithGoogle}
          >
            <Image
              alt="Google"
              className="mr-2"
              height={16}
              src="https://www.svgrepo.com/show/353817/google-icon.svg"
              width={16}
            />
            Login com Google
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
