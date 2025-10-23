import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuth } from "@/lib/auth";

export default async function Home() {
  const session = await getAuth();
  return (
    <div className="min-h-[60vh] max-w-2xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Welcome{session?.user?.name ? `, ${session.user.name}` : "!"}</CardTitle>
          <CardDescription>
            {session ? "You are signed in. Explore the features below." : "Please sign in to continue."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3">
          {session ? (
            <>
              <Link href="/hostel-change">
                <Button>Hostel Change</Button>
              </Link>
              <Link href="/profile/setup?from=/">
                <Button variant="outline">Complete/Update Profile</Button>
              </Link>
            </>
          ) : (
            <Link href="/auth/signin">
              <Button>Sign in</Button>
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
