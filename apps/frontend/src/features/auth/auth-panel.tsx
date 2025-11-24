'use client';

import { Loader2, LogIn, LogOut, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/auth-context';
import PredictionHistoryList from './history-list';

type AuthMode = 'login' | 'register';

export default function AuthPanel() {
  return (
    <div className="w-full space-y-4">
      <AuthCard />
      <PredictionHistoryList />
    </div>
  );
}

function AuthCard() {
  const { user, isLoading, login, register, logout } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password || (mode === 'register' && !name)) {
      toast.error('Preencha todos os campos obrigatórios.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      setEmail('');
      setPassword('');
      setName('');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Ocorreu um erro inesperado.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'register' : 'login'));
  };

  if (isLoading) {
    return (
      <Card className="flex min-h-32 items-center justify-center border-primary/20 bg-card/80 p-6 backdrop-blur">
        <Loader2 className="size-6 animate-spin text-primary" />
      </Card>
    );
  }

  if (user) {
    return (
      <Card className="border-primary/20 bg-card/80 p-6 backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm">Conectado como</p>
            <p className="font-semibold text-lg">{user.name || user.email}</p>
            <p className="text-muted-foreground text-xs">{user.email}</p>
          </div>
          <Button className="gap-2" onClick={logout} variant="outline">
            <LogOut className="size-4" />
            Sair
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-card/80 p-6 backdrop-blur">
      <div className="mb-4 flex items-center gap-2">
        {mode === 'login' ? <LogIn className="size-5 text-primary" /> : <UserPlus className="size-5 text-primary" />}
        <h3 className="font-semibold tracking-tight">
          {mode === 'login' ? 'Faça login para analisar imagens' : 'Crie sua conta gratuita'}
        </h3>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {mode === 'register' && (
          <div className="space-y-2">
            <Label htmlFor="auth-name">Nome</Label>
            <Input
              id="auth-name"
              onChange={(event) => setName(event.target.value)}
              placeholder="Maria Silva"
              required
              value={name}
            />
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="auth-email">E-mail</Label>
          <Input
            autoComplete="email"
            id="auth-email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="voce@email.com"
            required
            type="email"
            value={email}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="auth-password">Senha</Label>
          <Input
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            id="auth-password"
            minLength={6}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••"
            required
            type="password"
            value={password}
          />
        </div>
        <Button className="w-full" disabled={isSubmitting} type="submit">
          {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
          {mode === 'login' ? 'Entrar' : 'Criar conta'}
        </Button>
      </form>

      <p className="mt-3 text-center text-muted-foreground text-sm">
        {mode === 'login' ? 'Não tem conta?' : 'Já possui uma conta?'}{' '}
        <button className="text-primary underline-offset-2 hover:underline" onClick={toggleMode} type="button">
          {mode === 'login' ? 'Cadastre-se' : 'Entrar'}
        </button>
      </p>
    </Card>
  );
}


