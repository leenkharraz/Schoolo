import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { GraduationCap, MapPin, Calculator, Sparkles } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";

export default function Onboarding() {
  const [_, setLocation] = useLocation();
  const { user, updateUser } = useApp();
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (step !== 3) return;
    const timer = setTimeout(() => {
      updateUser({ hasCompletedOnboarding: true });
      setLocation("/");
    }, 2000);
    return () => clearTimeout(timer);
  }, [step, setLocation, updateUser]);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md rounded-2xl bg-card p-8 shadow-xl border text-center animate-in zoom-in-95 duration-500">
        
        {step === 1 && (
          <div className="space-y-6">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <MapPin className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">Welcome to Skoolu, {user.name.split(' ')[0]}!</h1>
              <p className="text-muted-foreground">
                We're setting up your profile for schools in <span className="font-semibold text-foreground">{user.city}</span>.
              </p>
            </div>
            <Button onClick={handleNext} className="w-full h-11 text-lg">Confirm Location</Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right-8">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-secondary/10">
              <Calculator className="h-10 w-10 text-secondary" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">Personalizing Results</h1>
              <p className="text-muted-foreground">
                Filtering for <span className="font-semibold text-foreground">{user.preferredCurriculum}</span> curriculum within a budget of <span className="font-semibold text-foreground">{user.budgetMax.toLocaleString()} SAR</span>.
              </p>
            </div>
            <Button onClick={handleNext} className="w-full h-11 text-lg">Looks Good</Button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in zoom-in-95">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary">
              <Sparkles className="h-12 w-12 text-primary-foreground animate-pulse" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">Your matches are ready!</h1>
              <p className="text-muted-foreground">
                We've found the best schools for your family.
              </p>
            </div>
            <div className="pt-4 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
