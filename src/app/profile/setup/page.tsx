"use client";
import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function ProfileSetupForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useSearchParams();
  const [name, setName] = useState("");
  const [registrationNumber, setReg] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name ?? "");
    }
  }, [session]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/signin");
  }, [status, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, registrationNumber }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({} as { error?: string }));
        throw new Error(body?.error || "Failed to update profile");
      }
      const back = params.get("from") || "/";
      router.push(back);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[60vh] max-w-lg mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Complete your profile</CardTitle>
          <CardDescription>Please provide your name and registration number to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={onSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reg">Registration Number</Label>
              <Input id="reg" value={registrationNumber} onChange={(e) => setReg(e.target.value)} placeholder="e.g. 21XX1234" />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save and continue"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ProfileSetupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileSetupForm />
    </Suspense>
  );
}
