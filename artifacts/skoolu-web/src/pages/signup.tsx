import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { GraduationCap, ArrowRight, ArrowLeft } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  city: z.string().min(1, "City is required"),
  childrenCount: z.coerce.number().min(1).max(5),
  budgetRange: z.string().min(1, "Budget is required"),
  curriculum: z.string().min(1, "Curriculum is required"),
  schoolType: z.string().min(1, "School type is required"),
  maxDistance: z.string().min(1, "Distance preference is required"),
  specialNeeds: z.boolean().default(false),
  activities: z.array(z.string()).default([]),
});

const ACTIVITIES = ["Football", "Swimming", "Basketball", "Robotics", "Art", "Drama", "Debate", "Music", "Quran", "Science", "MUN", "Chess"];

export default function Signup() {
  const [_, setLocation] = useLocation();
  const { updateUser } = useApp();
  const [step, setStep] = useState(1);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "", phone: "", email: "", password: "", city: "",
      childrenCount: 1, budgetRange: "", curriculum: "", schoolType: "",
      maxDistance: "", specialNeeds: false, activities: [],
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Map form values to app state
    let budgetMax = 40000;
    if (values.budgetRange === "Under 30K") budgetMax = 30000;
    else if (values.budgetRange === "30-60K") budgetMax = 60000;
    else if (values.budgetRange === "60-90K") budgetMax = 90000;
    else if (values.budgetRange === "90K+") budgetMax = 120000;

    let distanceMax = 10;
    if (values.maxDistance === "2km") distanceMax = 2;
    else if (values.maxDistance === "5km") distanceMax = 5;
    else if (values.maxDistance === "20km") distanceMax = 20;
    else if (values.maxDistance === "Any") distanceMax = 50;

    updateUser({
      name: values.name,
      email: values.email,
      phone: values.phone,
      city: values.city,
      childrenCount: values.childrenCount,
      budgetMax,
      preferredCurriculum: values.curriculum,
      preferredSchoolType: values.schoolType,
      distanceMax,
      specialNeeds: values.specialNeeds,
      preferredActivities: values.activities,
      isLoggedIn: true,
      hasCompletedOnboarding: false,
    });

    setLocation("/onboarding");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-2xl bg-card p-6 shadow-xl border md:p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Create your account</h1>
          <div className="mt-4 flex w-full items-center justify-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`h-1.5 w-12 rounded-full ${step >= s ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* STEP 1: Account & Location */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-lg font-semibold border-b pb-2">Account Details</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="+966 50 000 0000" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="name@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>

                <h2 className="text-lg font-semibold border-b pb-2 mt-6">Location & Family</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField control={form.control} name="city" render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="Riyadh">Riyadh</SelectItem>
                          <SelectItem value="Jeddah">Jeddah</SelectItem>
                          <SelectItem value="Dammam">Dammam</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="childrenCount" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Children</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select count" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {[1,2,3,4,5].map(n => <SelectItem key={n} value={n.toString()}>{n}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </div>
            )}

            {/* STEP 2: Preferences */}
            {step === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-lg font-semibold border-b pb-2">School Preferences</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField control={form.control} name="budgetRange" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Annual Budget Range</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select budget" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="Under 30K">Under 30,000 SAR</SelectItem>
                          <SelectItem value="30-60K">30,000 - 60,000 SAR</SelectItem>
                          <SelectItem value="60-90K">60,000 - 90,000 SAR</SelectItem>
                          <SelectItem value="90K+">90,000+ SAR</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="curriculum" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Curriculum</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select curriculum" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="Any">Any</SelectItem>
                          <SelectItem value="American">American</SelectItem>
                          <SelectItem value="British">British</SelectItem>
                          <SelectItem value="IB">IB</SelectItem>
                          <SelectItem value="Saudi National">Saudi National</SelectItem>
                          <SelectItem value="Indian">Indian</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="schoolType" render={({ field }) => (
                    <FormItem>
                      <FormLabel>School Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="Any">Any</SelectItem>
                          <SelectItem value="Private">Private</SelectItem>
                          <SelectItem value="International">International</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="maxDistance" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Distance</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select distance" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="2km">Within 2 km</SelectItem>
                          <SelectItem value="5km">Within 5 km</SelectItem>
                          <SelectItem value="10km">Within 10 km</SelectItem>
                          <SelectItem value="20km">Within 20 km</SelectItem>
                          <SelectItem value="Any">Any distance</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                
                <FormField control={form.control} name="specialNeeds" render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mt-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Special Needs Support</FormLabel>
                      <p className="text-sm text-muted-foreground">Only show schools with dedicated SEN facilities.</p>
                    </div>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  </FormItem>
                )} />
              </div>
            )}

            {/* STEP 3: Activities */}
            {step === 3 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-lg font-semibold border-b pb-2">Extracurricular Activities</h2>
                <p className="text-sm text-muted-foreground">Select activities your children are interested in to help us match you with the best schools.</p>
                
                <FormField control={form.control} name="activities" render={() => (
                  <FormItem>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {ACTIVITIES.map((item) => (
                        <FormField key={item} control={form.control} name="activities" render={({ field }) => {
                          return (
                            <FormItem key={item} className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 shadow-sm bg-background">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, item])
                                      : field.onChange(field.value?.filter((value) => value !== item))
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal text-sm cursor-pointer">{item}</FormLabel>
                            </FormItem>
                          )
                        }} />
                      ))}
                    </div>
                  </FormItem>
                )} />
              </div>
            )}

            <div className="flex justify-between pt-4">
              {step > 1 ? (
                <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
              ) : (
                <Button type="button" variant="ghost" asChild>
                  <Link href="/login">Cancel</Link>
                </Button>
              )}
              
              {step < 3 ? (
                <Button type="button" onClick={() => {
                  const fieldsToValidate = step === 1 
                    ? ["name", "phone", "email", "password", "city"] 
                    : ["budgetRange", "curriculum", "schoolType", "maxDistance"];
                  
                  // @ts-ignore
                  form.trigger(fieldsToValidate).then(isValid => {
                    if (isValid) setStep(step + 1);
                  });
                }}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit">Complete Sign Up</Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
