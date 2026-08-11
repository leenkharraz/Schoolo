import { Link } from "wouter";
import { Heart, Search, MapPin, Star } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { SCHOOLS, School } from "@/data/schools";
import { getSchoolImagePath } from "@/data/schoolImages";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Favorites() {
  const { favorites, toggleFavorite } = useApp();
  
  const savedSchools = SCHOOLS.filter(s => favorites.includes(s.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Saved Schools</h1>
          <p className="text-muted-foreground mt-1">Keep track of schools you're interested in.</p>
        </div>
        <Badge variant="secondary" className="px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20">
          {savedSchools.length} Saved
        </Badge>
      </div>

      {savedSchools.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card p-12 text-center shadow-sm">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Heart className="h-8 w-8 text-primary" />
          </div>
          <h2 className="mb-2 text-xl font-bold">No saved schools yet</h2>
          <p className="mb-6 max-w-md text-muted-foreground">
            Tap the heart icon on any school card to save it here for easy comparison later.
          </p>
          <Button asChild>
            <Link href="/">
              <Search className="mr-2 h-4 w-4" /> Discover Schools
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {savedSchools.map(school => (
            <FavoriteCard 
              key={school.id} 
              school={school} 
              onToggle={() => toggleFavorite(school.id)} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FavoriteCard({ school, onToggle }: { school: School, onToggle: () => void }) {
  return (
    <Link href={`/schools/${school.id}`} className="group flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md hover-elevate">
      <div className="relative h-40 w-full overflow-hidden bg-muted">
        <img 
          src={getSchoolImagePath(school.images[0])} 
          alt={school.name} 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggle(); }}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm cursor-pointer transition-transform hover:scale-110"
          role="button"
          tabIndex={0}
        >
          <Heart className="h-4 w-4 fill-destructive text-destructive" />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 font-bold text-base group-hover:text-primary transition-colors">{school.name}</h3>
        <p className="line-clamp-1 text-xs text-muted-foreground mb-2 font-arabic" dir="rtl">{school.nameAr}</p>
        
        <div className="mb-3 flex items-center text-xs text-muted-foreground">
          <MapPin className="mr-1 h-3 w-3" />
          <span className="truncate">{school.location.district}, {school.location.city}</span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3 border-t">
          <div className="flex items-center text-sm font-medium">
            <Star className="mr-1 h-4 w-4 fill-primary text-primary" />
            {school.rating}
          </div>
          <span className="text-sm font-bold text-foreground">
            {school.fees.tuition.toLocaleString()} SAR
          </span>
        </div>
      </div>
    </Link>
  );
}
