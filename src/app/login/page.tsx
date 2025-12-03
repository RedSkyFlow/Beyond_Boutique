
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Hotel } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';


export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('demo@thelastword.com');
  const [password, setPassword] = useState('demo');
  const [isLoading, setIsLoading] = useState(false);

  const [isLogin, setIsLogin] = useState(true);
  const { signIn, signUp } = useAuth();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
      } else {
        await signUp(email, password);
        toast({
          title: "Account Created",
          description: "You are now logged in.",
        });
      }
      router.push('/');
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: isLogin ? "Login Failed" : "Sign Up Failed",
        description: error.message || "An error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-background font-body">
      <Card className="w-full max-w-sm shadow-soft border-primary/20">
        <form onSubmit={handleAuth}>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Hotel className="h-10 w-10 text-primary-foreground bg-primary p-2 rounded-lg" />
            </div>
            <CardTitle className="text-2xl font-headline">Beyond Boutique</CardTitle>
            <CardDescription>
              {isLogin ? 'Enter your credentials to access the dashboard.' : 'Create an account to get started.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="manager@hotel.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (isLogin ? 'Signing in...' : 'Signing up...') : (isLogin ? 'Sign In' : 'Sign Up')}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full text-sm"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
