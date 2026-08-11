import { useState } from "react";
import { Link, useLocation } from "wouter";
import { GraduationCap } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [_, setLocation] = useLocation();
  const { updateUser } = useApp();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      updateUser({ isLoggedIn: true, name: "Parent User" });
      toast({ title: "Welcome back!", description: "Successfully logged in." });
      setLocation("/");
    }, 1000);
  };

  const handleGuest = () => {
    updateUser({ isLoggedIn: true, name: "Guest" });
    setLocation("/");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl bg-card p-8 shadow-xl border">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome to Skoolu</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Sign in to discover and compare the best schools in Saudi Arabia.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="name@example.com" required className="bg-background" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="text-xs text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input id="password" type="password" required className="bg-background" />
          </div>

          <Button type="submit" className="w-full mt-2 h-11" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
          <span className="w-full border-t border-border"></span>
          <span className="px-2">OR</span>
          <span className="w-full border-t border-border"></span>
        </div>

        <div className="mt-6 space-y-3">
          <Button variant="outline" className="w-full h-11 bg-background" onClick={handleGuest}>
            Continue as Guest
          </Button>
        </div>

        <div className="mt-8 text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
