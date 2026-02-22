import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Star, Clock, DollarSign, Calendar } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import clinicalBg from "@/assets/clinical-bg.png";

interface Doctor {
  id: string;
  user_id: string;
  specialty: string;
  bio: string;
  consultation_fee: number;
  experience_years: number;
  available_days: string[];
  profile?: { first_name: string; last_name: string; avatar_url: string | null };
}



export default function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("All Specialties");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      const { data: doctorsData } = await supabase
        .from("doctors")
        .select("*")
        .eq("is_approved", true);

      if (doctorsData && doctorsData.length > 0) {
        const userIds = doctorsData.map((d) => d.user_id);
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("user_id, first_name, last_name, avatar_url")
          .in("user_id", userIds);

        const profileMap = new Map(
          (profilesData || []).map((p) => [p.user_id, p])
        );

        setDoctors(
          doctorsData.map((d: any) => ({
            ...d,
            profile: profileMap.get(d.user_id) || null,
          }))
        );
      }
      setLoading(false);
    };
    fetchDoctors();
  }, []);

  const filtered = doctors.filter((d) => {
    const name = `${d.profile?.first_name ?? ""} ${d.profile?.last_name ?? ""}`.toLowerCase();
    const matchesSearch = name.includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase());
    const matchesSpecialty = specialty === "All Specialties" || d.specialty === specialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div>
      <section className="relative py-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(211, 80%, 35%) 0%, hsl(211, 80%, 42%) 50%, hsl(199, 89%, 40%) 100%)' }}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(${clinicalBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="container text-center max-w-3xl relative z-10">
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-white">Our Doctors</h1>
          <p className="mt-4 text-lg text-white/80">
            Find and book appointments with certified healthcare professionals.
          </p>
        </div>
      </section>

      <section className="container py-10">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or specialty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={specialty} onValueChange={setSpecialty}>
            <SelectTrigger className="w-full sm:w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <ScrollArea className="max-h-60">
                <SelectItem value="All Specialties">All Specialties</SelectItem>
                {Array.from(new Set(doctors.map((d) => d.specialty).filter(Boolean))).sort().map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </ScrollArea>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-muted" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                  <div className="h-12 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">No doctors found matching your criteria.</p>
            <p className="text-sm mt-2">Try adjusting your search or filter.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((d, i) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display font-bold text-lg">
                        {(d.profile?.first_name?.[0] ?? "D")}
                        {(d.profile?.last_name?.[0] ?? "")}
                      </div>
                      <div>
                        <h3 className="font-display font-semibold text-foreground">
                          Dr. {d.profile?.first_name} {d.profile?.last_name}
                        </h3>
                        <Badge variant="secondary" className="mt-1">{d.specialty || "General"}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {d.bio || "Experienced healthcare professional dedicated to patient care."}
                    </p>
                    <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {d.experience_years}yr exp
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3.5 w-3.5" /> ${d.consultation_fee}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-warning text-warning" /> 4.8
                      </div>
                    </div>
                    <Button className="w-full" size="sm" asChild>
                      <Link to={`/book/${d.user_id}`}>
                        <Calendar className="h-4 w-4 mr-1" /> Book Appointment
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
