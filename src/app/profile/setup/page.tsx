"use client";
import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Feedback Card Component
function FeedbackCard() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit feedback");
      }

      setSuccess(true);
      setSubject("");
      setMessage("");
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to submit feedback"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Us / Feedback</CardTitle>
        <CardDescription>
          Have questions or feedback? Send us a message and we&apos;ll get back
          to you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {success ? (
          <div className="p-6 text-center">
            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-1">Feedback Sent!</h3>
            <p className="text-sm text-muted-foreground">
              Thank you for your feedback. We&apos;ll review it shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief description of your feedback"
                maxLength={100}
                required
              />
              <p className="text-xs text-muted-foreground text-right">
                {subject.length}/100
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Your detailed feedback or question..."
                maxLength={1000}
                required
                rows={6}
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <p className="text-xs text-muted-foreground text-right">
                {message.length}/1000
              </p>
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive rounded text-destructive text-sm">
                {error}
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Sending..." : "Send Feedback"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

function ProfileSetupForm() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const params = useSearchParams();
  const [name, setName] = useState("");
  const [registrationNumber, setReg] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasExistingData, setHasExistingData] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name ?? "");
      // Type assertion for custom session fields
      const customSession = session as any;
      setReg(customSession.registrationNumber ?? "");
      setPhoneNumber(customSession.phoneNumber ?? "");

      // Check if user already has some data
      if (customSession.registrationNumber || customSession.phoneNumber) {
        setHasExistingData(true);
      }
    }
  }, [session]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/signup");
  }, [status, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, registrationNumber, phoneNumber }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({} as { error?: string }));
        throw new Error(body?.error || "Failed to update profile");
      }

      // Update the session with new data
      await update();

      const back = params.get("from") || "/";
      router.push(back);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setLoading(false);
    }
  }

  const backUrl = params.get("from") || "/";

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header with Back Button */}
      <header className="sticky top-0 z-40 bg-card text-card-foreground shadow-sm mt-2 mx-2 sm:mx-4 lg:mx-auto lg:max-w-6xl border rounded-lg backdrop-blur supports-[backdrop-filter]:bg-card/95">
        <div className="px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <Link
              href={backUrl}
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors cursor-pointer"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="font-medium text-sm sm:text-base">
                <span className="hidden sm:inline">Back</span>
              </span>
            </Link>
            <h1 className="text-base sm:text-lg md:text-xl font-semibold">
              {hasExistingData ? "Edit Profile" : "Complete Profile"}
            </h1>
            <div className="w-16 sm:w-20"></div> {/* Spacer for alignment */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto pt-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side - Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle>
                {hasExistingData
                  ? "Edit your profile"
                  : "Complete your profile"}
              </CardTitle>
              <CardDescription>
                {hasExistingData
                  ? "Update your profile information below."
                  : "Please provide your details to continue."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4" onSubmit={onSubmit}>
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="reg">Registration Number</Label>
                    {registrationNumber && (
                      <span className="text-xs text-muted-foreground">
                        Current: {registrationNumber}
                      </span>
                    )}
                  </div>
                  <Input
                    id="reg"
                    value={registrationNumber}
                    onChange={(e) => setReg(e.target.value)}
                    placeholder={
                      registrationNumber
                        ? "Enter new registration number"
                        : "e.g. 21XX1234"
                    }
                  />
                  {registrationNumber && (
                    <p className="text-xs text-muted-foreground">
                      Leave unchanged to keep current value
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="phone">Phone Number</Label>
                    {phoneNumber && (
                      <span className="text-xs text-muted-foreground">
                        Current: {phoneNumber}
                      </span>
                    )}
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder={
                      phoneNumber
                        ? "Enter new phone number"
                        : "e.g. +1234567890"
                    }
                  />
                  {phoneNumber && (
                    <p className="text-xs text-muted-foreground">
                      Leave unchanged to keep current value
                    </p>
                  )}
                </div>

                {error && (
                  <div className="p-3 bg-destructive/10 border border-destructive rounded text-destructive text-sm">
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <Link href={backUrl} className="flex-1">
                    <Button type="button" variant="outline" className="w-full">
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading
                      ? "Saving..."
                      : hasExistingData
                      ? "Save Changes"
                      : "Save and Continue"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Right Side - Contact Us / Feedback */}
          <FeedbackCard />
        </div>
      </div>
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
