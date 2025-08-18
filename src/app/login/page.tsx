
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Hotel } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('demo@thelastword.com');
  const [password, setPassword] = useState('demo');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (email === 'demo@thelastword.com' && password === 'demo') {
        localStorage.setItem('isAuthenticated', 'true');
        toast({
            title: "Login Successful",
            description: "Welcome back!",
        });
        router.push('/');
      } else {
        toast({
            variant: "destructive",
            title: "Login Failed",
            description: "Invalid email or password. Please try again.",
        });
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-background font-body">
      <Card className="w-full max-w-sm shadow-soft border-primary/20">
        <form onSubmit={handleLogin}>
            <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                    <Hotel className="h-10 w-10 text-primary-foreground bg-primary p-2 rounded-lg" />
                </div>
                <CardTitle className="text-2xl font-headline">Boutique CRM</CardTitle>
                <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
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
                 <p className="text-xs text-center text-muted-foreground pt-2">
                    Use <code className="bg-muted p-1 rounded">demo@thelastword.com</code> and password <code className="bg-muted p-1 rounded">demo</code>
                </p>
            </CardContent>
            <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
            </CardFooter>
        </form>
      </Card>
    </main>
  );
}
