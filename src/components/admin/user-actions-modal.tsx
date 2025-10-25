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

interface User {
  id: string;
  name: string | null;
  email: string | null;
  registrationNumber: string | null;
  phoneNumber: string | null;
  isAdmin: boolean;
  isBanned?: boolean;
  timeoutUntil?: Date | null;
  createdAt: Date;
}

interface UserActionsModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function UserActionsModal({
  user,
  isOpen,
  onClose,
  onSuccess,
}: UserActionsModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeoutMinutes, setTimeoutMinutes] = useState<number>(60);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen) return null;

  const isTimedOut =
    user.timeoutUntil && new Date(user.timeoutUntil) > new Date();

  const handleAction = async (action: string, timeoutDuration?: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, timeoutDuration }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update user");
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
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete user");
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
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>Manage User: {user.name || "Unknown"}</CardTitle>
          <CardDescription>
            {user.email} • {user.registrationNumber || "No Reg"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}

          {/* User Status */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Current Status</h3>
            <div className="flex flex-wrap gap-2">
              {user.isAdmin && (
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                  Admin
                </span>
              )}
              {user.isBanned && (
                <span className="px-2 py-1 bg-destructive/10 text-destructive text-xs rounded">
                  Banned
                </span>
              )}
              {isTimedOut && (
                <span className="px-2 py-1 bg-orange-500/10 text-orange-500 text-xs rounded">
                  Timed Out Until{" "}
                  {new Date(user.timeoutUntil!).toLocaleString()}
                </span>
              )}
              {!user.isBanned && !isTimedOut && (
                <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded">
                  Active
                </span>
              )}
            </div>
          </div>

          {/* Ban/Unban */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Ban Actions</h3>
            {user.isBanned ? (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleAction("unban")}
                disabled={loading}
              >
                {loading ? "Processing..." : "Unban User"}
              </Button>
            ) : (
              <Button
                variant="outline"
                className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => handleAction("ban")}
                disabled={loading}
              >
                {loading ? "Processing..." : "Ban User"}
              </Button>
            )}
          </div>

          {/* Timeout */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Timeout Actions</h3>
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="timeout-minutes" className="text-xs">
                  Minutes
                </Label>
                <Input
                  id="timeout-minutes"
                  type="number"
                  min="1"
                  value={timeoutMinutes}
                  onChange={(e) => setTimeoutMinutes(Number(e.target.value))}
                  className="h-9"
                />
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => handleAction("timeout", timeoutMinutes)}
                  disabled={loading}
                  className="h-9"
                >
                  {loading ? "..." : "Timeout"}
                </Button>
              </div>
            </div>
            {isTimedOut && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleAction("removeTimeout")}
                disabled={loading}
              >
                {loading ? "Processing..." : "Remove Timeout"}
              </Button>
            )}
            <p className="text-xs text-muted-foreground">
              Quick: 1 min, 5 min, 60 min (1 hr), 1440 min (1 day)
            </p>
          </div>

          {/* Delete User */}
          <div className="space-y-2 pt-4 border-t">
            <h3 className="font-semibold text-sm text-destructive">
              Danger Zone
            </h3>
            {!showDeleteConfirm ? (
              <Button
                variant="outline"
                className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete User
              </Button>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  Are you sure? This will permanently delete the user and all
                  their requests. This action cannot be undone.
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

          {/* Close Button */}
          <Button variant="ghost" className="w-full" onClick={onClose}>
            Close
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
