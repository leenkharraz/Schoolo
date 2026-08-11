import { useState, useEffect } from "react";
import { Link } from "wouter";
import { MapPin, Star, Heart, Bus, Accessibility } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { SCHOOLS, School, filterSchools, calculateFitScore } from "@/data/schools";
import { getSchoolImagePath } from "@/data/schoolImages";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const { user, favorites, toggleFavorite, activeFilter, setActiveFilter, selectedCity, sortOrder, setSortOrder } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [schools, setSchools] = useState<School[]>([]);

  // Listen to custom search event from top nav
  useEffect(() => {
    const handleSearch = (e: any) => setSearchQuery(e.detail);
    window.addEventListener('skoolu-search', handleSearch);
    return () => window.removeEventListener('skoolu-search', handleSearch);
  }, []);

  useEffect(() => {
    // Calculate fit score for each school
    let processedSchools = SCHOOLS.map(school => ({
      ...school,
      fitScore: calculateFitScore(school, {
        city: user.city,
        budgetMax: user.budgetMax,
        preferredCurriculum: user.preferredCurriculum,
        distanceMax: user.distanceMax,
        specialNeeds: user.specialNeeds,
        preferredLanguage: user.preferredLanguage
      })
    }));

    // Filter by city
    if (selectedCity !== "All") {
      processedSchools = processedSchools.filter(s => s.location.city === selectedCity);
    }

    // Apply active filter and search
    processedSchools = filterSchools(processedSchools, activeFilter, searchQuery, user.budgetMax);

    // Apply sorting
    if (sortOrder === "featured") {
      processedSchools.sort((a, b) => b.fitScore - a.fitScore);
    } else if (sortOrder === "price_asc") {
      processedSchools.sort((a, b) => a.fees.tuition - b.fees.tuition);
    } else if (sortOrder === "price_desc") {
      processedSchools.sort((a, b) => b.fees.tuition - a.fees.tuition);
    } else if (sortOrder === "rating") {
      processedSchools.sort((a, b) => b.rating - a.rating);
    }

    setSchools(processedSchools);
  }, [user, activeFilter, searchQuery, selectedCity, sortOrder]);

  const topMatches = schools.slice(0, 3);
  const otherSchools = schools.slice(3);

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      {/* Desktop Filters Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col gap-6 lg:flex sticky top-24">
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <h3 className="font-semibold mb-4">Quick Filters</h3>
          <div className="space-y-2">
            {[
              { id: "all", label: "All Matches" },
              { id: "nearest", label: "Nearest to Me" },
              { id: "budget", label: "Budget Friendly" },
              { id: "private", label: "Private Schools" },
              { id: "international", label: "International Schools" },
              { id: "siblings", label: "Siblings Discount" },
              { id: "specialNeeds", label: "Special Needs Support" },
            ].map((f) => (
              <Button 
                key={f.id} 
                variant={activeFilter === f.id ? "default" : "ghost"} 
                className={`w-full justify-start ${activeFilter === f.id ? "" : "text-muted-foreground"}`}
                onClick={() => setActiveFilter(f.id)}
              >
                {f.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <h3 className="font-semibold mb-4">Sort By</h3>
          <div className="space-y-2">
            {[
              { id: "featured", label: "Best Match (Fit Score)" },
              { id: "price_asc", label: "Price: Low to High" },
              { id: "price_desc", label: "Price: High to Low" },
              { id: "rating", label: "Highest Rated" },
            ].map((s) => (
              <Button 
                key={s.id} 
                variant={sortOrder === s.id ? "secondary" : "ghost"} 
                className={`w-full justify-start ${sortOrder === s.id ? "" : "text-muted-foreground"}`}
                onClick={() => setSortOrder(s.id as any)}
              >
                {s.label}
              </Button>
            ))}
          </div>
        </div>
      </aside>

      {/* Mobile Horizontal Filters */}
      <div className="lg:hidden">
        <ScrollArea className="w-full whitespace-nowrap pb-4">
          <div className="flex w-max space-x-2">
            {[
              { id: "all", label: "All" },
              { id: "nearest", label: "Nearest" },
              { id: "budget", label: "Budget" },
              { id: "siblings", label: "Siblings Discount" },
              { id: "international", label: "International" },
            ].map((f) => (
              <Button 
                key={f.id} 
                variant={activeFilter === f.id ? "default" : "outline"} 
                className="h-8 rounded-full px-4 text-xs bg-card"
                onClick={() => setActiveFilter(f.id)}
              >
                {f.label}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="hidden" />
        </ScrollArea>
      </div>

      <div className="flex-1 space-y-8">
        {schools.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-xl border bg-card border-dashed">
            <p className="text-lg font-medium text-foreground">No schools found</p>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or search query.</p>
            <Button variant="outline" className="mt-4" onClick={() => { setActiveFilter("all"); setSearchQuery(""); }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            {/* Top Matches Section */}
            {activeFilter === "all" && !searchQuery && topMatches.length > 0 && (
              <section>
                <h2 className="mb-4 text-xl font-bold text-foreground">Top Matches For You</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {topMatches.map((school) => (
                    <SchoolCard 
                      key={school.id} 
                      school={school} 
                      isFavorite={favorites.includes(school.id)}
                      onToggleFavorite={() => toggleFavorite(school.id)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Other Schools */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">
                  {activeFilter !== "all" || searchQuery ? "Results" : "More Options"}
                </h2>
                <span className="text-sm text-muted-foreground">{schools.length} schools</span>
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {(activeFilter !== "all" || searchQuery ? schools : otherSchools).map((school) => (
                  <SchoolCard 
                    key={school.id} 
                    school={school} 
                    isFavorite={favorites.includes(school.id)}
                    onToggleFavorite={() => toggleFavorite(school.id)}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function SchoolCard({ school, isFavorite, onToggleFavorite }: { school: School, isFavorite: boolean, onToggleFavorite: () => void }) {
  // Determine fit score color
  let scoreColor = "bg-red-500";
  if (school.fitScore >= 80) scoreColor = "bg-green-500";
  else if (school.fitScore >= 60) scoreColor = "bg-orange-500";

  return (
    <Link href={`/schools/${school.id}`} className="group flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md hover-elevate">
      {/* Image Header */}
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        <img 
          src={getSchoolImagePath(school.images[0])} 
          alt={school.name} 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1">
          <Badge className="bg-background/90 text-foreground backdrop-blur-sm hover:bg-background/90 font-semibold border-none">
            <Star className="mr-1 h-3 w-3 fill-primary text-primary" /> {school.rating}
          </Badge>
          {school.specialNeeds && (
            <Badge className="bg-background/90 text-foreground backdrop-blur-sm border-none px-1.5">
              <Accessibility className="h-3.5 w-3.5 text-primary" />
            </Badge>
          )}
          {school.busService && (
            <Badge className="bg-background/90 text-foreground backdrop-blur-sm border-none px-1.5">
              <Bus className="h-3.5 w-3.5 text-primary" />
            </Badge>
          )}
        </div>
        <div 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleFavorite(); }}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm cursor-pointer transition-transform hover:scale-110"
          role="button"
          tabIndex={0}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="line-clamp-1 font-bold text-base leading-tight group-hover:text-primary transition-colors">{school.name}</h3>
        </div>
        <p className="line-clamp-1 text-xs text-muted-foreground mb-3 font-arabic" dir="rtl">{school.nameAr}</p>
        
        <div className="mb-4 flex items-center text-xs text-muted-foreground">
          <MapPin className="mr-1 h-3 w-3" />
          <span className="truncate">{school.location.district}, {school.location.city} • {school.location.distance}km</span>
        </div>

        <div className="mt-auto space-y-3">
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="secondary" className="bg-secondary/10 text-secondary-foreground hover:bg-secondary/20 border-none text-[10px]">
              {school.curriculum}
            </Badge>
            {school.siblingsDiscount && (
              <Badge variant="outline" className="text-[10px] text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-900">
                {school.siblingsDiscountPercent}% Sibling Off
              </Badge>
            )}
          </div>
          
          <Separator />
          
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Annual Tuition</p>
              <p className="font-bold text-foreground">{school.fees.tuition.toLocaleString()} SAR</p>
            </div>
            
            {/* Fit Score */}
            <div className="flex flex-col items-end gap-1 w-24">
              <div className="flex items-center justify-between w-full text-[10px] font-semibold">
                <span className="text-muted-foreground">FIT SCORE</span>
                <span>{Math.round(school.fitScore)}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className={`h-full rounded-full ${scoreColor}`} style={{ width: `${school.fitScore}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
