import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  FileText,
  Pill,
  Upload,
  Video,
  MessageSquare,
  Clock,
  DollarSign,
  Key,
  CheckCircle,
  Lock,
  Bell,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import ConsultationChat from "@/components/ConsultationChat";
import VideoCall from "@/components/VideoCall";
import { useLanguage } from "@/lib/i18n";

export default function PatientDashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [consultationCodeInput, setConsultationCodeInput] = useState<Record<string, string>>({});
  const [verifyingCode, setVerifyingCode] = useState<string | null>(null);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);

  const fetchData = async () => {
    if (!user) return;
    const [profileRes, apptRes, rxRes, docRes, payRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("appointments").select("*").eq("patient_id", user.id).order("appointment_date", { ascending: false }).limit(10),
      supabase.from("prescriptions").select("*").eq("patient_id", user.id).order("created_at", { ascending: false }).limit(5),
      supabase.from("medical_documents").select("*").eq("patient_id", user.id).order("uploaded_at", { ascending: false }).limit(5),
      supabase.from("payments").select("*").eq("patient_id", user.id).order("created_at", { ascending: false }),
    ]);
    setProfile(profileRes.data);
    setAppointments(apptRes.data ?? []);
    setPrescriptions(rxRes.data ?? []);
    setDocuments(docRes.data ?? []);
    setPayments(payRes.data ?? []);
  };

  useEffect(() => {
    if (!user) return;
    fetchData();

    // Subscribe to realtime changes on appointments and payments
    const channel = supabase
      .channel('patient-dashboard')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'appointments', filter: `patient_id=eq.${user.id}` },
        () => fetchData()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'payments', filter: `patient_id=eq.${user.id}` },
        () => fetchData()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'prescriptions', filter: `patient_id=eq.${user.id}` },
        () => fetchData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleVerifyConsultationCode = async (appointment: any) => {
    const code = consultationCodeInput[appointment.id]?.trim();
    if (!code) {
      toast.error(t("pd.enterCodeError"));
      return;
    }
    setVerifyingCode(appointment.id);
    try {
      const { data, error } = await supabase
        .from("appointments")
        .select("consultation_code, consultation_code_used, consultation_code_expires_at")
        .eq("id", appointment.id)
        .maybeSingle();

      if (error) throw error;

      if (!data || (data as any).consultation_code !== code) {
        toast.error(t("pd.invalidCode"));
        return;
      }
      if ((data as any).consultation_code_used) {
        toast.error(t("pd.codeUsed"));
        return;
      }

      const expiresAt = (data as any).consultation_code_expires_at ? new Date((data as any).consultation_code_expires_at) : null;
      if (expiresAt && new Date() > expiresAt) {
        toast.error(t("pd.codeExpired"));
        return;
      }

      await supabase
        .from("appointments")
        .update({ consultation_code_used: true, status: "confirmed" } as any)
        .eq("id", appointment.id);

      toast.success(t("pd.unlocked"));
      setAppointments((prev) =>
        prev.map((a) => a.id === appointment.id ? { ...a, consultation_code_used: true, status: "confirmed" } : a)
      );
    } catch (err: any) {
      toast.error(err.message || t("pd.verifyFailed"));
    } finally {
      setVerifyingCode(null);
    }
  };

  const upcomingAppointments = appointments.filter(
    (a) => a.status === "pending" || a.status === "confirmed"
  );

  const appointmentsWithNewCode = upcomingAppointments.filter((a) => {
    const payment = payments.find((p) => p.appointment_id === a.id);
    return payment?.status === "verified" && a.consultation_code && !a.consultation_code_used;
  });

  const statusColor: Record<string, string> = {
    pending: "bg-warning/10 text-warning",
    confirmed: "bg-success/10 text-success",
    completed: "bg-muted text-muted-foreground",
    cancelled: "bg-destructive/10 text-destructive",
  };
  const statusLabel = (s: string) => t(`pd.status.${s}`) || s;

  const getPaymentForAppt = (apptId: string) => payments.find((p) => p.appointment_id === apptId);

  if (selectedVideo) {
    return (
      <div className="container py-8">
        <Button variant="ghost" className="mb-4" onClick={() => setSelectedVideo(null)}>
          {t("pd.backToDash")}
        </Button>
        <VideoCall
          appointment={selectedVideo}
          userName={profile?.first_name ? `${profile.first_name} ${profile.last_name || ""}`.trim() : "Patient"}
          onClose={() => setSelectedVideo(null)}
        />
      </div>
    );
  }

  if (selectedChat) {
    return (
      <div className="container py-8">
        <Button variant="ghost" className="mb-4" onClick={() => setSelectedChat(null)}>
          {t("pd.backToDash")}
        </Button>
        <ConsultationChat appointment={selectedChat} currentUserId={user!.id} />
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Notification alert for new consultation codes */}
      {appointmentsWithNewCode.length > 0 && (
        <Alert className="mb-6 border-primary/30 bg-primary/5">
          <Bell className="h-5 w-5 text-primary" />
          <AlertTitle className="font-display font-semibold text-primary">
            {appointmentsWithNewCode.length > 1 ? t("pd.newCodeTitlePlural") : t("pd.newCodeTitle")}
          </AlertTitle>
          <AlertDescription className="text-sm text-muted-foreground">
            {appointmentsWithNewCode.length > 1
              ? `${appointmentsWithNewCode.length} ${t("pd.newCodeDescMany")}`
              : t("pd.newCodeDescOne")}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            {t("pd.welcome")}{profile?.first_name ? `, ${profile.first_name}` : ""}!
          </h1>
          <p className="text-muted-foreground text-sm">{t("pd.overview")}</p>
        </div>
        <Button asChild>
          <Link to="/doctors"><Calendar className="h-4 w-4 mr-2" /> {t("pd.book")}</Link>
        </Button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Calendar, label: t("pd.stat.upcoming"), value: upcomingAppointments.length, color: "text-primary" },
          { icon: FileText, label: t("pd.stat.documents"), value: documents.length, color: "text-secondary" },
          { icon: Pill, label: t("pd.stat.prescriptions"), value: prescriptions.length, color: "text-accent" },
          { icon: Clock, label: t("pd.stat.totalVisits"), value: appointments.length, color: "text-warning" },
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
        {/* Upcoming appointments with consultation code */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" /> {t("pd.upcomingTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">{t("pd.noUpcoming")}</p>
            ) : (
              <div className="space-y-3">
                {upcomingAppointments.map((a) => {
                  const payment = getPaymentForAppt(a.id);
                  const paymentVerified = payment?.status === "verified";
                  const consultationUnlocked = a.consultation_code_used;

                  return (
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
                            <p className="text-xs text-muted-foreground capitalize">{a.consultation_type} {t("pd.consultation")}</p>
                          </div>
                        </div>
                        <Badge className={statusColor[a.status] ?? ""} variant="secondary">
                          {statusLabel(a.status)}
                        </Badge>
                      </div>

                      {/* Payment status */}
                      {payment && (
                        <div className="flex items-center gap-2 pt-1">
                          <Badge className={
                            payment.status === "verified" ? "bg-success/10 text-success" :
                            payment.status === "rejected" ? "bg-destructive/10 text-destructive" :
                            "bg-warning/10 text-warning"
                          }>
                            <DollarSign className="h-3 w-3 mr-1" /> {t("pd.payment")} {payment.status}
                          </Badge>
                        </div>
                      )}

                      {/* Show consultation code after payment verified */}
                      {paymentVerified && !consultationUnlocked && a.consultation_code && (
                        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 space-y-2">
                          <p className="text-xs font-medium text-primary flex items-center gap-1">
                            <Key className="h-3.5 w-3.5" /> {t("pd.codeIs")}
                          </p>
                          <p className="font-mono text-lg font-bold text-primary tracking-wider">{a.consultation_code}</p>
                          <p className="text-xs text-muted-foreground">{t("pd.enterBelow")}</p>
                          <div className="flex gap-2">
                            <Input
                              placeholder={t("pd.enterCode")}
                              value={consultationCodeInput[a.id] || ""}
                              onChange={(e) => setConsultationCodeInput((prev) => ({ ...prev, [a.id]: e.target.value }))}
                              className="text-sm"
                            />
                            <Button
                              size="sm"
                              disabled={verifyingCode === a.id}
                              onClick={() => handleVerifyConsultationCode(a)}
                            >
                              {verifyingCode === a.id ? "..." : t("pd.verify")}
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Waiting for payment verification - no code yet */}
                      {paymentVerified && !consultationUnlocked && !a.consultation_code && (
                        <div className="p-2 rounded-lg bg-muted/50">
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {t("pd.processing")}
                          </p>
                        </div>
                      )}

                      {/* Code entered, waiting for doctor confirmation */}
                      {consultationUnlocked && a.status !== "confirmed" && (
                        <div className="p-3 rounded-lg bg-warning/5 border border-warning/20 space-y-2">
                          <p className="text-xs font-medium text-warning flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" /> {t("pd.codeVerified")}
                          </p>
                        </div>
                      )}

                      {/* Doctor confirmed - chat unlocked */}
                      {consultationUnlocked && a.status === "confirmed" && (
                        <div className="p-3 rounded-lg bg-success/5 border border-success/20 space-y-2">
                          <p className="text-xs font-medium text-success flex items-center gap-1">
                            <CheckCircle className="h-3.5 w-3.5" /> {t("pd.confirmedReady")}
                          </p>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => setSelectedChat(a)}>
                              <MessageSquare className="h-3.5 w-3.5 mr-1" /> {t("pd.openChat")}
                            </Button>
                            <Button size="sm" onClick={() => setSelectedVideo(a)}>
                              <Video className="h-3.5 w-3.5 mr-1" /> {t("pd.videoCall")}
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Locked state */}
                      {!paymentVerified && !consultationUnlocked && payment && payment.status !== "rejected" && (
                        <div className="p-2 rounded-lg bg-muted/50">
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Lock className="h-3 w-3" /> {t("pd.waitPayment")}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent prescriptions */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Pill className="h-5 w-5 text-accent" /> {t("pd.rxTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {prescriptions.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">{t("pd.noRx")}</p>
            ) : (
              <div className="space-y-3">
                {prescriptions.map((rx: any) => (
                  <div key={rx.id} className="p-3 rounded-lg border space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">{rx.diagnosis || t("pd.rxFallback")}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(rx.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {rx.notes && (
                      <p className="text-xs text-muted-foreground">{rx.notes}</p>
                    )}
                    {Array.isArray(rx.medications) && rx.medications.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {rx.medications.map((med: string, i: number) => (
                          <Badge key={i} variant="secondary" className="text-xs">{med}</Badge>
                        ))}
                      </div>
                    )}
                    {rx.file_url && (
                      <a
                        href={rx.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                      >
                        <FileText className="h-3.5 w-3.5" /> {t("pd.viewRxDoc")}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Documents */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-secondary" /> {t("pd.docsTitle")}
            </CardTitle>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-1" /> {t("pd.upload")}
            </Button>
          </CardHeader>
          <CardContent>
            {documents.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">{t("pd.noDocs")}</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-3 p-3 rounded-lg border">
                    <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-secondary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">{doc.file_name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{doc.document_type.replace("_", " ")}</p>
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
