import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAuth } from "@/lib/auth";
import { Navbar } from "@/components/navbar";
import { RequestsCard } from "@/components/requests-card";
import { FilteredRequests } from "@/components/filtered-requests";
import { FeedbackCard } from "@/components/feedback-card";

async function getRequests() {
  try {
    // Use absolute URL for server-side fetching
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

async function RequestsSection() {
  const session = await getAuth();
  const items = await getRequests();

  // Filter out current user's own requests
  const otherUsersRequests = items.filter(
    (item: any) => item.userId !== session?.user?.id
  );

  return <FilteredRequests items={otherUsersRequests} />;
}

function CreateRequestForm({ disabled }: { disabled?: boolean }) {
  return (
    <form action="/api/requests" method="post" className="mt-6 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          name="currentHostel"
          placeholder="Current hostel"
          required
          disabled={disabled}
        />
        <input
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          name="desiredHostel"
          placeholder="Desired hostel"
          required
          disabled={disabled}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <select
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          name="roomType"
          required
          disabled={disabled}
        >
          <option value="">Select Room Type *</option>
          <option value="AC">AC</option>
          <option value="Non-AC">Non-AC</option>
        </select>
        <select
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          name="seater"
          required
          disabled={disabled}
        >
          <option value="">Select Seater *</option>
          <option value="1">1 Seater (Single)</option>
          <option value="2">2 Seater (Double Sharing)</option>
          <option value="3">3 Seater (Triple Sharing)</option>
          <option value="4">4 Seater (Four Sharing)</option>
          <option value="5">5 Seater (Five Sharing)</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          name="currentRoom"
          placeholder="Current room (optional)"
          disabled={disabled}
        />
        <input
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          name="desiredRoom"
          placeholder="Desired room (optional)"
          disabled={disabled}
        />
      </div>
      <textarea
        className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        name="message"
        placeholder="Message (optional)"
        disabled={disabled}
      />
      <div>
        <Button type="submit" disabled={disabled}>
          Post request
        </Button>
      </div>
    </form>
  );
}

export default async function Home() {
  const session = await getAuth();

  // This page is now protected by middleware, so session should always exist
  if (!session) {
    // Middleware should protect this route, but redirect as a safe fallback
    redirect("/auth/signup");
  }
  const auth = session as NonNullable<typeof session>;

  const needsProfileCompletion = !auth.registrationNumber || !auth.phoneNumber;

  return (
    <div className="min-h-screen bg-background text-foreground pb-8">
      {/* Header */}
      <Navbar
        userName={auth.user?.name}
        userImage={auth.user?.image}
        userEmail={auth.user?.email}
        registrationNumber={auth.registrationNumber}
        phoneNumber={auth.phoneNumber}
        isAdmin={auth.isAdmin}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto pt-6 px-4 sm:px-6 lg:px-8">
        {/* Profile Completion Alert */}
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
                  <p>
                    You need to complete your profile to access all features.
                  </p>
                </div>
                <div className="mt-4">
                  <Link href="/profile/setup?from=/">
                    <Button size="sm">Complete Profile</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Hostel Requests Quick Action */}
          <RequestsCard
            needsProfileCompletion={needsProfileCompletion}
            userName={auth.user?.name}
          />

          {/* Quick Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
              <CardDescription>Current profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <span className="font-medium">Name:</span>{" "}
                {auth.user?.name || "Not set"}
              </div>
              <div className="text-sm">
                <span className="font-medium">Email:</span>{" "}
                {auth.user?.email || "Not set"}
              </div>
              <div className="text-sm">
                <span className="font-medium">Registration:</span>{" "}
                {auth.registrationNumber || "Not set"}
              </div>
            </CardContent>
          </Card>

          {/* Contact Us / Feedback Card */}
          <FeedbackCard />
        </div>

        {/* Hostel Swap Requests */}
        <div id="requests" className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Hostel Swap Requests</CardTitle>
              <CardDescription>
                View all hostel swap requests from students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RequestsSection />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
