import { redirect } from "next/navigation";
import Link from "next/link";
import { getAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

async function getDashboardData() {
  try {
    const [users, requests] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          registrationNumber: true,
          phoneNumber: true,
          isAdmin: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.request.findMany({
        include: {
          user: {
            select: {
              name: true,
              email: true,
              registrationNumber: true,
              phoneNumber: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    return { users, requests };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return { users: [], requests: [] };
  }
}

export default async function DashboardPage() {
  const session = await getAuth();

  // Check if user is authenticated
  if (!session) {
    redirect("/auth/signin");
  }

  // Check if user is admin
  if (!session.isAdmin) {
    redirect("/");
  }

  const { users, requests } = await getDashboardData();

  // Calculate statistics
  const totalUsers = users.length;
  const totalRequests = requests.length;
  const adminUsers = users.filter((u) => u.isAdmin).length;
  const usersWithCompleteProfile = users.filter(
    (u) => u.registrationNumber && u.phoneNumber
  ).length;

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
                {session.user?.name}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto pt-6 px-4 sm:px-6 lg:px-8 pb-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
                      <div className="text-xs text-muted-foreground text-right whitespace-nowrap">
                        {new Date(request.createdAt).toLocaleDateString()}
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
                      <div className="text-xs text-muted-foreground">
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
