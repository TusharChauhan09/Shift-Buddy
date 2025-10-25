"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface EditRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: {
    id: string;
    currentHostel: string;
    currentBlock?: string | null;
    currentFloor?: string | null;
    currentRoom?: string | null;
    desiredHostel: string;
    desiredBlock?: string | null;
    desiredFloor?: string | null;
    desiredRoom?: string | null;
    message?: string | null;
    status: string;
  } | null;
}

export function EditRequestModal({
  isOpen,
  onClose,
  request,
}: EditRequestModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    currentHostel: request?.currentHostel || "",
    currentBlock: request?.currentBlock || "",
    currentFloor: request?.currentFloor || "",
    currentRoom: request?.currentRoom || "",
    desiredHostel: request?.desiredHostel || "",
    desiredBlock: request?.desiredBlock || "",
    desiredFloor: request?.desiredFloor || "",
    desiredRoom: request?.desiredRoom || "",
    message: request?.message || "",
  });

  // Update form data when request changes
  useState(() => {
    if (request) {
      setFormData({
        currentHostel: request.currentHostel,
        currentBlock: request.currentBlock || "",
        currentFloor: request.currentFloor || "",
        currentRoom: request.currentRoom || "",
        desiredHostel: request.desiredHostel,
        desiredBlock: request.desiredBlock || "",
        desiredFloor: request.desiredFloor || "",
        desiredRoom: request.desiredRoom || "",
        message: request.message || "",
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Convert empty strings to null for optional fields
      const data = {
        currentHostel: formData.currentHostel.trim(),
        desiredHostel: formData.desiredHostel.trim(),
        currentBlock: formData.currentBlock.trim() || null,
        desiredBlock: formData.desiredBlock.trim() || null,
        currentFloor: formData.currentFloor.trim() || null,
        desiredFloor: formData.desiredFloor.trim() || null,
        currentRoom: formData.currentRoom.trim() || null,
        desiredRoom: formData.desiredRoom.trim() || null,
        message: formData.message.trim() || null,
      };

      const response = await fetch(`/api/requests/${request?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      console.log("Update response:", { status: response.status, result });

      if (!response.ok) {
        throw new Error(result.error || "Failed to update request");
      }

      onClose();
      router.refresh();
    } catch (err) {
      console.error("Update error:", err);
      setError(err instanceof Error ? err.message : "Failed to update request");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this request?")) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/requests/${request?.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete request");
      }

      onClose();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete request");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !request) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-card border border-border rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-semibold">Edit Request</h2>
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
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="edit-currentHostel"
                className="text-sm font-medium"
              >
                Current Hostel <span className="text-destructive">*</span>
              </label>
              <input
                id="edit-currentHostel"
                type="text"
                value={formData.currentHostel}
                onChange={(e) =>
                  setFormData({ ...formData, currentHostel: e.target.value })
                }
                placeholder="e.g., North Campus"
                required
                disabled={loading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="edit-desiredHostel"
                className="text-sm font-medium"
              >
                Desired Hostel <span className="text-destructive">*</span>
              </label>
              <input
                id="edit-desiredHostel"
                type="text"
                value={formData.desiredHostel}
                onChange={(e) =>
                  setFormData({ ...formData, desiredHostel: e.target.value })
                }
                placeholder="e.g., South Campus"
                required
                disabled={loading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="edit-currentBlock"
                className="text-sm font-medium"
              >
                Current Block (optional)
              </label>
              <input
                id="edit-currentBlock"
                type="text"
                value={formData.currentBlock}
                onChange={(e) =>
                  setFormData({ ...formData, currentBlock: e.target.value })
                }
                placeholder="e.g., A Block"
                disabled={loading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="edit-desiredBlock"
                className="text-sm font-medium"
              >
                Desired Block (optional)
              </label>
              <input
                id="edit-desiredBlock"
                type="text"
                value={formData.desiredBlock}
                onChange={(e) =>
                  setFormData({ ...formData, desiredBlock: e.target.value })
                }
                placeholder="e.g., C Block"
                disabled={loading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="edit-currentFloor"
                className="text-sm font-medium"
              >
                Current Floor (optional)
              </label>
              <input
                id="edit-currentFloor"
                type="text"
                value={formData.currentFloor}
                onChange={(e) =>
                  setFormData({ ...formData, currentFloor: e.target.value })
                }
                placeholder="e.g., 2nd Floor"
                disabled={loading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="edit-desiredFloor"
                className="text-sm font-medium"
              >
                Desired Floor (optional)
              </label>
              <input
                id="edit-desiredFloor"
                type="text"
                value={formData.desiredFloor}
                onChange={(e) =>
                  setFormData({ ...formData, desiredFloor: e.target.value })
                }
                placeholder="e.g., 3rd Floor"
                disabled={loading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="edit-currentRoom" className="text-sm font-medium">
                Current Room (optional)
              </label>
              <input
                id="edit-currentRoom"
                type="text"
                value={formData.currentRoom}
                onChange={(e) =>
                  setFormData({ ...formData, currentRoom: e.target.value })
                }
                placeholder="e.g., 101"
                disabled={loading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-desiredRoom" className="text-sm font-medium">
                Desired Room (optional)
              </label>
              <input
                id="edit-desiredRoom"
                type="text"
                value={formData.desiredRoom}
                onChange={(e) =>
                  setFormData({ ...formData, desiredRoom: e.target.value })
                }
                placeholder="e.g., 205"
                disabled={loading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="edit-message" className="text-sm font-medium">
              Message (optional)
            </label>
            <textarea
              id="edit-message"
              rows={4}
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              placeholder="Add any additional details about your request..."
              disabled={loading}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            />
          </div>

          {/* Modal Footer */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 text-destructive hover:bg-destructive/10"
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
