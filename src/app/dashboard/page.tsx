"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserActionsModal } from "@/components/admin/user-actions-modal";
import { EditRequestModal } from "@/components/admin/edit-request-modal";
import { LoadingSpinner } from "@/components/loading-spinner";

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

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<unknown>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<RequestData | null>(
    null
  );

  const loadData = async () => {
    try {
      // Get session
      const { getSession } = await import("next-auth/react");
      const sessionData = await getSession();

      if (!sessionData) {
        router.push("/auth/signin");
        return;
      }

      // @ts-expect-error - isAdmin is added to session in auth config
      if (!sessionData.isAdmin) {
        router.push("/");
        return;
      }

      setSession(sessionData);

      // Fetch dashboard data
      const response = await fetch("/api/admin/dashboard");
      const data = await response.json();

      setUsers(data.users || []);
      setRequests(data.requests || []);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner className="w-8 h-8" />
      </div>
    );
  }

  // Calculate statistics
  const totalUsers = users.length;
  const totalRequests = requests.length;
  const adminUsers = users.filter((u) => u.isAdmin).length;
  const usersWithCompleteProfile = users.filter(
    (u) => u.registrationNumber && u.phoneNumber
  ).length;
  const bannedUsers = users.filter((u) => u.isBanned).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card text-card-foreground shadow-sm mt-2 mx-2 sm:mx-4 lg:mx-auto lg:max-w-7xl border rounded-lg backdrop-blur supports-[backdrop-filter]:bg-card/95">
        <div className="px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-primary/80"
                >
                  ← Back
                </Button>
              </Link>
              <h1 className="text-base sm:text-lg md:text-xl font-semibold">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm text-muted-foreground">
                {(session as { user?: { name?: string } })?.user?.name}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto pt-6 px-4 sm:px-6 lg:px-8 pb-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Users</CardDescription>
              <CardTitle className="text-3xl">{totalUsers}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Requests</CardDescription>
              <CardTitle className="text-3xl">{totalRequests}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Admin Users</CardDescription>
              <CardTitle className="text-3xl">{adminUsers}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Complete Profiles</CardDescription>
              <CardTitle className="text-3xl">
                {usersWithCompleteProfile}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Banned Users</CardDescription>
              <CardTitle className="text-3xl">{bannedUsers}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* All Requests Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>All Hostel Swap Requests</CardTitle>
            <CardDescription>
              View all swap requests from all users
            </CardDescription>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No requests found
              </p>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div
                    key={request.id}
                    className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">
                              {request.user.name || "Unknown User"}
                            </h3>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <p>{request.user.email}</p>
                              {request.user.registrationNumber && (
                                <p>Reg: {request.user.registrationNumber}</p>
                              )}
                              {request.user.phoneNumber && (
                                <p>Phone: {request.user.phoneNumber}</p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                          <div className="bg-card border rounded-md p-3">
                            <p className="text-xs text-muted-foreground mb-1">
                              Current Hostel
                            </p>
                            <p className="font-medium">
                              {request.currentHostel}
                              {request.currentBlock &&
                                ` - ${request.currentBlock}`}
                            </p>
                            {request.currentFloor && (
                              <p className="text-sm text-muted-foreground">
                                Floor: {request.currentFloor}
                              </p>
                            )}
                            {request.currentRoom && (
                              <p className="text-sm text-muted-foreground">
                                Room: {request.currentRoom}
                              </p>
                            )}
                          </div>
                          <div className="bg-card border rounded-md p-3">
                            <p className="text-xs text-muted-foreground mb-1">
                              Desired Hostel
                            </p>
                            <p className="font-medium">
                              {request.desiredHostel}
                              {request.desiredBlock &&
                                ` - ${request.desiredBlock}`}
                            </p>
                            {request.desiredFloor && (
                              <p className="text-sm text-muted-foreground">
                                Floor: {request.desiredFloor}
                              </p>
                            )}
                            {request.desiredRoom && (
                              <p className="text-sm text-muted-foreground">
                                Room: {request.desiredRoom}
                              </p>
                            )}
                          </div>
                        </div>
                        {request.message && (
                          <div className="mt-3">
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium">Message:</span>{" "}
                              {request.message}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <div className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedRequest(request)}
                          className="h-8 text-xs"
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* All Users Section */}
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>
              Manage users and view their information
            </CardDescription>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No users found
              </p>
            ) : (
              <div className="space-y-3">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">
                            {user.name || "No Name"}
                          </h3>
                          {user.isAdmin && (
                            <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded">
                              Admin
                            </span>
                          )}
                          {user.isBanned && (
                            <span className="px-2 py-0.5 bg-destructive/10 text-destructive text-xs font-medium rounded">
                              Banned
                            </span>
                          )}
                          {user.timeoutUntil &&
                            new Date(user.timeoutUntil) > new Date() && (
                              <span className="px-2 py-0.5 bg-orange-500/10 text-orange-500 text-xs font-medium rounded">
                                Timeout
                              </span>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                        <div className="flex flex-wrap gap-3 mt-2 text-sm">
                          {user.registrationNumber ? (
                            <span className="text-muted-foreground">
                              Reg: {user.registrationNumber}
                            </span>
                          ) : (
                            <span className="text-muted-foreground/60">
                              No Reg Number
                            </span>
                          )}
                          {user.phoneNumber ? (
                            <span className="text-muted-foreground">
                              Phone: {user.phoneNumber}
                            </span>
                          ) : (
                            <span className="text-muted-foreground/60">
                              No Phone
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <div className="text-xs text-muted-foreground">
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedUser(user)}
                          className="h-8 text-xs"
                        >
                          Manage
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Modals */}
      {selectedUser && (
        <UserActionsModal
          user={selectedUser}
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          onSuccess={() => {
            setSelectedUser(null);
            loadData();
          }}
        />
      )}

      {selectedRequest && (
        <EditRequestModal
          request={selectedRequest}
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onSuccess={() => {
            setSelectedRequest(null);
            loadData();
          }}
        />
      )}
    </div>
  );
}
