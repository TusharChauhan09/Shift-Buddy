import { LoadingSpinner } from "@/components/loading-spinner";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="text-center">
        <LoadingSpinner className="w-8 h-8 mx-auto mb-4" />
        <p className="text-muted-foreground">Loading authentication...</p>
      </div>
    </div>
  );
}