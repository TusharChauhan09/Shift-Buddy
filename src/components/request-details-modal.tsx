"use client";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface RequestDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: {
    id: string;
    currentHostel: string;
    desiredHostel: string;
    currentBlock?: string | null;
    desiredBlock?: string | null;
    currentFloor?: string | null;
    desiredFloor?: string | null;
    currentRoom?: string | null;
    desiredRoom?: string | null;
    message?: string | null;
    status: string;
    createdAt: string;
    user: {
      id: string;
      name?: string | null;
      registrationNumber?: string | null;
    };
  } | null;
}

export function RequestDetailsModal({
  isOpen,
  onClose,
  request,
}: RequestDetailsModalProps) {
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

  if (!isOpen || !request) return null;

  const formattedDate = new Date(request.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

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
          <h2 className="text-2xl font-semibold">Request Details</h2>
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
        <div className="p-6 space-y-6">
          {/* User Information */}
          <div className="bg-secondary/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Student Information
            </h3>
            <div className="space-y-2">
              <div className="flex items-start">
                <span className="text-sm font-medium text-muted-foreground w-32">
                  Name:
                </span>
                <span className="text-sm flex-1">
                  {request.user?.name || "Not provided"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-sm font-medium text-muted-foreground w-32">
                  Registration:
                </span>
                <span className="text-sm flex-1">
                  {request.user?.registrationNumber || "Not provided"}
                </span>
              </div>
            </div>
          </div>

          {/* Hostel Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
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
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              Swap Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Current Location
                </p>
                <p className="text-lg font-semibold">{request.currentHostel}</p>
                <div className="text-sm text-muted-foreground mt-1 space-y-0.5">
                  {request.currentBlock && <p>Block: {request.currentBlock}</p>}
                  {request.currentFloor && <p>Floor: {request.currentFloor}</p>}
                  {request.currentRoom && <p>Room: {request.currentRoom}</p>}
                </div>
              </div>
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Desired Location
                </p>
                <p className="text-lg font-semibold">{request.desiredHostel}</p>
                <div className="text-sm text-muted-foreground mt-1 space-y-0.5">
                  {request.desiredBlock && <p>Block: {request.desiredBlock}</p>}
                  {request.desiredFloor && <p>Floor: {request.desiredFloor}</p>}
                  {request.desiredRoom && <p>Room: {request.desiredRoom}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          {request.message && (
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
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
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
                Additional Message
              </h3>
              <div className="bg-secondary/50 rounded-lg p-4">
                <p className="text-sm whitespace-pre-wrap">{request.message}</p>
              </div>
            </div>
          )}

          {/* Meta Information */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Posted on {formattedDate}</span>
            </div>
            <span className="uppercase bg-secondary px-2 py-1 rounded font-medium">
              {request.status}
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-border">
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
