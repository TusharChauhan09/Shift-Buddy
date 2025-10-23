import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-2">
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="text-foreground/70">The page you’re looking for doesn’t exist.</p>
      <Link href="/" className="underline underline-offset-4">Go back home</Link>
    </div>
  );
}
