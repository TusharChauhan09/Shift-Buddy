"use client";
import { useEffect, useState } from "react";
import { getProviders } from "next-auth/react";

export function OAuthDebug() {
  const [providers, setProviders] = useState<Record<string, unknown> | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProviders() {
      try {
        const availableProviders = await getProviders();
        setProviders(availableProviders);
        if (process.env.NODE_ENV === "development") {
          console.log("Available providers:", availableProviders);
        }
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("Error loading providers:", error);
        }
      } finally {
        setLoading(false);
      }
    }
    loadProviders();
  }, []);

  if (loading)
    return (
      <div className="text-xs text-muted-foreground">Loading providers...</div>
    );

  return (
    <div className="text-xs text-muted-foreground mt-2">
      <details>
        <summary className="cursor-pointer">Debug: Available Providers</summary>
        <pre className="mt-1 text-xs bg-muted p-2 rounded overflow-auto max-h-32">
          {JSON.stringify(providers, null, 2)}
        </pre>
      </details>
    </div>
  );
}
