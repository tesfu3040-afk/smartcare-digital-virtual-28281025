import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Users,
  Clock,
  Video,
  MessageSquare,
  CheckCircle,
  XCircle,
  Lock,
} from "lucide-react";
import ConsultationChat from "@/components/ConsultationChat";
import VideoCall from "@/components/VideoCall";

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [doctor, setDoctor] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [profileRes, doctorRes, apptRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("doctors").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("appointments").select("*").eq("doctor_id", user.id).order("appointment_date", { ascending: false }).limit(20),
      ]);
      setProfile(profileRes.data);
      setDoctor(doctorRes.data);
      // Only show appointments where patient has entered consultation code
      const allAppts = apptRes.data ?? [];
      setAppointments(allAppts.filter((a: any) => a.consultation_code_used === true));
    };
    fetchData();
  }, [user]);

  const pending = appointments.filter((a) => a.status === "pending");
  const confirmed = appointments.filter((a) => a.status === "confirmed");
  const completed = appointments.filter((a) => a.status === "completed");

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("appointments").update({ status }).eq("id", id);
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  if (doctor && !doctor.is_approved) {
    return (
      <div className="container py-20 text-center">
        <div className="h-16 w-16 rounded-2xl bg-warning/10 flex items-center justify-center mx-auto mb-4">
          <Clock className="h-8 w-8 text-warning" />
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground">Account Pending Approval</h1>
        <p className="mt-2 text-muted-foreground max-w-md mx-auto">
          Your doctor account is being reviewed by our admin team. You'll be notified once approved.
        </p>
      </div>
    );
  }

  if (selectedVideo) {
    return (
      <div className="container py-8">
        <Button variant="ghost" className="mb-4" onClick={() => setSelectedVideo(null)}>
          ← Back to Dashboard
        </Button>
        <VideoCall
          appointment={selectedVideo}
          userName={profile ? `Dr. ${profile.first_name} ${profile.last_name || ""}`.trim() : "Doctor"}
          onClose={() => setSelectedVideo(null)}
        />
      </div>
    );
  }

  if (selectedChat) {
    return (
      <div className="container py-8">
        <Button variant="ghost" className="mb-4" onClick={() => setSelectedChat(null)}>
          ← Back to Dashboard
        </Button>
        <ConsultationChat appointment={selectedChat} currentUserId={user!.id} />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Dr. {profile?.first_name} {profile?.last_name}
        </h1>
        <p className="text-muted-foreground text-sm">
          {doctor?.specialty || "Doctor"} • Doctor Dashboard
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Clock, label: "Pending", value: pending.length, color: "text-warning" },
          { icon: Calendar, label: "Confirmed", value: confirmed.length, color: "text-primary" },
          { icon: CheckCircle, label: "Completed", value: completed.length, color: "text-success" },
          { icon: Users, label: "Total Patients", value: new Set(appointments.map((a) => a.patient_id)).size, color: "text-secondary" },
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

      {appointments.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Lock className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No appointments yet. Appointments will appear here once patients enter their consultation code.</p>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Pending appointments */}
        {pending.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-warning" /> Pending Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pending.map((a) => (
                  <div key={a.id} className="p-3 rounded-lg border space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {a.consultation_type === "video" ? (
                          <Video className="h-4 w-4 text-primary" />
                        ) : (
                          <MessageSquare className="h-4 w-4 text-primary" />
                        )}
                        <span className="text-sm font-medium text-foreground">
                          {a.appointment_date} at {a.appointment_time}
                        </span>
                      </div>
                      <Badge variant="secondary" className="bg-warning/10 text-warning">Pending</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="default" onClick={() => updateStatus(a.id, "confirmed")}>
                        <CheckCircle className="h-3.5 w-3.5 mr-1" /> Confirm
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => updateStatus(a.id, "cancelled")}>
                        <XCircle className="h-3.5 w-3.5 mr-1" /> Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Confirmed appointments - chat available */}
        {confirmed.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" /> Confirmed Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {confirmed.map((a) => (
                  <div key={a.id} className="p-3 rounded-lg border space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          {a.consultation_type === "video" ? (
                            <Video className="h-5 w-5 text-primary" />
                          ) : (
                            <MessageSquare className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {a.appointment_date} at {a.appointment_time}
                          </p>
                          <p className="text-xs text-muted-foreground capitalize">{a.consultation_type}</p>
                        </div>
                      </div>
                      <Badge className="bg-success/10 text-success">Confirmed</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setSelectedChat(a)}>
                        <MessageSquare className="h-3.5 w-3.5 mr-1" /> Open Chat
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setSelectedVideo(a)}>
                        <Video className="h-3.5 w-3.5 mr-1" /> Video Call
                      </Button>
                      <Button size="sm" onClick={() => updateStatus(a.id, "completed")}>
                        <CheckCircle className="h-3.5 w-3.5 mr-1" /> Complete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
