import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  Users,
  Clock,
  Video,
  MessageSquare,
  CheckCircle,
  XCircle,
  Lock,
  ArrowLeft,
  FileUp,
  Pill,
} from "lucide-react";
import { toast } from "sonner";
import ConsultationChat from "@/components/ConsultationChat";
import VideoCall from "@/components/VideoCall";
import { useLanguage } from "@/lib/i18n";

type StatsFilter = "pending" | "confirmed" | "completed" | "patients" | null;

export default function DoctorDashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [doctor, setDoctor] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [statsFilter, setStatsFilter] = useState<StatsFilter>(null);

  // Prescription sending
  const [rxDialogOpen, setRxDialogOpen] = useState(false);
  const [rxAppointment, setRxAppointment] = useState<any>(null);
  const [rxForm, setRxForm] = useState({ diagnosis: "", notes: "", medications: "" });
  const [rxFile, setRxFile] = useState<File | null>(null);
  const [sendingRx, setSendingRx] = useState(false);
  const rxFileRef = useRef<HTMLInputElement>(null);

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
      const allAppts = apptRes.data ?? [];
      setAppointments(allAppts.filter((a: any) => a.consultation_code_used === true));
    };
    fetchData();
  }, [user]);

  const pending = appointments.filter((a) => a.status === "pending");
  const confirmed = appointments.filter((a) => a.status === "confirmed");
  const completed = appointments.filter((a) => a.status === "completed");
  const uniquePatients = [...new Set(appointments.map((a) => a.patient_id))];

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("appointments").update({ status }).eq("id", id);
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  const openRxDialog = (appointment: any) => {
    setRxAppointment(appointment);
    setRxForm({ diagnosis: "", notes: "", medications: "" });
    setRxFile(null);
    setRxDialogOpen(true);
  };

  const handleSendPrescription = async () => {
    if (!rxAppointment || !user) return;
    setSendingRx(true);
    try {
      let fileUrl: string | null = null;
      if (rxFile) {
        const filePath = `${user.id}/${Date.now()}_${rxFile.name}`;
        const { error: uploadErr } = await supabase.storage
          .from("prescription-documents")
          .upload(filePath, rxFile);
        if (uploadErr) throw uploadErr;
        const { data: urlData } = supabase.storage
          .from("prescription-documents")
          .getPublicUrl(filePath);
        fileUrl = urlData.publicUrl;
      }

      const { error } = await supabase.from("prescriptions").insert({
        doctor_id: user.id,
        patient_id: rxAppointment.patient_id,
        appointment_id: rxAppointment.id,
        diagnosis: rxForm.diagnosis,
        notes: rxForm.notes,
        medications: rxForm.medications ? rxForm.medications.split(",").map((m: string) => m.trim()) : [],
        file_url: fileUrl,
      } as any);
      if (error) throw error;

      toast.success(t("dd.rxSent"));
      setRxDialogOpen(false);
    } catch (err: any) {
      toast.error(err.message || t("dd.rxFailed"));
    } finally {
      setSendingRx(false);
    }
  };

  if (doctor && !doctor.is_approved) {
    return (
      <div className="container py-20 text-center">
        <div className="h-16 w-16 rounded-2xl bg-warning/10 flex items-center justify-center mx-auto mb-4">
          <Clock className="h-8 w-8 text-warning" />
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground">{t("dd.pendingApproval")}</h1>
        <p className="mt-2 text-muted-foreground max-w-md mx-auto">{t("dd.pendingApprovalDesc")}</p>
      </div>
    );
  }

  if (selectedVideo) {
    return (
      <div className="container py-8">
        <Button variant="ghost" className="mb-4" onClick={() => setSelectedVideo(null)}>
          {t("dd.backToDash")}
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
          {t("dd.backToDash")}
        </Button>
        <ConsultationChat appointment={selectedChat} currentUserId={user!.id} />
      </div>
    );
  }

  const statsCards = [
    { icon: Clock, label: t("dd.stat.pending"), value: pending.length, color: "text-warning", filter: "pending" as StatsFilter },
    { icon: Calendar, label: t("dd.stat.confirmed"), value: confirmed.length, color: "text-primary", filter: "confirmed" as StatsFilter },
    { icon: CheckCircle, label: t("dd.stat.completed"), value: completed.length, color: "text-success", filter: "completed" as StatsFilter },
    { icon: Users, label: t("dd.stat.totalPatients"), value: uniquePatients.length, color: "text-secondary", filter: "patients" as StatsFilter },
  ];

  const getFilteredAppointments = () => {
    switch (statsFilter) {
      case "pending": return { title: t("dd.list.pending"), items: pending };
      case "confirmed": return { title: t("dd.list.confirmed"), items: confirmed };
      case "completed": return { title: t("dd.list.completed"), items: completed };
      case "patients": return { title: t("dd.list.all"), items: appointments };
      default: return { title: "", items: [] };
    }
  };

  const statusLabel = (s: string) => t(`pd.status.${s}`) || s;

  const renderAppointmentActions = (a: any) => (
    <>
      {a.status === "pending" && (
        <div className="flex gap-2">
          <Button size="sm" variant="default" onClick={() => updateStatus(a.id, "confirmed")}>
            <CheckCircle className="h-3.5 w-3.5 mr-1" /> {t("dd.confirm")}
          </Button>
          <Button size="sm" variant="outline" onClick={() => updateStatus(a.id, "cancelled")}>
            <XCircle className="h-3.5 w-3.5 mr-1" /> {t("dd.decline")}
          </Button>
        </div>
      )}
      {a.status === "confirmed" && (
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => setSelectedChat(a)}>
            <MessageSquare className="h-3.5 w-3.5 mr-1" /> {t("dd.chat")}
          </Button>
          <Button size="sm" variant="outline" onClick={() => setSelectedVideo(a)}>
            <Video className="h-3.5 w-3.5 mr-1" /> {t("dd.video")}
          </Button>
          <Button size="sm" variant="outline" onClick={() => openRxDialog(a)}>
            <FileUp className="h-3.5 w-3.5 mr-1" /> {t("dd.prescription")}
          </Button>
          <Button size="sm" onClick={() => updateStatus(a.id, "completed")}>
            <CheckCircle className="h-3.5 w-3.5 mr-1" /> {t("dd.complete")}
          </Button>
        </div>
      )}
      {a.status === "completed" && (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => openRxDialog(a)}>
            <FileUp className="h-3.5 w-3.5 mr-1" /> {t("dd.sendRx")}
          </Button>
        </div>
      )}
    </>
  );

  const renderAppointmentItem = (a: any) => (
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
              {a.appointment_date} {t("pd.at")} {a.appointment_time}
            </p>
            <p className="text-xs text-muted-foreground capitalize">{a.consultation_type} • {statusLabel(a.status)}</p>
          </div>
        </div>
        <Badge variant="secondary" className="capitalize">{statusLabel(a.status)}</Badge>
      </div>
      {renderAppointmentActions(a)}
    </div>
  );

  return (
    <div className="container py-8">
      {/* Prescription Dialog */}
      <Dialog open={rxDialogOpen} onOpenChange={setRxDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <Pill className="h-5 w-5 text-primary" /> {t("dd.rxDialogTitle")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label>{t("dd.diagnosis")}</Label>
              <Input value={rxForm.diagnosis} onChange={(e) => setRxForm({ ...rxForm, diagnosis: e.target.value })} placeholder={t("dd.diagnosisPh")} />
            </div>
            <div>
              <Label>{t("dd.meds")}</Label>
              <Input value={rxForm.medications} onChange={(e) => setRxForm({ ...rxForm, medications: e.target.value })} placeholder={t("dd.medsPh")} />
            </div>
            <div>
              <Label>{t("dd.notes")}</Label>
              <Textarea value={rxForm.notes} onChange={(e) => setRxForm({ ...rxForm, notes: e.target.value })} rows={3} placeholder={t("dd.notesPh")} />
            </div>
            <div>
              <Label>{t("dd.attach")}</Label>
              <input
                ref={rxFileRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => setRxFile(e.target.files?.[0] || null)}
              />
              <div className="mt-1 flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => rxFileRef.current?.click()}>
                  <FileUp className="h-4 w-4 mr-1" /> {rxFile ? rxFile.name : t("dd.chooseFile")}
                </Button>
                {rxFile && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => setRxFile(null)}>
                    <XCircle className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            <Button className="w-full" onClick={handleSendPrescription} disabled={sendingRx}>
              {sendingRx ? t("dd.sending") : t("dd.sendRx")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Dr. {profile?.first_name} {profile?.last_name}
        </h1>
        <p className="text-muted-foreground text-sm">
          {doctor?.specialty || t("dd.doctorFallback")} • {t("dd.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statsCards.map((s) => (
          <Card
            key={s.label}
            className={`cursor-pointer transition-all hover:ring-2 hover:ring-primary/30 ${statsFilter === s.filter ? "ring-2 ring-primary" : ""}`}
            onClick={() => setStatsFilter(statsFilter === s.filter ? null : s.filter)}
          >
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

      {/* Filtered list view */}
      {statsFilter && (() => {
        const { title, items } = getFilteredAppointments();
        return (
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => setStatsFilter(null)}>
                <ArrowLeft className="h-4 w-4 mr-1" /> {t("dd.back")}
              </Button>
              <CardTitle className="font-display text-lg">{title} ({items.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {items.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">{t("dd.noAppts")}</p>
                ) : (
                  items.map(renderAppointmentItem)
                )}
              </div>
            </CardContent>
          </Card>
        );
      })()}

      {!statsFilter && (
        <>
          {appointments.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Lock className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">{t("dd.emptyState")}</p>
              </CardContent>
            </Card>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {pending.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5 text-warning" /> {t("dd.list.pending")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pending.map(renderAppointmentItem)}
                  </div>
                </CardContent>
              </Card>
            )}

            {confirmed.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" /> {t("dd.list.confirmed")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {confirmed.map(renderAppointmentItem)}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
}
