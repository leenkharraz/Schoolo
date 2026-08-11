import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  User, Settings, Calendar as CalendarIcon, LogOut, CheckCircle2, 
  Clock, XCircle, MapPin, Edit2 
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function Profile() {
  const [_, setLocation] = useLocation();
  const { user, updateUser, bookings, cancelBooking, updateBooking, appLanguage, setAppLanguage } = useApp();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    updateUser({ isLoggedIn: false });
    setLocation("/login");
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'upcoming': return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">Upcoming</Badge>;
      case 'completed': return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Completed</Badge>;
      case 'cancelled': return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 border-none">Cancelled</Badge>;
      case 'updated': return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none">Rescheduled</Badge>;
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 border-b pb-6">
        <Avatar className="h-20 w-20 border-2 border-primary/20">
          <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
            {user.name ? user.name.substring(0, 2).toUpperCase() : "GU"}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{user.name || "Guest User"}</h1>
          <div className="flex items-center text-muted-foreground mt-1">
            <MapPin className="mr-1 h-4 w-4" /> {user.city}
          </div>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="w-full grid grid-cols-3 mb-6 bg-card border shadow-sm h-12">
          <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md h-10">Profile</TabsTrigger>
          <TabsTrigger value="bookings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md h-10">Bookings</TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md h-10">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6 animate-in fade-in">
          <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={user.name} onChange={(e) => updateUser({ name: e.target.value })} className="bg-background" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={user.email} onChange={(e) => updateUser({ email: e.target.value })} className="bg-background" />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={user.phone} onChange={(e) => updateUser({ phone: e.target.value })} className="bg-background" />
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Select value={user.city} onValueChange={(v) => updateUser({ city: v })}>
                  <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Riyadh">Riyadh</SelectItem>
                    <SelectItem value="Jeddah">Jeddah</SelectItem>
                    <SelectItem value="Dammam">Dammam</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold">School Preferences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Maximum Budget (SAR)</Label>
                <Select value={user.budgetMax.toString()} onValueChange={(v) => updateUser({ budgetMax: parseInt(v) })}>
                  <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30000">30,000 SAR</SelectItem>
                    <SelectItem value="60000">60,000 SAR</SelectItem>
                    <SelectItem value="90000">90,000 SAR</SelectItem>
                    <SelectItem value="120000">120,000+ SAR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Preferred Curriculum</Label>
                <Select value={user.preferredCurriculum} onValueChange={(v) => updateUser({ preferredCurriculum: v })}>
                  <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Any">Any</SelectItem>
                    <SelectItem value="American">American</SelectItem>
                    <SelectItem value="British">British</SelectItem>
                    <SelectItem value="IB">IB</SelectItem>
                    <SelectItem value="Saudi National">Saudi National</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4 mt-4 bg-background">
              <div>
                <Label className="text-base">Special Needs Support</Label>
                <p className="text-sm text-muted-foreground">Prioritize schools with SEN facilities</p>
              </div>
              <Switch checked={user.specialNeeds} onCheckedChange={(v) => updateUser({ specialNeeds: v })} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6 animate-in fade-in">
          {bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card p-12 text-center shadow-sm">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <CalendarIcon className="h-8 w-8 text-primary" />
              </div>
              <h2 className="mb-2 text-xl font-bold">No Bookings Yet</h2>
              <p className="mb-6 max-w-md text-muted-foreground">
                You haven't scheduled any school visits or placement tests.
              </p>
              <Button asChild>
                <Link href="/">Discover Schools</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.sort((a,b) => b.createdAt - a.createdAt).map(booking => (
                <div key={booking.id} className="rounded-xl border bg-card p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{booking.schoolName}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{booking.type.replace('_', ' ')}</p>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm font-medium bg-muted/50 p-3 rounded-lg mb-4">
                    <div className="flex items-center"><CalendarIcon className="mr-2 h-4 w-4 text-primary" /> {booking.date}</div>
                    <div className="flex items-center"><Clock className="mr-2 h-4 w-4 text-primary" /> {booking.time}</div>
                  </div>

                  {booking.status === 'upcoming' || booking.status === 'updated' ? (
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" className="h-9" onClick={() => cancelBooking(booking.id)}>
                        Cancel
                      </Button>
                      <RescheduleDialog 
                        booking={booking} 
                        onReschedule={(date, time) => updateBooking(booking.id, { date, time, status: 'updated' })} 
                      />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-6 animate-in fade-in">
          <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
            <div className="p-4 flex items-center justify-between border-b bg-muted/20">
              <div>
                <Label className="text-base font-semibold">Appearance</Label>
                <p className="text-sm text-muted-foreground">Switch between light and dark mode</p>
              </div>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="w-32 bg-background"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="p-4 flex items-center justify-between border-b bg-muted/20">
              <div>
                <Label className="text-base font-semibold">Language</Label>
                <p className="text-sm text-muted-foreground">App interface language</p>
              </div>
              <Select value={appLanguage} onValueChange={setAppLanguage}>
                <SelectTrigger className="w-32 bg-background"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Arabic">Arabic</SelectItem>
                  <SelectItem value="French">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button variant="destructive" className="w-full" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Log Out
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function RescheduleDialog({ booking, onReschedule }: { booking: any, onReschedule: (d: string, t: string) => void }) {
  const [date, setDate] = useState(booking.date);
  const [time, setTime] = useState(booking.time);
  
  // Dummy slots for UI
  const dates = ["Sun 11 May", "Mon 12 May", "Wed 14 May", "Thu 15 May"];
  const times = ["09:00 AM", "10:00 AM", "01:00 PM", "03:00 PM"];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-9">Reschedule</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reschedule {booking.type === 'visit' ? 'Visit' : 'Test'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Date</Label>
            <div className="flex flex-wrap gap-2">
              {dates.map(d => (
                <Button key={d} variant={date === d ? "default" : "outline"} className={`h-8 text-xs ${date !== d ? "bg-background" : ""}`} onClick={() => setDate(d)}>{d}</Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Time</Label>
            <div className="grid grid-cols-2 gap-2">
              {times.map(t => (
                <Button key={t} variant={time === t ? "default" : "outline"} className={`h-8 text-xs ${time !== t ? "bg-background" : ""}`} onClick={() => setTime(t)}>{t}</Button>
              ))}
            </div>
          </div>
          <Button className="w-full mt-4" onClick={() => {
            onReschedule(date, time);
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })); // Hack to close dialog
          }}>
            Confirm New Time
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
