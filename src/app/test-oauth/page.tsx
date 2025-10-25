"use client";
import { useEffect, useState } from "react";
import { getProviders, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestOAuthPage() {
  const [providers, setProviders] = useState<Record<string, unknown> | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProviders() {
      try {
        const availableProviders = await getProviders();
        if (process.env.NODE_ENV === "development") {
          console.log("Loaded providers:", availableProviders);
        }
        setProviders(availableProviders);
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.error("Error loading providers:", err);
        }
        setError("Failed to load providers");
      } finally {
        setLoading(false);
      }
    }
    loadProviders();
  }, []);

  const testProvider = async (providerId: string) => {
    try {
      if (process.env.NODE_ENV === "development") {
        console.log(`Testing ${providerId} provider...`);
      }
      await signIn(providerId, { callbackUrl: "/" });
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error(`${providerId} signin error:`, err);
      }
      setError(`${providerId} signin failed`);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-10">
        <Card>
          <CardContent className="p-6">
            <p>Loading OAuth providers...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>OAuth Provider Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive rounded text-destructive">
              {error}
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-2">Available Providers:</h3>
            <pre className="bg-muted p-3 rounded text-sm overflow-auto">
              {JSON.stringify(providers, null, 2)}
            </pre>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Test Providers:</h3>

            {providers && "github" in providers && (
              <Button onClick={() => testProvider("github")} className="w-full">
                Test GitHub OAuth
              </Button>
            )}

            {providers && "azure-ad" in providers && (
              <Button
                onClick={() => testProvider("azure-ad")}
                className="w-full"
              >
                Test Microsoft OAuth
              </Button>
            )}

            {providers && "credentials" in providers && (
              <Button
                onClick={() => testProvider("credentials")}
                variant="outline"
                className="w-full"
              >
                Test Credentials
              </Button>
            )}

            {(!providers ||
              (!("github" in providers) && !("azure-ad" in providers))) && (
              <div className="p-3 bg-secondary border border-border rounded text-foreground">
                No OAuth providers found. Check your environment variables.
              </div>
            )}
          </div>

          <div>
            <h3 className="font-semibold mb-2">Environment Check:</h3>
            <div className="text-sm space-y-1">
              <div>
                NEXTAUTH_URL:{" "}
                {process.env.NEXT_PUBLIC_NEXTAUTH_URL || "Not set"}
              </div>
              <div>NODE_ENV: {process.env.NODE_ENV}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
