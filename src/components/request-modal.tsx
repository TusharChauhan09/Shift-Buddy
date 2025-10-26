"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  needsProfileCompletion: boolean;
  userName?: string | null;
}

export function RequestModal({
  isOpen,
  onClose,
  needsProfileCompletion,
  userName,
}: RequestModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentHostel, setCurrentHostel] = useState("");
  const [desiredHostel, setDesiredHostel] = useState("");
  const [hostelType, setHostelType] = useState<"BH" | "GH" | null>(null);
  const [currentHostelNumber, setCurrentHostelNumber] = useState<string | null>(
    null
  );
  const [desiredHostelNumber, setDesiredHostelNumber] = useState<string | null>(
    null
  );
  const modalRef = useRef<HTMLDivElement>(null);

  // Update currentHostel when type and number are selected
  useEffect(() => {
    if (hostelType && currentHostelNumber) {
      setCurrentHostel(`${hostelType}-${currentHostelNumber}`);
    } else {
      setCurrentHostel("");
    }
  }, [hostelType, currentHostelNumber]);

  // Update desiredHostel when type and number are selected
  useEffect(() => {
    if (hostelType && desiredHostelNumber) {
      setDesiredHostel(`${hostelType}-${desiredHostelNumber}`);
    } else {
      setDesiredHostel("");
    }
  }, [hostelType, desiredHostelNumber]);

  // Generate default message based on hostels
  const defaultMessage =
    currentHostel && desiredHostel
      ? `Hi! I am ${
          userName || "a student"
        } and I want to shift from ${currentHostel} to ${desiredHostel}. I am looking for someone who wants to shift from ${desiredHostel} to ${currentHostel}. Let's swap!`
      : "";

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
      roomType: formData.get("roomType"),
      seater: formData.get("seater"),
    };

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        // Check if error is about missing profile fields
        if (
          response.status === 403 &&
          (result.error?.includes("registration number") ||
            result.error?.includes("phone number"))
        ) {
          setError(result.error);
          return;
        }
        // Check if error is about request limit
        if (
          response.status === 403 &&
          result.error?.includes("2 active requests")
        ) {
          setError(
            "You already have 2 active requests. Please delete one of your existing requests from 'My Requests' before creating a new one."
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
            className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
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
              {(error.includes("profile") ||
                error.includes("registration number") ||
                error.includes("phone number")) && (
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => router.push("/profile/setup")}
                    className="text-xs underline hover:no-underline cursor-pointer"
                  >
                    Go to Profile Setup →
                  </button>
                </div>
              )}
              {error.includes("2 active requests") && (
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => router.push("/my-requests")}
                    className="text-xs underline hover:no-underline cursor-pointer"
                  >
                    Go to My Requests →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Hostel Type Selection - BH or GH */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Hostel Type <span className="text-destructive">*</span>
            </label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={hostelType === "BH" ? "default" : "outline"}
                onClick={() => {
                  setHostelType(hostelType === "BH" ? null : "BH");
                  setCurrentHostelNumber(null);
                  setDesiredHostelNumber(null);
                }}
                disabled={needsProfileCompletion || loading}
                className="flex-1 h-10"
              >
                Boys Hostel (BH)
              </Button>
              <Button
                type="button"
                variant={hostelType === "GH" ? "default" : "outline"}
                onClick={() => {
                  setHostelType(hostelType === "GH" ? null : "GH");
                  setCurrentHostelNumber(null);
                  setDesiredHostelNumber(null);
                }}
                disabled={needsProfileCompletion || loading}
                className="flex-1 h-10"
              >
                Girls Hostel (GH)
              </Button>
            </div>
          </div>

          {/* AC/Non-AC and Seater Selection */}
          {hostelType && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="roomType" className="text-sm font-medium">
                  Room Type <span className="text-destructive">*</span>
                </label>
                <select
                  id="roomType"
                  name="roomType"
                  required
                  disabled={needsProfileCompletion || loading}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select Room Type</option>
                  <option value="AC">AC</option>
                  <option value="Non-AC">Non-AC</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="seater" className="text-sm font-medium">
                  Seater <span className="text-destructive">*</span>
                </label>
                <select
                  id="seater"
                  name="seater"
                  required
                  disabled={needsProfileCompletion || loading}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select Seater</option>
                  <option value="1">1 Seater (Single)</option>
                  <option value="2">2 Seater (Double Sharing)</option>
                  <option value="3">3 Seater (Triple Sharing)</option>
                  <option value="4">4 Seater (Four Sharing)</option>
                  <option value="5">5 Seater (Five Sharing)</option>
                </select>
              </div>
            </div>
          )}

          {/* Show hostel number selection only after type is selected */}
          {hostelType && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Current Hostel Number */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Current Hostel <span className="text-destructive">*</span>
                  </label>
                  <div className="space-y-2">
                    <div className="grid grid-cols-5 gap-1.5">
                      {[...Array(10)].map((_, i) => {
                        const num = (i + 1).toString();
                        return (
                          <Button
                            key={num}
                            type="button"
                            size="sm"
                            variant={
                              currentHostelNumber === num
                                ? "default"
                                : "outline"
                            }
                            onClick={() => setCurrentHostelNumber(num)}
                            disabled={needsProfileCompletion || loading}
                            className="h-9 p-0"
                          >
                            {num}
                          </Button>
                        );
                      })}
                    </div>

                    {/* Display selected hostel */}
                    {currentHostel && (
                      <div className="text-sm text-muted-foreground bg-secondary px-3 py-2 rounded-md">
                        Selected:{" "}
                        <span className="font-medium text-foreground">
                          {currentHostel}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Desired Hostel Number */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Desired Hostel <span className="text-destructive">*</span>
                  </label>
                  <div className="space-y-2">
                    <div className="grid grid-cols-5 gap-1.5">
                      {[...Array(10)].map((_, i) => {
                        const num = (i + 1).toString();
                        return (
                          <Button
                            key={num}
                            type="button"
                            size="sm"
                            variant={
                              desiredHostelNumber === num
                                ? "default"
                                : "outline"
                            }
                            onClick={() => setDesiredHostelNumber(num)}
                            disabled={needsProfileCompletion || loading}
                            className="h-9 p-0"
                          >
                            {num}
                          </Button>
                        );
                      })}
                    </div>

                    {/* Display selected hostel */}
                    {desiredHostel && (
                      <div className="text-sm text-muted-foreground bg-secondary px-3 py-2 rounded-md">
                        Selected:{" "}
                        <span className="font-medium text-foreground">
                          {desiredHostel}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Hidden inputs to hold the values */}
              <input
                type="hidden"
                name="currentHostel"
                value={currentHostel}
                required
              />
              <input
                type="hidden"
                name="desiredHostel"
                value={desiredHostel}
                required
              />
            </>
          )}

          {!hostelType && (
            <div className="text-sm text-muted-foreground text-center py-4 bg-secondary/50 rounded-md">
              Please select a hostel type (BH or GH) to continue
            </div>
          )}

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
              defaultValue={defaultMessage}
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
