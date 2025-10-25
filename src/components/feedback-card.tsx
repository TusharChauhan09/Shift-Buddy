"use client";

import { useState } from "react";
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

export function FeedbackCard() {
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
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Contact Us</CardTitle>
        <CardDescription className="text-xs">
          Send us your feedback or questions
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        {success ? (
          <div className="py-4 text-center">
            <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg
                className="w-5 h-5 text-green-500"
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
            <h3 className="text-base font-semibold mb-1">Sent!</h3>
            <p className="text-xs text-muted-foreground">
              We&apos;ll review your feedback shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="feedback-subject" className="text-xs">
                Subject
              </Label>
              <Input
                id="feedback-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief description"
                maxLength={100}
                required
                className="h-8 text-sm"
              />
              <p className="text-xs text-muted-foreground text-right">
                {subject.length}/100
              </p>
            </div>

            <div className="space-y-1">
              <Label htmlFor="feedback-message" className="text-xs">
                Message
              </Label>
              <textarea
                id="feedback-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Your feedback or question..."
                maxLength={1000}
                required
                rows={3}
                className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <p className="text-xs text-muted-foreground text-right">
                {message.length}/1000
              </p>
            </div>

            {error && (
              <div className="p-2 bg-destructive/10 border border-destructive rounded text-destructive text-xs">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-8 text-sm"
            >
              {loading ? "Sending..." : "Send Feedback"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
