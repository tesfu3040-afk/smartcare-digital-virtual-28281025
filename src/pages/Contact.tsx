import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAppSettings } from "@/hooks/use-app-settings";
import clinicalBg from "@/assets/clinical-bg.png";
import { useLanguage } from "@/lib/i18n";

export default function Contact() {
  const { t } = useLanguage();
  const [sending, setSending] = useState(false);
  const { settings, loading } = useAppSettings();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    const { error } = await supabase.from("contact_messages" as any).insert({
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message,
    } as any);
    if (error) {
      toast.error(t("contact.failed"));
    } else {
      toast.success(t("contact.success"));
      setForm({ name: "", email: "", subject: "", message: "" });
    }
    setSending(false);
  };

  const contactPhone = settings.contact_phone || "1-800-123-4567";
  const contactEmail = settings.contact_email || "support@smartcare.com";

  return (
    <div>
      <section className="relative py-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(211, 80%, 35%) 0%, hsl(211, 80%, 42%) 50%, hsl(199, 89%, 40%) 100%)' }}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(${clinicalBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="container text-center max-w-3xl relative z-10">
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-white">{t("contact.heroTitle")}</h1>
          <p className="mt-4 text-lg text-white/80">{t("contact.heroDesc")}</p>
        </div>
      </section>

      <section className="container py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="font-display font-bold text-xl text-foreground mb-6">{t("contact.sendUs")}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input placeholder={t("contact.name")} required maxLength={100} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    <Input placeholder={t("contact.emailAddr")} type="email" required maxLength={255} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <Input placeholder={t("contact.subject")} required maxLength={200} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                  <Textarea placeholder={t("contact.message")} rows={5} required maxLength={1000} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                  <Button type="submit" disabled={sending}>
                    <Send className="h-4 w-4 mr-2" /> {sending ? t("contact.sending") : t("contact.send")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {[
              { icon: Phone, title: t("contact.phone"), detail: contactPhone, sub: t("contact.phoneHrs") },
              { icon: Mail, title: t("contact.emailLabel"), detail: contactEmail, sub: t("contact.emailReply") },
              { icon: MapPin, title: t("contact.address"), detail: t("contact.addrLine1"), sub: t("contact.addrLine2") },
              { icon: Clock, title: t("contact.hours"), detail: t("contact.hours247"), sub: t("contact.hoursSupport") },
            ].map((c) => (
              <Card key={c.title}>
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <c.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-sm text-foreground">{c.title}</p>
                    <p className="text-sm text-foreground">{c.detail}</p>
                    <p className="text-xs text-muted-foreground">{c.sub}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
