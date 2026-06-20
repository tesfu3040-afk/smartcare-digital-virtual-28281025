import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Video, MessageSquare, FlaskConical, Pill, Brain, HeartPulse, Truck, FileText, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import clinicalBg from "@/assets/clinical-bg.png";
import { useLanguage } from "@/lib/i18n";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

export default function Services() {
  const { t } = useLanguage();
  const services = [
    { icon: Video, key: "telemedicine" },
    { icon: MessageSquare, key: "chat" },
    { icon: FlaskConical, key: "lab" },
    { icon: Pill, key: "pharm" },
    { icon: Brain, key: "mental" },
    { icon: FileText, key: "eprescription" },
    { icon: HeartPulse, key: "monitor" },
    { icon: Truck, key: "delivery" },
  ];
  return (
    <div>
      <section className="relative py-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(211, 80%, 35%) 0%, hsl(211, 80%, 42%) 50%, hsl(199, 89%, 40%) 100%)' }}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(${clinicalBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="container text-center max-w-3xl relative z-10">
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-white">{t("services.heroTitle")}</h1>
          <p className="mt-4 text-lg text-white/80">{t("services.heroDesc")}</p>
        </div>
      </section>

      <section className="container py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <motion.div key={s.key} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <Card className="h-full group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                    <s.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-foreground">{t(`services.${s.key}.title`)}</h3>
                  <p className="mt-2 text-sm text-muted-foreground flex-1">{t(`services.${s.key}.desc`)}</p>
                  <ul className="mt-4 space-y-1">
                    {["f1", "f2", "f3"].map((f) => (
                      <li key={f} className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {t(`services.${s.key}.${f}`)}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-muted/50 py-16">
        <div className="container text-center space-y-6">
          <h2 className="font-display text-3xl font-bold text-foreground">{t("services.ctaTitle")}</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">{t("services.ctaDesc")}</p>
          <Button size="lg" asChild>
            <Link to="/doctors">{t("services.ctaBtn")} <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
