import { useLocation, Link } from "wouter";
import { useApp } from "@/context/AppContext";
import { 
  Compass, 
  Bell, 
  MessageSquare, 
  Heart, 
  User, 
  Search, 
  Moon, 
  Sun,
  MapPin,
  Menu,
  GraduationCap
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user } = useApp();

  const isAuthPage = location === "/login" || location === "/signup" || location === "/onboarding";

  if (isAuthPage) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  if (!user.isLoggedIn) {
    // We handle the redirect in App.tsx or a route wrapper, but just in case:
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  return (
    <div className="flex min-h-[100dvh] w-full flex-col bg-background md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-card md:flex lg:w-72">
        <div className="flex h-16 items-center px-6 border-b">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <GraduationCap className="h-6 w-6" />
            Skoolu
          </Link>
        </div>
        <nav className="flex-1 space-y-2 p-4">
          <NavItem href="/" icon={Compass} label="Discovery" isActive={location === "/"} />
          <NavItem href="/alerts" icon={Bell} label="Alerts" isActive={location === "/alerts"} badge />
          <NavItem href="/chat" icon={MessageSquare} label="AI Advisor" isActive={location === "/chat"} />
          <NavItem href="/favorites" icon={Heart} label="Favorites" isActive={location === "/favorites"} />
          <NavItem href="/profile" icon={User} label="Profile" isActive={location === "/profile"} />
        </nav>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card px-4 md:px-6">
          <div className="flex items-center gap-4 md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="-ml-2">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="flex h-16 items-center px-6 border-b">
                  <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                    <GraduationCap className="h-6 w-6" />
                    Skoolu
                  </Link>
                </div>
                <nav className="space-y-2 p-4">
                  <NavItem href="/" icon={Compass} label="Discovery" isActive={location === "/"} sheet />
                  <NavItem href="/alerts" icon={Bell} label="Alerts" isActive={location === "/alerts"} badge sheet />
                  <NavItem href="/chat" icon={MessageSquare} label="AI Advisor" isActive={location === "/chat"} sheet />
                  <NavItem href="/favorites" icon={Heart} label="Favorites" isActive={location === "/favorites"} sheet />
                  <NavItem href="/profile" icon={User} label="Profile" isActive={location === "/profile"} sheet />
                </nav>
              </SheetContent>
            </Sheet>
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary md:hidden">
              <GraduationCap className="h-6 w-6" />
              Skoolu
            </Link>
          </div>

          <div className="hidden flex-1 md:flex md:items-center md:gap-4 lg:gap-6">
            <SearchForm />
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <CitySelector />
            <ThemeToggle />
            <Link href="/profile" className="hidden md:block">
              <Avatar className="h-8 w-8 border border-primary/20 cursor-pointer">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {user.name ? user.name.substring(0, 2).toUpperCase() : "GU"}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </header>

        {/* Mobile Search Bar - only shown on home page */}
        {location === "/" && (
          <div className="border-b bg-card p-4 md:hidden">
            <SearchForm />
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-muted/30 p-4 md:p-6 lg:p-8 pb-24 md:pb-6 lg:pb-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Tab Nav */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t bg-card pb-safe md:hidden">
          <MobileTabItem href="/" icon={Compass} label="Explore" isActive={location === "/"} />
          <MobileTabItem href="/alerts" icon={Bell} label="Alerts" isActive={location === "/alerts"} badge />
          <MobileTabItem href="/chat" icon={MessageSquare} label="Advisor" isActive={location === "/chat"} />
          <MobileTabItem href="/favorites" icon={Heart} label="Saved" isActive={location === "/favorites"} />
          <MobileTabItem href="/profile" icon={User} label="Profile" isActive={location === "/profile"} />
        </nav>
      </div>
    </div>
  );
}

function NavItem({ 
  href, 
  icon: Icon, 
  label, 
  isActive, 
  badge,
  sheet 
}: { 
  href: string; 
  icon: any; 
  label: string; 
  isActive: boolean; 
  badge?: boolean;
  sheet?: boolean;
}) {
  const { unreadAlertCount } = useApp();
  
  return (
    <Link 
      href={href} 
      className={`flex items-center justify-between rounded-lg px-3 py-2.5 transition-all hover:bg-muted ${
        isActive ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground"
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`h-5 w-5 ${isActive ? "text-primary" : ""}`} />
        <span>{label}</span>
      </div>
      {badge && unreadAlertCount > 0 && (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
          {unreadAlertCount}
        </span>
      )}
    </Link>
  );
}

function MobileTabItem({ 
  href, 
  icon: Icon, 
  label, 
  isActive, 
  badge 
}: { 
  href: string; 
  icon: any; 
  label: string; 
  isActive: boolean; 
  badge?: boolean;
}) {
  const { unreadAlertCount } = useApp();
  
  return (
    <Link 
      href={href} 
      className={`relative flex flex-1 flex-col items-center justify-center gap-1 py-2 ${
        isActive ? "text-primary" : "text-muted-foreground"
      }`}
    >
      <Icon className={`h-5 w-5 ${isActive ? "fill-primary/20" : ""}`} />
      <span className="text-[10px] font-medium">{label}</span>
      {badge && unreadAlertCount > 0 && (
        <span className="absolute top-1 right-1/4 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
          {unreadAlertCount}
        </span>
      )}
    </Link>
  );
}

function SearchForm() {
  const { setActiveFilter } = useApp();
  
  return (
    <form className="relative w-full max-w-md" onSubmit={(e) => e.preventDefault()}>
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search schools, curriculum, city..."
        className="w-full bg-background pl-9 border-muted"
        onChange={(e) => {
          // This would ideally update a search query state, but we'll use a hack to pass it to the Home page
          window.dispatchEvent(new CustomEvent('skoolu-search', { detail: e.target.value }));
        }}
      />
    </form>
  );
}

function CitySelector() {
  const { selectedCity, setSelectedCity } = useApp();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-1.5 border-muted bg-background">
          <MapPin className="h-3.5 w-3.5 text-primary" />
          <span className="hidden sm:inline-block">{selectedCity}</span>
          <span className="sm:hidden">{selectedCity.substring(0, 3)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setSelectedCity("All")}>All Cities</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setSelectedCity("Riyadh")}>Riyadh</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setSelectedCity("Jeddah")}>Jeddah</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setSelectedCity("Dammam")}>Dammam</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="h-9 w-9" 
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
