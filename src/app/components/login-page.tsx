import { FormEvent, useEffect, useRef, useState } from "react";
import { GraduationCap, Lock, Mail, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface AuthUser {
  email: string;
  name: string;
  picture?: string;
}

interface LoginPageProps {
  onLogin: (user: AuthUser) => void;
  mode?: "explore" | "planner";
}

type GoogleCredentialResponse = {
  credential?: string;
};

type GoogleAccounts = {
  id: {
    initialize: (config: {
      client_id: string;
      callback: (response: GoogleCredentialResponse) => void;
      auto_select?: boolean;
      cancel_on_tap_outside?: boolean;
    }) => void;
    renderButton: (
      parent: HTMLElement,
      options: {
        theme?: "outline" | "filled_blue" | "filled_black";
        size?: "large" | "medium" | "small";
        text?: "signin_with" | "signup_with" | "continue_with" | "signin";
        width?: string;
        shape?: "rectangular" | "pill" | "circle" | "square";
      },
    ) => void;
    prompt: () => void;
  };
};

declare global {
  interface Window {
    google?: {
      accounts: GoogleAccounts;
    };
  }
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return null;
    const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(normalized);
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function LoginPage({ onLogin, mode = "explore" }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [googleError, setGoogleError] = useState("");
  const [googleReady, setGoogleReady] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement | null>(null);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

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
    onLogin({
      email,
      name: email.split("@")[0] || "Student",
    });
  };

  useEffect(() => {
    if (!googleClientId) {
      setGoogleError("Google Sign-In is unavailable in this deployment. Continue with email sign-in.");
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>("script[data-google-identity='true']");

    const initializeGoogle = () => {
      if (!window.google || !googleButtonRef.current) return;

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: (response: GoogleCredentialResponse) => {
          if (!response.credential) {
            setGoogleError("Google sign-in failed. Please try again.");
            return;
          }

          const payload = decodeJwtPayload(response.credential);
          if (!payload) {
            setGoogleError("Could not read your Google account details.");
            return;
          }

          const googleEmail = typeof payload.email === "string" ? payload.email : "student@google.com";
          const googleName = typeof payload.name === "string" ? payload.name : "Google Student";
          const googlePicture = typeof payload.picture === "string" ? payload.picture : undefined;

          setGoogleError("");
          onLogin({
            email: googleEmail,
            name: googleName,
            picture: googlePicture,
          });
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      googleButtonRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        text: "continue_with",
        width: "320",
        shape: "rectangular",
      });

      setGoogleReady(true);
    };

    if (existingScript) {
      initializeGoogle();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.dataset.googleIdentity = "true";
    script.onload = () => initializeGoogle();
    script.onerror = () => setGoogleError("Unable to load Google Sign-In. Check your network and try again.");
    document.head.appendChild(script);
  }, [googleClientId, onLogin]);

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
                {mode === "planner"
                  ? "Sign in to open the AI planner and build your 4-year strategy."
                  : "Use your account to continue to the course browser."}
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
              </form>

              {(googleClientId || googleError) && (
                <>
                  <div className="my-5 flex items-center gap-3">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-xs uppercase tracking-wide text-muted-foreground">or continue with</span>
                    <div className="h-px flex-1 bg-border" />
                  </div>

                  <div className="space-y-3">
                    {googleClientId && <div ref={googleButtonRef} className="flex justify-center" />}
                    {!googleReady && !googleError && googleClientId && (
                      <p className="text-center text-sm text-muted-foreground">Loading Google Sign-In…</p>
                    )}
                    {googleError && <p className="text-center text-sm text-muted-foreground">{googleError}</p>}
                  </div>
                </>
              )}

              <div className="mt-5 flex items-center justify-between text-sm">
                <button type="button" className="text-primary hover:underline">
                  Forgot password?
                </button>
                <button type="button" className="text-primary hover:underline">
                  Create account
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
