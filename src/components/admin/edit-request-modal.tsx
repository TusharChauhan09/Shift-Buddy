"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RequestData {
  id: string;
  currentHostel: string;
  currentBlock: string | null;
  currentFloor: string | null;
  currentRoom: string | null;
  desiredHostel: string;
  desiredBlock: string | null;
  desiredFloor: string | null;
  desiredRoom: string | null;
  message: string | null;
  createdAt: Date;
  user: {
    name: string | null;
    email: string | null;
    registrationNumber: string | null;
    phoneNumber: string | null;
  };
}

interface EditRequestModalProps {
  request: RequestData;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditRequestModal({
  request,
  isOpen,
  onClose,
  onSuccess,
}: EditRequestModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [formData, setFormData] = useState({
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

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/requests/${request.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update request");
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/requests/${request.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete request");
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>Edit Swap Request</CardTitle>
          <CardDescription>
            User: {request.user.name || "Unknown"} •{" "}
            {request.user.registrationNumber || "No Reg"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Current Hostel Section */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Current Hostel</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="currentHostel" className="text-xs">
                    Hostel Name *
                  </Label>
                  <Input
                    id="currentHostel"
                    value={formData.currentHostel}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        currentHostel: e.target.value,
                      })
                    }
                    required
                    className="h-9"
                  />
                </div>
                <div>
                  <Label htmlFor="currentBlock" className="text-xs">
                    Block
                  </Label>
                  <Input
                    id="currentBlock"
                    value={formData.currentBlock}
                    onChange={(e) =>
                      setFormData({ ...formData, currentBlock: e.target.value })
                    }
                    className="h-9"
                  />
                </div>
                <div>
                  <Label htmlFor="currentFloor" className="text-xs">
                    Floor
                  </Label>
                  <Input
                    id="currentFloor"
                    value={formData.currentFloor}
                    onChange={(e) =>
                      setFormData({ ...formData, currentFloor: e.target.value })
                    }
                    className="h-9"
                  />
                </div>
                <div>
                  <Label htmlFor="currentRoom" className="text-xs">
                    Room
                  </Label>
                  <Input
                    id="currentRoom"
                    value={formData.currentRoom}
                    onChange={(e) =>
                      setFormData({ ...formData, currentRoom: e.target.value })
                    }
                    className="h-9"
                  />
                </div>
              </div>
            </div>

            {/* Desired Hostel Section */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Desired Hostel</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="desiredHostel" className="text-xs">
                    Hostel Name *
                  </Label>
                  <Input
                    id="desiredHostel"
                    value={formData.desiredHostel}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        desiredHostel: e.target.value,
                      })
                    }
                    required
                    className="h-9"
                  />
                </div>
                <div>
                  <Label htmlFor="desiredBlock" className="text-xs">
                    Block
                  </Label>
                  <Input
                    id="desiredBlock"
                    value={formData.desiredBlock}
                    onChange={(e) =>
                      setFormData({ ...formData, desiredBlock: e.target.value })
                    }
                    className="h-9"
                  />
                </div>
                <div>
                  <Label htmlFor="desiredFloor" className="text-xs">
                    Floor
                  </Label>
                  <Input
                    id="desiredFloor"
                    value={formData.desiredFloor}
                    onChange={(e) =>
                      setFormData({ ...formData, desiredFloor: e.target.value })
                    }
                    className="h-9"
                  />
                </div>
                <div>
                  <Label htmlFor="desiredRoom" className="text-xs">
                    Room
                  </Label>
                  <Input
                    id="desiredRoom"
                    value={formData.desiredRoom}
                    onChange={(e) =>
                      setFormData({ ...formData, desiredRoom: e.target.value })
                    }
                    className="h-9"
                  />
                </div>
              </div>
            </div>

            {/* Message */}
            <div>
              <Label htmlFor="message" className="text-xs">
                Message
              </Label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full min-h-[80px] px-3 py-2 text-sm rounded-md border border-input bg-background"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>

          {/* Delete Request */}
          <div className="mt-6 pt-4 border-t space-y-2">
            <h3 className="font-semibold text-sm text-destructive">
              Delete Request
            </h3>
            {!showDeleteConfirm ? (
              <Button
                variant="outline"
                className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete Request
              </Button>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  Are you sure? This will permanently delete this swap request.
                  This action cannot be undone.
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={handleDelete}
                    disabled={loading}
                  >
                    {loading ? "Deleting..." : "Yes, Delete"}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
