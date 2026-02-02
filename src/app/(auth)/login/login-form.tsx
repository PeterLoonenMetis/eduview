"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Loader2 } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/demo";
  const registered = searchParams.get("registered");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Ongeldige inloggegevens. Controleer je e-mail en wachtwoord.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("Er is een fout opgetreden. Probeer het opnieuw.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100">
              <GraduationCap className="h-8 w-8 text-primary-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Inloggen bij EduView</CardTitle>
          <CardDescription>
            Vul je gegevens in om toegang te krijgen tot het curriculum platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {registered && (
            <Alert variant="success" title="Registratie succesvol" className="mb-4">
              Je account is aangemaakt. Je kunt nu inloggen.
            </Alert>
          )}

          {error && (
            <Alert variant="error" title="Inloggen mislukt" className="mb-4">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="E-mailadres"
              placeholder="naam@voorbeeld.nl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <Input
              type="password"
              label="Wachtwoord"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Bezig met inloggen...
                </>
              ) : (
                "Inloggen"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Nog geen account?{" "}
              <Link href="/register" className="text-primary-600 hover:underline font-medium">
                Registreren
              </Link>
            </p>
          </div>

          {/* Demo credentials hint */}
          <div className="mt-4 p-3 bg-muted rounded-lg text-sm">
            <p className="font-medium text-muted-foreground mb-1">Demo accounts:</p>
            <p className="text-muted-foreground">admin@eduview.nl / admin123</p>
            <p className="text-muted-foreground">demo@eduview.nl / demo1234</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
