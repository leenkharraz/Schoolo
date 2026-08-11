import { Link } from "wouter";
import { GraduationCap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center p-4">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
        <GraduationCap className="h-12 w-12 text-primary" />
      </div>
      <h1 className="mb-2 text-4xl font-bold tracking-tight">404</h1>
      <h2 className="mb-6 text-2xl font-semibold">Page not found</h2>
      <p className="mb-8 max-w-md text-muted-foreground">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Button asChild className="h-11 px-8">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Link>
      </Button>
    </div>
  );
}
