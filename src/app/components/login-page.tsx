import { FormEvent, useState } from "react";
import { GraduationCap, Lock, Mail, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setError("");
    onLogin();
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-muted/40 to-background px-4 py-10 md:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <section className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm text-primary">
              <Sparkles className="h-4 w-4" />
              Summer College Courses 2026
            </div>
            <h1 className="text-4xl text-primary md:text-5xl">Welcome back</h1>
            <p className="text-muted-foreground text-lg">
              Sign in to explore summer college classes, save favorites, and plan your accelerated path.
            </p>
            <div className="grid gap-3 text-sm">
              <div className="rounded-lg border bg-card p-3">✓ Personalized course picks</div>
              <div className="rounded-lg border bg-card p-3">✓ Quick enrollment tracking</div>
              <div className="rounded-lg border bg-card p-3">✓ College-credit planning tools</div>
            </div>
          </section>

          <Card className="border-primary/20 shadow-xl shadow-primary/10">
            <CardHeader className="space-y-3">
              <div className="mx-auto rounded-xl bg-primary/10 p-3">
                <GraduationCap className="h-7 w-7 text-primary" />
              </div>
              <CardTitle className="text-center text-2xl text-primary">Student Login</CardTitle>
              <CardDescription className="text-center">
                Use your account to continue to the course browser.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="student@email.com"
                      className="h-11 pl-10"
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
                      className="h-11 pl-10"
                      autoComplete="current-password"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    className="h-4 w-4 rounded border-primary/40 accent-primary"
                  />
                  Keep me signed in on this device
                </label>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button type="submit" className="h-11 w-full">
                  Sign In
                </Button>

                <div className="flex items-center justify-between text-sm">
                  <button type="button" className="text-primary hover:underline">
                    Forgot password?
                  </button>
                  <button type="button" className="text-primary hover:underline">
                    Create account
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
