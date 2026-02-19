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
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [doctor, setDoctor] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [profileRes, doctorRes, apptRes, payRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("doctors").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("appointments").select("*").eq("doctor_id", user.id).order("appointment_date", { ascending: false }).limit(20),
        supabase.from("payments").select("*").eq("doctor_id", user.id).order("created_at", { ascending: false }),
      ]);
      setProfile(profileRes.data);
      setDoctor(doctorRes.data);
      setAppointments(apptRes.data ?? []);
      setPayments(payRes.data ?? []);
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

  const confirmPayment = async (paymentId: string) => {
    const { error } = await supabase
      .from("payments")
      .update({ doctor_confirmed: true, status: "doctor_confirmed" })
      .eq("id", paymentId);
    if (error) {
      toast.error("Failed to confirm payment");
    } else {
      toast.success("Payment confirmed! Admin will verify shortly.");
      setPayments((prev) =>
        prev.map((p) =>
          p.id === paymentId ? { ...p, doctor_confirmed: true, status: "doctor_confirmed" } : p
        )
      );
    }
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

  const pendingPayments = payments.filter((p) => p.status === "submitted" && !p.doctor_confirmed);

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

      <div className="grid md:grid-cols-2 gap-6">
        {/* Pending appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-warning" /> Pending Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pending.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">No pending appointments</p>
            ) : (
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
            )}
          </CardContent>
        </Card>

        {/* Confirmed appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" /> Confirmed Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {confirmed.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">No confirmed appointments</p>
            ) : (
              <div className="space-y-3">
                {confirmed.map((a) => (
                  <div key={a.id} className="flex items-center justify-between p-3 rounded-lg border">
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
                    <Button size="sm" onClick={() => updateStatus(a.id, "completed")}>
                      Complete
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Confirmations */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-success" /> Payment Confirmations
              {pendingPayments.length > 0 && (
                <Badge className="bg-destructive text-destructive-foreground ml-2">{pendingPayments.length} pending</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {payments.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">No payments yet</p>
            ) : (
              <div className="space-y-3">
                {payments.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Appointment Payment • ${p.amount}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(p.created_at).toLocaleDateString()} • Status: {p.status}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {p.doctor_confirmed ? (
                        <Badge className="bg-success/10 text-success">
                          <CheckCircle className="h-3 w-3 mr-1" /> Confirmed
                        </Badge>
                      ) : p.status === "submitted" ? (
                        <Button size="sm" onClick={() => confirmPayment(p.id)}>
                          <CheckCircle className="h-3.5 w-3.5 mr-1" /> Confirm Payment
                        </Button>
                      ) : (
                        <Badge variant="secondary">{p.status}</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
