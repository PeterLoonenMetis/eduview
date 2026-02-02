"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Loader2 } from "lucide-react";
import { registerUser } from "@/app/actions/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Wachtwoorden komen niet overeen.");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Wachtwoord moet minimaal 8 tekens zijn.");
      setIsLoading(false);
      return;
    }

    try {
      const result = await registerUser(formData);

      if (result.error) {
        setError(result.error);
      } else {
        router.push("/login?registered=true");
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
          <CardTitle className="text-2xl">Account aanmaken</CardTitle>
          <CardDescription>
            Maak een account aan om toegang te krijgen tot EduView
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="error" title="Registratie mislukt" className="mb-4">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="firstName"
                label="Voornaam"
                placeholder="Jan"
                required
                autoComplete="given-name"
              />
              <Input
                name="lastName"
                label="Achternaam"
                placeholder="Jansen"
                required
                autoComplete="family-name"
              />
            </div>
            <Input
              type="email"
              name="email"
              label="E-mailadres"
              placeholder="naam@voorbeeld.nl"
              required
              autoComplete="email"
            />
            <Input
              type="password"
              name="password"
              label="Wachtwoord"
              placeholder="Minimaal 8 tekens"
              required
              autoComplete="new-password"
            />
            <Input
              type="password"
              name="confirmPassword"
              label="Wachtwoord bevestigen"
              placeholder="Herhaal je wachtwoord"
              required
              autoComplete="new-password"
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Bezig met registreren...
                </>
              ) : (
                "Account aanmaken"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Heb je al een account?{" "}
              <Link href="/login" className="text-primary-600 hover:underline font-medium">
                Inloggen
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
