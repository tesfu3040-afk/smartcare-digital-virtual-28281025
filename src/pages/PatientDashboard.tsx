import { useEffect, useState, useRef } from "react";
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
  Image,
  Key,
  CheckCircle,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

export default function PatientDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTargetAppt, setUploadTargetAppt] = useState<any>(null);
  const [consultationCodeInput, setConsultationCodeInput] = useState<Record<string, string>>({});
  const [verifyingCode, setVerifyingCode] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
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
    fetchData();
  }, [user]);

  const handleUploadScreenshot = async (file: File, appointment: any) => {
    if (!user) return;
    setUploading(appointment.id);
    try {
      const filePath = `${user.id}/${appointment.id}_${Date.now()}.${file.name.split('.').pop()}`;
      const { error: uploadError } = await supabase.storage
        .from("payment-screenshots")
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("payment-screenshots")
        .getPublicUrl(filePath);

      const existingPayment = payments.find((p) => p.appointment_id === appointment.id);
      if (existingPayment) {
        await supabase.from("payments").update({
          screenshot_url: urlData.publicUrl,
          status: "submitted",
        }).eq("id", existingPayment.id);
      } else {
        await supabase.from("payments").insert({
          appointment_id: appointment.id,
          patient_id: user.id,
          doctor_id: appointment.doctor_id,
          amount: 0,
          screenshot_url: urlData.publicUrl,
          status: "submitted",
        });
      }

      toast.success("Payment screenshot uploaded! Admin will verify shortly.");
      const { data } = await supabase.from("payments").select("*").eq("patient_id", user.id);
      setPayments(data ?? []);
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(null);
      setUploadTargetAppt(null);
    }
  };

  const handleVerifyConsultationCode = async (appointment: any) => {
    const code = consultationCodeInput[appointment.id]?.trim();
    if (!code) {
      toast.error("Please enter the consultation code");
      return;
    }
    setVerifyingCode(appointment.id);
    try {
      // Check if code matches and hasn't been used
      const { data, error } = await supabase
        .from("appointments")
        .select("consultation_code, consultation_code_used, appointment_date, appointment_time")
        .eq("id", appointment.id)
        .maybeSingle();

      if (error) throw error;

      if (!data || (data as any).consultation_code !== code) {
        toast.error("Invalid consultation code");
        return;
      }
      if ((data as any).consultation_code_used) {
        toast.error("This consultation code has already been used");
        return;
      }

      // Check if appointment time has passed
      const apptDateTime = new Date(`${data.appointment_date}T${data.appointment_time}`);
      if (new Date() > apptDateTime) {
        toast.error("This consultation code has expired (appointment time has passed)");
        return;
      }

      // Mark code as used
      await supabase
        .from("appointments")
        .update({ consultation_code_used: true } as any)
        .eq("id", appointment.id);

      toast.success("Consultation unlocked! You can now chat or video call with your doctor.");
      setAppointments((prev) =>
        prev.map((a) => a.id === appointment.id ? { ...a, consultation_code_used: true } : a)
      );
    } catch (err: any) {
      toast.error(err.message || "Verification failed");
    } finally {
      setVerifyingCode(null);
    }
  };

  const upcomingAppointments = appointments.filter(
    (a) => a.status === "pending" || a.status === "confirmed"
  );

  const statusColor: Record<string, string> = {
    pending: "bg-warning/10 text-warning",
    confirmed: "bg-success/10 text-success",
    completed: "bg-muted text-muted-foreground",
    cancelled: "bg-destructive/10 text-destructive",
  };

  const getPaymentForAppt = (apptId: string) => payments.find((p) => p.appointment_id === apptId);

  return (
    <div className="container py-8">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && uploadTargetAppt) {
            handleUploadScreenshot(file, uploadTargetAppt);
          }
          e.target.value = "";
        }}
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Welcome{profile?.first_name ? `, ${profile.first_name}` : ""}!
          </h1>
          <p className="text-muted-foreground text-sm">Here's your health overview</p>
        </div>
        <Button asChild>
          <Link to="/doctors"><Calendar className="h-4 w-4 mr-2" /> Book Appointment</Link>
        </Button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Calendar, label: "Upcoming", value: upcomingAppointments.length, color: "text-primary" },
          { icon: FileText, label: "Documents", value: documents.length, color: "text-secondary" },
          { icon: Pill, label: "Prescriptions", value: prescriptions.length, color: "text-accent" },
          { icon: Clock, label: "Total Visits", value: appointments.length, color: "text-warning" },
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
        {/* Upcoming appointments with payment & consultation code */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" /> Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">No upcoming appointments</p>
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
                              {a.appointment_date} at {a.appointment_time}
                            </p>
                            <p className="text-xs text-muted-foreground capitalize">{a.consultation_type} consultation</p>
                          </div>
                        </div>
                        <Badge className={statusColor[a.status] ?? ""} variant="secondary">
                          {a.status}
                        </Badge>
                      </div>

                      {/* Step 1: Payment upload */}
                      <div className="flex items-center gap-2 pt-1">
                        {payment ? (
                          <Badge className={
                            payment.status === "verified" ? "bg-success/10 text-success" :
                            payment.status === "rejected" ? "bg-destructive/10 text-destructive" :
                            "bg-warning/10 text-warning"
                          }>
                            <DollarSign className="h-3 w-3 mr-1" /> Payment: {payment.status}
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={uploading === a.id}
                            onClick={() => {
                              setUploadTargetAppt(a);
                              fileInputRef.current?.click();
                            }}
                          >
                            <Image className="h-3.5 w-3.5 mr-1" />
                            {uploading === a.id ? "Uploading..." : "Upload Payment Screenshot"}
                          </Button>
                        )}
                      </div>

                      {/* Step 2: Enter consultation code (only after payment verified) */}
                      {paymentVerified && !consultationUnlocked && (
                        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 space-y-2">
                          <p className="text-xs font-medium text-primary flex items-center gap-1">
                            <Key className="h-3.5 w-3.5" /> Enter your consultation code to unlock chat/video
                          </p>
                          <div className="flex gap-2">
                            <Input
                              placeholder="e.g. SC-ABCD1234"
                              value={consultationCodeInput[a.id] || ""}
                              onChange={(e) => setConsultationCodeInput((prev) => ({ ...prev, [a.id]: e.target.value }))}
                              className="text-sm"
                            />
                            <Button
                              size="sm"
                              disabled={verifyingCode === a.id}
                              onClick={() => handleVerifyConsultationCode(a)}
                            >
                              {verifyingCode === a.id ? "..." : "Verify"}
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Step 3: Consultation unlocked */}
                      {consultationUnlocked && (
                        <div className="p-3 rounded-lg bg-success/5 border border-success/20">
                          <p className="text-xs font-medium text-success flex items-center gap-1">
                            <CheckCircle className="h-3.5 w-3.5" /> Consultation unlocked — you can now chat or video call with your doctor
                          </p>
                        </div>
                      )}

                      {/* Locked state */}
                      {!paymentVerified && !consultationUnlocked && payment && payment.status !== "rejected" && (
                        <div className="p-2 rounded-lg bg-muted/50">
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Lock className="h-3 w-3" /> Waiting for admin to verify payment before you can access consultation
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
              <Pill className="h-5 w-5 text-accent" /> Recent Prescriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {prescriptions.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">No prescriptions yet</p>
            ) : (
              <div className="space-y-3">
                {prescriptions.map((rx) => (
                  <div key={rx.id} className="p-3 rounded-lg border">
                    <p className="text-sm font-medium text-foreground">{rx.diagnosis || "Prescription"}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(rx.created_at).toLocaleDateString()}
                    </p>
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
              <FileText className="h-5 w-5 text-secondary" /> Medical Documents
            </CardTitle>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-1" /> Upload
            </Button>
          </CardHeader>
          <CardContent>
            {documents.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">No documents uploaded yet</p>
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
