import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import type { School } from "@/data/schools";
import { 
  ArrowLeft, MapPin, Star, Heart, Share, Calendar, Users, 
  BookOpen, Globe, Award, CheckCircle2, ChevronRight, Calculator,
  Accessibility, Bus, Info
} from "lucide-react";
import { getSchoolById, calculateFitScore } from "@/data/schools";
import { getSchoolImagePath } from "@/data/schoolImages";
import { getReviews, getReviewSummary } from "@/data/reviews";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import NotFound from "./not-found";

export default function SchoolDetail() {
  const [match, params] = useRoute("/schools/:id");
  const { user, favorites, toggleFavorite, addToLastSeen, addBooking } = useApp();
  const { toast } = useToast();
  
  const [feeMode, setFeeMode] = useState<"annual" | "term" | "monthly">("annual");
  const [siblingsCount, setSiblingsCount] = useState([1]);
  const [bookingType, setBookingType] = useState<"visit" | "placement_test">("visit");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");

  const id = params?.id;
  const school = id ? getSchoolById(id) : undefined;
  const isFavorite = id ? favorites.includes(id) : false;

  useEffect(() => {
    if (id) {
      addToLastSeen(id);
      window.scrollTo(0, 0);
    }
  }, [id, addToLastSeen]);

  if (!school) return <NotFound />;

  const fitScore = calculateFitScore(school, {
    city: user.city,
    budgetMax: user.budgetMax,
    preferredCurriculum: user.preferredCurriculum,
    distanceMax: user.distanceMax,
    specialNeeds: user.specialNeeds,
    preferredLanguage: user.preferredLanguage
  });

  const reviews = getReviews(school.id);
  const reviewSummary = getReviewSummary(school.id, school.rating);

  let scoreColor = "text-red-500";
  let scoreBg = "bg-red-500";
  if (fitScore >= 80) { scoreColor = "text-green-500"; scoreBg = "bg-green-500"; }
  else if (fitScore >= 60) { scoreColor = "text-orange-500"; scoreBg = "bg-orange-500"; }

  const feeMultiplier = feeMode === "annual" ? 1 : feeMode === "term" ? 3 : 10;
  const formatFee = (amount: number) => Math.round(amount / feeMultiplier).toLocaleString();

  const baseTuition = school.fees.tuition;
  const discountAmount = school.siblingsDiscount ? (baseTuition * (school.siblingsDiscountPercent / 100)) : 0;
  const totalDiscount = discountAmount * siblingsCount[0];
  const siblingTotal = (baseTuition * (siblingsCount[0] + 1)) - totalDiscount;

  const handleBook = () => {
    if (!bookingDate || !bookingTime) {
      toast({ title: "Error", description: "Please select a date and time.", variant: "destructive" });
      return;
    }
    
    addBooking({
      id: Math.random().toString(36).substring(7),
      schoolId: school.id,
      schoolName: school.name,
      type: bookingType,
      date: bookingDate,
      time: bookingTime,
      status: "upcoming",
      createdAt: Date.now()
    });
    
    toast({ 
      title: "Booking Confirmed", 
      description: `Your ${bookingType === 'visit' ? 'visit' : 'placement test'} at ${school.name} is scheduled.` 
    });
  };

  const scheduleSlots = [
    { date: "Sun 11 May", time: "09:00 AM", available: true },
    { date: "Mon 12 May", time: "10:00 AM", available: true },
    { date: "Mon 12 May", time: "02:00 PM", available: true },
    { date: "Wed 14 May", time: "09:30 AM", available: true },
    { date: "Thu 15 May", time: "10:00 AM", available: true },
  ];

  return (
    <div className="pb-20 md:pb-0">
      {/* Header Nav */}
      <div className="sticky top-0 z-20 flex items-center justify-between bg-card/80 px-4 py-3 backdrop-blur-md border-b md:hidden">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => toggleFavorite(school.id)}>
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-destructive text-destructive" : ""}`} />
          </Button>
          <Button variant="ghost" size="icon"><Share className="h-5 w-5" /></Button>
        </div>
      </div>

      {/* Image Gallery (CSS Scroll Snap) */}
      <div className="relative h-64 md:h-96 w-full md:rounded-2xl overflow-hidden md:mt-4">
        <div className="flex h-full w-full snap-x snap-mandatory overflow-x-auto no-scrollbar">
          {school.images.map((img, idx) => (
            <div key={idx} className="h-full w-full shrink-0 snap-center">
              <img 
                src={getSchoolImagePath(img)} 
                alt={`${school.name} - Image ${idx + 1}`} 
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
        <div className="absolute bottom-4 right-4 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
          Swipe for more
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 mt-6 lg:grid-cols-3">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Header Info */}
          <div className="px-4 md:px-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none">{school.type}</Badge>
              <Badge variant="secondary" className="bg-secondary/10 text-secondary-foreground hover:bg-secondary/20 border-none">{school.curriculum}</Badge>
              {school.specialNeeds && (
                <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 gap-1">
                  <Accessibility className="h-3 w-3" /> SEN Support
                </Badge>
              )}
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold leading-tight text-foreground">{school.name}</h1>
            <p className="text-lg text-muted-foreground font-arabic mt-1" dir="rtl">{school.nameAr}</p>
            
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <MapPin className="mr-1 h-4 w-4" />
                {school.location.district}, {school.location.city} ({school.location.distance}km away)
              </div>
              <div className="flex items-center">
                <Star className="mr-1 h-4 w-4 fill-primary text-primary" />
                <span className="font-medium text-foreground">{school.rating}</span>
                <span className="ml-1">({school.totalRatings} reviews)</span>
              </div>
            </div>
          </div>

          <Separator className="mx-4 md:mx-0 w-auto" />

          {/* Quick Facts Grid */}
          <div className="px-4 md:px-0 grid grid-cols-2 md:grid-cols-4 gap-4">
            <FactItem icon={Users} label="Students" value={`${school.studentCount}+`} />
            <FactItem icon={BookOpen} label="Grades" value={school.grades} />
            <FactItem icon={Calendar} label="Established" value={school.established.toString()} />
            <FactItem icon={Globe} label="Languages" value={school.languages.slice(0, 2).join(", ")} />
          </div>

          {/* About */}
          <div className="px-4 md:px-0 space-y-4">
            <h2 className="text-xl font-bold">About</h2>
            <p className="text-muted-foreground leading-relaxed">{school.description}</p>
          </div>

          {/* Tabs: Fees | Facilities | Reviews */}
          <div className="px-4 md:px-0">
            <Tabs defaultValue="fees" className="w-full">
              <TabsList className="w-full grid grid-cols-3 mb-6">
                <TabsTrigger value="fees">Fees & Value</TabsTrigger>
                <TabsTrigger value="facilities">Facilities</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="fees" className="space-y-6 animate-in fade-in">
                <div className="flex items-center justify-between rounded-xl border bg-card p-1">
                  <div className="flex w-full">
                    {["annual", "term", "monthly"].map((mode) => (
                      <button
                        key={mode}
                        className={`flex-1 rounded-lg py-2 text-sm font-medium capitalize transition-colors ${
                          feeMode === mode ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                        }`}
                        onClick={() => setFeeMode(mode as any)}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border bg-card p-6 shadow-sm">
                  <div className="space-y-4">
                    <FeeRow label="Tuition" amount={formatFee(school.fees.tuition)} isTotal={false} />
                    <FeeRow label="Registration (One-time)" amount={formatFee(school.fees.registration)} isTotal={false} />
                    <FeeRow label="Uniform Estimate" amount={formatFee(school.fees.uniform)} isTotal={false} />
                    <FeeRow label="Transport (Optional)" amount={formatFee(school.fees.transport)} isTotal={false} />
                    <FeeRow label="Activities" amount={formatFee(school.fees.activities)} isTotal={false} />
                    <Separator />
                    <FeeRow label="Total Estimate" amount={formatFee(school.fees.totalEstimate)} isTotal={true} />
                  </div>
                </div>

                {school.siblingsDiscount && (
                  <div className="rounded-xl border border-green-200 bg-green-50 p-6 dark:bg-green-900/10 dark:border-green-900">
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/50">
                        <Calculator className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-green-900 dark:text-green-400">Siblings Discount Calculator</h3>
                        <p className="text-sm text-green-700 dark:text-green-500 mb-4">
                          Enjoy a {school.siblingsDiscountPercent}% discount on tuition for each additional sibling.
                        </p>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-green-900 dark:text-green-400">Number of additional siblings</span>
                            <span className="font-bold text-green-700 dark:text-green-500">{siblingsCount[0]}</span>
                          </div>
                          <Slider 
                            value={siblingsCount} 
                            onValueChange={setSiblingsCount} 
                            max={4} 
                            min={1} 
                            step={1}
                            className="[&_[role=slider]]:border-green-500 [&_[role=slider]]:bg-white [&>.relative>.absolute]:bg-green-500 [&>.relative]:bg-green-200" 
                          />
                          
                          <div className="mt-4 rounded-lg bg-white/60 p-4 dark:bg-black/20">
                            <div className="flex justify-between mb-1 text-sm">
                              <span className="text-muted-foreground">Original Tuition (x{siblingsCount[0] + 1})</span>
                              <span className="line-through">{((siblingsCount[0] + 1) * baseTuition).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between mb-2 text-sm">
                              <span className="text-green-600">Total Discount</span>
                              <span className="font-medium text-green-600">-{totalDiscount.toLocaleString()}</span>
                            </div>
                            <Separator className="my-2 bg-green-200 dark:bg-green-800" />
                            <div className="flex justify-between font-bold">
                              <span>New Total Tuition</span>
                              <span>{siblingTotal.toLocaleString()} SAR</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="facilities" className="space-y-6 animate-in fade-in">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Campus Facilities</h3>
                  <div className="flex flex-wrap gap-2">
                    {school.facilities.map(f => (
                      <Badge key={f} variant="secondary" className="bg-muted px-3 py-1 text-sm font-normal">{f}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Extracurriculars</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {school.extracurriculars.map(e => (
                      <div key={e} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary/70" /> {e}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="rounded-xl border bg-card p-4 space-y-3 mt-4">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-full p-2 ${school.busService ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"}`}>
                      <Bus className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Bus Service</p>
                      <p className="text-xs text-muted-foreground">{school.busService ? "Available across major districts" : "Not provided by school"}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6 animate-in fade-in">
                {/* Summary */}
                <div className="flex flex-col md:flex-row gap-6 items-center rounded-xl border bg-card p-6 shadow-sm">
                  <div className="flex flex-col items-center text-center md:border-r md:pr-6">
                    <span className="text-4xl font-bold">{reviewSummary.overall.toFixed(1)}</span>
                    <div className="flex text-primary my-1">
                      {[1,2,3,4,5].map(i => <Star key={i} className={`h-4 w-4 ${i <= Math.round(reviewSummary.overall) ? 'fill-primary' : 'fill-muted text-muted'}`} />)}
                    </div>
                    <span className="text-sm text-muted-foreground">Based on {reviewSummary.totalCount} reviews</span>
                  </div>
                  
                  <div className="flex-1 w-full space-y-2">
                    {reviewSummary.breakdown.map((b) => (
                      <div key={b.stars} className="flex items-center gap-3 text-sm">
                        <span className="w-4">{b.stars}</span>
                        <Star className="h-3 w-3 fill-muted-foreground text-muted-foreground" />
                        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${(b.count / reviewSummary.totalCount) * 100}%` }} />
                        </div>
                        <span className="w-6 text-right text-muted-foreground">{b.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* List */}
                <div className="space-y-4">
                  {reviews.map(r => (
                    <div key={r.id} className="rounded-xl border bg-card p-5">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                            {r.authorInitials}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{r.authorName}</p>
                            <p className="text-xs text-muted-foreground">{r.date}</p>
                          </div>
                        </div>
                        <div className="flex">
                          {[1,2,3,4,5].map(i => <Star key={i} className={`h-3 w-3 ${i <= r.rating ? 'fill-primary text-primary' : 'fill-muted text-muted'}`} />)}
                        </div>
                      </div>
                      <h4 className="font-semibold mt-3 mb-1">{r.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{r.body}</p>
                      {r.tags && r.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {r.tags.map(t => <Badge key={t} variant="outline" className="text-[10px] font-normal">{t}</Badge>)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Sidebar Column (Sticky on Desktop) */}
        <div className="hidden lg:block relative">
          <div className="sticky top-24 space-y-6">
            
            {/* Fit Score Card */}
            <div className="rounded-xl border bg-card p-6 shadow-sm text-center">
              <h3 className="font-semibold text-sm text-muted-foreground mb-4">YOUR FIT SCORE</h3>
              <div className="relative mx-auto flex h-32 w-32 items-center justify-center rounded-full border-8 border-muted">
                <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50" cy="50" r="46"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray="289.026"
                    strokeDashoffset={289.026 - (289.026 * fitScore) / 100}
                    className={`transition-all duration-1000 ${scoreColor}`}
                  />
                </svg>
                <div className="flex flex-col items-center">
                  <span className={`text-3xl font-bold ${scoreColor}`}>{Math.round(fitScore)}</span>
                  <span className="text-xs text-muted-foreground">% Match</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Based on your budget, location, and curriculum preferences.
              </p>
            </div>

            {/* Actions Card */}
            <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full h-12 text-base">Schedule a Visit</Button>
                </DialogTrigger>
                <BookingDialogContent 
                  school={school} 
                  type="visit" 
                  scheduleSlots={scheduleSlots}
                  date={bookingDate} setDate={setBookingDate}
                  time={bookingTime} setTime={setBookingTime}
                  onConfirm={() => { setBookingType("visit"); handleBook(); }}
                />
              </Dialog>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full h-12 text-base bg-background">Book Placement Test</Button>
                </DialogTrigger>
                <BookingDialogContent 
                  school={school} 
                  type="placement_test" 
                  scheduleSlots={scheduleSlots}
                  date={bookingDate} setDate={setBookingDate}
                  time={bookingTime} setTime={setBookingTime}
                  onConfirm={() => { setBookingType("placement_test"); handleBook(); }}
                />
              </Dialog>
              
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1 bg-background" onClick={() => toggleFavorite(school.id)}>
                  <Heart className={`mr-2 h-4 w-4 ${isFavorite ? "fill-destructive text-destructive" : ""}`} /> 
                  {isFavorite ? "Saved" : "Save"}
                </Button>
                <Button variant="outline" className="flex-1 bg-background">
                  <Share className="mr-2 h-4 w-4" /> Share
                </Button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
              <h3 className="font-semibold">Contact & Registration</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Registration Opens</span>
                  <span className="font-medium">{school.registrationOpenDate}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Phone</span>
                  <a href={`tel:${school.contact.phone}`} className="font-medium text-primary hover:underline">{school.contact.phone}</a>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Email</span>
                  <a href={`mailto:${school.contact.email}`} className="font-medium text-primary hover:underline truncate ml-4">{school.contact.email}</a>
                </div>
                {school.contact.website && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Website</span>
                    <a href={`https://${school.contact.website}`} target="_blank" rel="noreferrer" className="font-medium text-primary hover:underline truncate ml-4">{school.contact.website}</a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Fixed Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t bg-card p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:hidden pb-safe">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full h-12 text-base">Book Visit / Test</Button>
          </DialogTrigger>
          <BookingDialogContent 
            school={school} 
            type="visit" 
            scheduleSlots={scheduleSlots}
            date={bookingDate} setDate={setBookingDate}
            time={bookingTime} setTime={setBookingTime}
            onConfirm={() => { setBookingType("visit"); handleBook(); }}
          />
        </Dialog>
      </div>
    </div>
  );
}

function FeeRow({ label, amount, isTotal }: { label: string; amount: string; isTotal: boolean }) {
  return (
    <div className={`flex justify-between items-center ${isTotal ? "pt-2 text-base font-bold" : "text-sm"}`}>
      <span className={isTotal ? "text-foreground" : "text-muted-foreground"}>{label}</span>
      <span className={isTotal ? "text-primary" : "text-foreground"}>{amount} SAR</span>
    </div>
  );
}

function FactItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl bg-muted/50 p-3 text-center">
      <Icon className="mb-2 h-5 w-5 text-primary" />
      <span className="text-xs text-muted-foreground mb-0.5">{label}</span>
      <span className="font-semibold text-sm">{value}</span>
    </div>
  );
}

function BookingDialogContent({ 
  school, type, scheduleSlots, 
  date, setDate, time, setTime, onConfirm 
}: { 
  school: School, type: string, scheduleSlots: any[], 
  date: string, setDate: (v: string) => void, 
  time: string, setTime: (v: string) => void,
  onConfirm: () => void 
}) {
  const uniqueDates = Array.from(new Set(scheduleSlots.map(s => s.date)));
  const timesForDate = scheduleSlots.filter(s => s.date === date);

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{type === 'visit' ? 'Schedule a Visit' : 'Book Placement Test'}</DialogTitle>
      </DialogHeader>
      <div className="space-y-6 pt-4">
        <div className="flex items-center gap-3 rounded-lg border bg-muted/50 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-sm">{school.name}</p>
            <p className="text-xs text-muted-foreground">{school.location.district}, {school.location.city}</p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium">Select Date</h4>
          <div className="flex flex-wrap gap-2">
            {uniqueDates.map(d => (
              <Button 
                key={d} 
                variant={date === d ? "default" : "outline"}
                className={`h-9 rounded-full text-xs ${date === d ? "" : "bg-background"}`}
                onClick={() => { setDate(d); setTime(""); }}
              >
                {d}
              </Button>
            ))}
          </div>
        </div>

        {date && (
          <div className="space-y-3 animate-in fade-in">
            <h4 className="text-sm font-medium">Select Time</h4>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {timesForDate.map(slot => (
                <Button 
                  key={slot.time} 
                  disabled={!slot.available}
                  variant={time === slot.time ? "default" : "outline"}
                  className={`h-10 text-xs ${time === slot.time ? "" : "bg-background"} ${!slot.available ? "opacity-50" : ""}`}
                  onClick={() => setTime(slot.time)}
                >
                  {slot.time}
                </Button>
              ))}
            </div>
          </div>
        )}

        <Button 
          className="w-full h-11" 
          disabled={!date || !time}
          onClick={onConfirm}
        >
          Confirm Booking
        </Button>
      </div>
    </DialogContent>
  );
}
