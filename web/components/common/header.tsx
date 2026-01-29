'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onSignInClick: () => void;
}

export function Header({ onSignInClick }: HeaderProps) {
  return (
    <header className="w-full max-w-3xl mx-auto flex items-center justify-between p-1 bg-background/80 backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <Image src="/logos/nexus.svg" alt="Nexus Logo" width={24} height={24} />
        <h1 className="foxnt-light text-sm text-foreground/90">Nexus</h1>
      </div>
      <Button variant="secondary" onClick={onSignInClick}>
        Entrar
      </Button>
    </header>
  );
}
