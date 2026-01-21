
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2 text-readease-brightBlue">
            ReadEase
          </h1>
          <p className="text-lg text-gray-600">
            Your Assistive Learning Companion
          </p>
        </div>

        <Card className="readease-card">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Welcome Back!</CardTitle>
            <CardDescription className="text-center">
              Log in to continue your learning journey
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl p-3 h-12"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-xl p-3 h-12"
                  required
                />
              </div>
              <div className="text-right">
                <a 
                  href="#" 
                  onClick={() => navigate('/forgot-password')}
                  className="text-sm text-readease-brightBlue hover:underline"
                >
                  Forgot password?
                </a>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full h-12 readease-btn-primary text-lg"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Log In"}
              </Button>
              <p className="text-center text-gray-600">
                Don't have an account?{" "}
                <a 
                  href="#" 
                  onClick={() => navigate('/register')}
                  className="text-readease-brightBlue hover:underline font-medium"
                >
                  Sign Up
                </a>
              </p>
            </CardFooter>
          </form>
        </Card>

        {/* Demo credentials */}
        <div className="mt-6 p-4 bg-readease-blue/30 rounded-xl">
          <p className="text-sm text-center">
            <span className="font-semibold">Demo credentials:</span> demo@readease.com / password
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
