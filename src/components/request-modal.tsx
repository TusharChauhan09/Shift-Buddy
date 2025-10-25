"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  needsProfileCompletion: boolean;
}

export function RequestModal({
  isOpen,
  onClose,
  needsProfileCompletion,
}: RequestModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen, onClose]);

  // Close modal when clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      currentHostel: formData.get("currentHostel"),
      currentBlock: formData.get("currentBlock"),
      currentFloor: formData.get("currentFloor"),
      currentRoom: formData.get("currentRoom"),
      desiredHostel: formData.get("desiredHostel"),
      desiredBlock: formData.get("desiredBlock"),
      desiredFloor: formData.get("desiredFloor"),
      desiredRoom: formData.get("desiredRoom"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        // Check if error is about missing registration number
        if (
          response.status === 403 &&
          result.error?.includes("Registration number required")
        ) {
          setError(
            "Please complete your profile setup with your registration number before posting a request."
          );
          return;
        }
        throw new Error(result.error || "Failed to create request");
      }

      // Success - close modal and refresh
      onClose();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create request");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-card border border-border rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-semibold">Post a New Request</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive rounded text-destructive text-sm">
              {error}
              {error.includes("profile setup") && (
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => router.push("/profile/setup")}
                    className="text-xs underline hover:no-underline"
                  >
                    Go to Profile Setup →
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="currentHostel" className="text-sm font-medium">
                Current Hostel <span className="text-destructive">*</span>
              </label>
              <input
                id="currentHostel"
                name="currentHostel"
                type="text"
                placeholder="e.g., North Campus"
                required
                disabled={needsProfileCompletion || loading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="desiredHostel" className="text-sm font-medium">
                Desired Hostel <span className="text-destructive">*</span>
              </label>
              <input
                id="desiredHostel"
                name="desiredHostel"
                type="text"
                placeholder="e.g., South Campus"
                required
                disabled={needsProfileCompletion || loading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="currentBlock" className="text-sm font-medium">
                Current Block (optional)
              </label>
              <input
                id="currentBlock"
                name="currentBlock"
                type="text"
                placeholder="e.g., A Block"
                disabled={needsProfileCompletion || loading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="desiredBlock" className="text-sm font-medium">
                Desired Block (optional)
              </label>
              <input
                id="desiredBlock"
                name="desiredBlock"
                type="text"
                placeholder="e.g., C Block"
                disabled={needsProfileCompletion || loading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="currentFloor" className="text-sm font-medium">
                Current Floor (optional)
              </label>
              <input
                id="currentFloor"
                name="currentFloor"
                type="text"
                placeholder="e.g., 2nd Floor"
                disabled={needsProfileCompletion || loading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="desiredFloor" className="text-sm font-medium">
                Desired Floor (optional)
              </label>
              <input
                id="desiredFloor"
                name="desiredFloor"
                type="text"
                placeholder="e.g., 3rd Floor"
                disabled={needsProfileCompletion || loading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="currentRoom" className="text-sm font-medium">
                Current Room (optional)
              </label>
              <input
                id="currentRoom"
                name="currentRoom"
                type="text"
                placeholder="e.g., 101"
                disabled={needsProfileCompletion || loading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="desiredRoom" className="text-sm font-medium">
                Desired Room (optional)
              </label>
              <input
                id="desiredRoom"
                name="desiredRoom"
                type="text"
                placeholder="e.g., 205"
                disabled={needsProfileCompletion || loading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message (optional)
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              placeholder="Add any additional details about your request..."
              disabled={needsProfileCompletion || loading}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            />
          </div>

          {/* Modal Footer */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={needsProfileCompletion || loading}
              className="flex-1"
            >
              {loading
                ? "Submitting..."
                : needsProfileCompletion
                ? "Complete Profile First"
                : "Post Request"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
