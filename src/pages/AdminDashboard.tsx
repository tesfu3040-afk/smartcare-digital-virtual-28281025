import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Stethoscope,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Shield,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { role } = useAuth();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    if (role !== "admin") return;
    const fetchData = async () => {
      const [docRes, profRes, apptRes] = await Promise.all([
        supabase.from("doctors").select("*, profiles!doctors_user_id_fkey(first_name, last_name, email)"),
        supabase.from("profiles").select("*").limit(50),
        supabase.from("appointments").select("*").order("created_at", { ascending: false }).limit(50),
      ]);
      setDoctors(docRes.data ?? []);
      setProfiles(profRes.data ?? []);
      setAppointments(apptRes.data ?? []);
    };
    fetchData();
  }, [role]);

  const approveDoctor = async (id: string) => {
    const { error } = await supabase
      .from("doctors")
      .update({ is_approved: true, approved_at: new Date().toISOString() })
      .eq("id", id);
    if (error) toast.error("Failed to approve");
    else {
      toast.success("Doctor approved!");
      setDoctors((prev) =>
        prev.map((d) =>
          d.id === id ? { ...d, is_approved: true, approved_at: new Date().toISOString() } : d
        )
      );
    }
  };

  if (role !== "admin") {
    return (
      <div className="container py-20 text-center">
        <Shield className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h1 className="font-display text-2xl font-bold text-foreground">Access Denied</h1>
        <p className="text-muted-foreground mt-2">You don't have admin permissions.</p>
      </div>
    );
  }

  const pendingDoctors = doctors.filter((d) => !d.is_approved);
  const completedAppts = appointments.filter((a) => a.status === "completed");

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm">Manage SmartCare platform</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Users, label: "Total Users", value: profiles.length, color: "text-primary" },
          { icon: Stethoscope, label: "Doctors", value: doctors.length, color: "text-secondary" },
          { icon: Calendar, label: "Appointments", value: appointments.length, color: "text-accent" },
          { icon: TrendingUp, label: "Completed", value: completedAppts.length, color: "text-success" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`h-10 w-10 rounded-lg bg-muted flex items-center justify-center ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="doctors">
        <TabsList>
          <TabsTrigger value="doctors">
            Doctors {pendingDoctors.length > 0 && <Badge className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-destructive">{pendingDoctors.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
        </TabsList>

        <TabsContent value="doctors" className="mt-6">
          <div className="space-y-3">
            {doctors.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No doctors registered yet</p>
            ) : (
              doctors.map((d) => (
                <Card key={d.id}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display font-bold">
                        {d.profiles?.first_name?.[0] ?? "D"}
                      </div>
                      <div>
                        <p className="font-display font-semibold text-foreground">
                          Dr. {d.profiles?.first_name} {d.profiles?.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">{d.specialty || "Not specified"} • {d.profiles?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {d.is_approved ? (
                        <Badge className="bg-success/10 text-success">
                          <CheckCircle className="h-3.5 w-3.5 mr-1" /> Approved
                        </Badge>
                      ) : (
                        <Button size="sm" onClick={() => approveDoctor(d.id)}>
                          <CheckCircle className="h-3.5 w-3.5 mr-1" /> Approve
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <div className="space-y-3">
            {profiles.map((p) => (
              <Card key={p.id}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-display font-bold text-sm text-muted-foreground">
                    {p.first_name?.[0] ?? "U"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.first_name} {p.last_name}</p>
                    <p className="text-xs text-muted-foreground">{p.email}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="appointments" className="mt-6">
          <div className="space-y-3">
            {appointments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No appointments yet</p>
            ) : (
              appointments.slice(0, 20).map((a) => (
                <Card key={a.id}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {a.appointment_date} at {a.appointment_time}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">{a.consultation_type} consultation</p>
                    </div>
                    <Badge variant="secondary" className="capitalize">{a.status}</Badge>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
