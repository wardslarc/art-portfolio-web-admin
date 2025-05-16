import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onGoogleLogin: () => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

const LoginForm = ({
  onLogin,
  onGoogleLogin,
  isLoading = false,
  error = null,
}: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email.trim()) {
      setFormError("Email is required");
      return;
    }

    if (!password.trim()) {
      setFormError("Password is required");
      return;
    }

    try {
      await onLogin(email, password);
    } catch {
      setFormError("Login failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[350px] bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Artist Portfolio Admin
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          {(error || formError) && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error || formError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="space-y-2">
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>

          <div className="my-2 text-center text-sm text-muted-foreground">OR</div>

          <Button
            variant="outline"
            className="w-full flex items-center justify-center space-x-2"
            onClick={onGoogleLogin}
            disabled={isLoading}
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                fill="#4285F4"
                d="M23.64 12.204a10.09 10.09 0 0 0-.153-1.89H12.25v3.58h6.41a5.48 5.48 0 0 1-2.377 3.6v2.98h3.84c2.256-2.07 3.555-5.15 3.555-8.27z"
              />
              <path
                fill="#34A853"
                d="M12.25 24c3.24 0 5.963-1.073 7.95-2.91l-3.84-2.97c-1.07.72-2.43 1.15-4.11 1.15a7.02 7.02 0 0 1-6.62-4.9H1.575v3.07A12 12 0 0 0 12.25 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.63 14.37a7.205 7.205 0 0 1 0-4.73V6.57H1.575a12 12 0 0 0 0 10.86z"
              />
              <path
                fill="#EA4335"
                d="M12.25 4.77c1.77 0 3.35.61 4.6 1.8l3.45-3.45A11.92 11.92 0 0 0 12.25 0a12 12 0 0 0-10.67 6.57l4.05 3.13a7.11 7.11 0 0 1 6.57-5.1z"
              />
            </svg>
            <span>Sign in with Google</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;
