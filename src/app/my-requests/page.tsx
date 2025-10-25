import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAuth } from "@/lib/auth";
import { MyRequestCard } from "@/components/my-request-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function getRequests() {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/requests`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      console.error("Failed to fetch requests:", res.status, res.statusText);
      return [] as any[];
    }
    const data = await res.json();
    return (data.items ?? []) as any[];
  } catch (error) {
    console.error("Error fetching requests:", error);
    return [] as any[];
  }
}

async function MyRequestsSection() {
  const session = await getAuth();
  const items = await getRequests();

  // Get only current user's requests
  const myRequests = items.filter(
    (item: any) => item.userId === session?.user?.id
  );

  if (!myRequests.length) {
    return (
      <div className="text-center text-muted-foreground py-12">
        <svg
          className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p className="text-lg font-medium mb-2">No requests yet</p>
        <p className="text-sm mb-6">
          You haven't posted any hostel swap requests
        </p>
        <Link href="/">
          <Button>Create Your First Request</Button>
        </Link>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {myRequests.map((item: any) => (
        <MyRequestCard key={item.id} item={item} />
      ))}
    </div>
  );
}

export default async function MyRequestsPage() {
  const session = await getAuth();

  if (!session) {
    redirect("/auth/signup");
  }

  const needsProfileCompletion = !session.registrationNumber;

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card text-card-foreground shadow-sm mt-2 mx-2 sm:mx-4 lg:mx-auto lg:max-w-7xl border rounded-lg backdrop-blur supports-[backdrop-filter]:bg-card/95">
        <div className="px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <Link
              href="/"
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
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
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Back</span>
              </span>
            </Link>
            <h1 className="text-base sm:text-lg md:text-xl font-semibold">
              My Requests
            </h1>
            <div className="w-16 sm:w-24"></div> {/* Spacer for alignment */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto pt-6 px-4 sm:px-6 lg:px-8">
        {needsProfileCompletion && (
          <div className="mb-6 bg-secondary border border-border rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-primary"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium">Complete Your Profile</h3>
                <div className="mt-2 text-sm text-muted-foreground">
                  <p>Complete your profile to post requests</p>
                </div>
                <div className="mt-4">
                  <Link href="/profile/setup?from=/my-requests">
                    <Button size="sm">Complete Profile</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>My Hostel Swap Requests</CardTitle>
            <CardDescription>
              View and manage all your hostel swap requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MyRequestsSection />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
