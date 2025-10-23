import { getAuth } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function HostelChangePage() {
  const session = await getAuth();
  // middleware ensures session and profile completeness
  return (
    <div className="max-w-2xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Hostel Change Request</CardTitle>
          <CardDescription>Submit your request to change your hostel. We will notify you once it is reviewed.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm">Name</label>
              <input disabled className="border rounded px-3 py-2" defaultValue={session?.user?.name ?? ""} />
            </div>
            <div className="grid gap-2">
              <label className="text-sm">Registration Number</label>
              <input disabled className="border rounded px-3 py-2" defaultValue={session?.registrationNumber ?? ""} />
            </div>
            <div className="grid gap-2">
              <label className="text-sm">Current Hostel</label>
              <input className="border rounded px-3 py-2" placeholder="e.g. A Block" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm">Desired Hostel</label>
              <input className="border rounded px-3 py-2" placeholder="e.g. C Block" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm">Reason</label>
              <textarea className="border rounded px-3 py-2" placeholder="Briefly explain why you need to change" rows={4} />
            </div>
            <Button type="submit">Submit request</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
