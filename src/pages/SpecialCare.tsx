import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Baby,
  Heart,
  HeartPulse,
  Stethoscope,
  ShieldCheck,
  Calendar,
  Users,
  Activity,
  ArrowRight,
  Pill,
  Brain,
  Eye,
  Accessibility,
} from "lucide-react";
import { motion } from "framer-motion";
import clinicalBg from "@/assets/clinical-bg.png";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5 },
  }),
};

const maternalServices = [
  {
    icon: HeartPulse,
    title: "Prenatal Care",
    desc: "Regular check-ups, ultrasound scheduling, nutrition guidance, and monitoring throughout your pregnancy journey.",
    features: ["Trimester Tracking", "Ultrasound Scheduling", "Nutrition Plans"],
  },
  {
    icon: ShieldCheck,
    title: "High-Risk Pregnancy",
    desc: "Specialized monitoring and consultations for high-risk pregnancies including gestational diabetes and preeclampsia.",
    features: ["24/7 Monitoring", "Specialist Referrals", "Emergency Support"],
  },
  {
    icon: Baby,
    title: "Birth Planning",
    desc: "Comprehensive birth plans, labor preparation classes, and delivery options consultation with experienced OB-GYNs.",
    features: ["Birth Plan Builder", "Lamaze Classes", "Delivery Options"],
  },
  {
    icon: Heart,
    title: "Postnatal Care",
    desc: "Postpartum recovery support, breastfeeding guidance, mental health check-ins, and newborn care advice.",
    features: ["Recovery Tracking", "Lactation Support", "PPD Screening"],
  },
];

const childrenServices = [
  {
    icon: Stethoscope,
    title: "Pediatric Consultations",
    desc: "General health check-ups, vaccinations, growth monitoring, and sick-child consultations with certified pediatricians.",
    features: ["Growth Charts", "Vaccine Tracker", "Sick-Child Visits"],
  },
  {
    icon: Brain,
    title: "Developmental Screening",
    desc: "Milestone tracking, behavioral assessments, and early intervention referrals for developmental concerns.",
    features: ["Milestone Tracking", "Behavioral Assessments", "Early Intervention"],
  },
  {
    icon: Pill,
    title: "Child Nutrition",
    desc: "Diet planning, allergy management, and nutritional guidance tailored to your child's age and needs.",
    features: ["Diet Plans", "Allergy Management", "Supplement Guidance"],
  },
  {
    icon: Activity,
    title: "Emergency Pediatrics",
    desc: "Urgent care consultations for childhood emergencies — fevers, injuries, allergic reactions, and more.",
    features: ["24/7 Availability", "Triage Support", "Follow-up Care"],
  },
];

const elderServices = [
  {
    icon: HeartPulse,
    title: "Chronic Disease Management",
    desc: "Ongoing management of diabetes, hypertension, arthritis, and other chronic conditions common in seniors.",
    features: ["Vitals Monitoring", "Medication Management", "Regular Check-ups"],
  },
  {
    icon: Eye,
    title: "Geriatric Assessments",
    desc: "Comprehensive geriatric evaluations including cognitive screening, fall risk, and functional assessments.",
    features: ["Cognitive Screening", "Fall Prevention", "Functional Tests"],
  },
  {
    icon: Accessibility,
    title: "Mobility & Rehabilitation",
    desc: "Physical therapy consultations, mobility exercises, and rehabilitation programs for seniors recovering from surgery or illness.",
    features: ["PT Consultations", "Exercise Programs", "Recovery Plans"],
  },
  {
    icon: Users,
    title: "Caregiver Support",
    desc: "Resources and consultations for family caregivers, including respite care coordination and training.",
    features: ["Caregiver Training", "Support Groups", "Respite Coordination"],
  },
];

interface ServiceSectionProps {
  title: string;
  subtitle: string;
  services: typeof maternalServices;
  accent: string;
  iconBg: string;
}

function ServiceSection({ title, subtitle, services, accent, iconBg }: ServiceSectionProps) {
  return (
    <section className="py-16">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">{title}</h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <Card className="h-full group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <CardContent className="p-6 flex flex-col h-full">
                  <div
                    className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${iconBg} group-hover:bg-primary`}
                  >
                    <s.icon className={`h-6 w-6 ${accent} group-hover:text-primary-foreground transition-colors`} />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-foreground">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground flex-1">{s.desc}</p>
                  <ul className="mt-4 space-y-1">
                    {s.features.map((f) => (
                      <li key={f} className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function SpecialCare() {
  return (
    <div>
      {/* Hero */}
      <section
        className="relative py-20 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, hsl(211, 80%, 35%) 0%, hsl(211, 80%, 42%) 50%, hsl(199, 89%, 40%) 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${clinicalBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="container text-center max-w-3xl relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 text-sm text-white/90">
              <Heart className="h-4 w-4" /> Specialized Family Care
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-extrabold text-white">
              Special Care for Every <span className="text-accent">Stage of Life</span>
            </h1>
            <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
              Dedicated healthcare programs for mothers, children, and elders — because every family member deserves
              personalized, expert medical attention.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
                <Link to="/doctors">
                  <Calendar className="h-4 w-4 mr-2" /> Book a Specialist
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
                asChild
              >
                <Link to="/contact">Talk to Us</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Maternal Care */}
      <ServiceSection
        title="👩‍🍼 Maternal & Pregnancy Care"
        subtitle="Comprehensive support from conception through postpartum recovery. Our specialists guide you every step of the way."
        services={maternalServices}
        accent="text-pink-600"
        iconBg="bg-pink-100"
      />

      <div className="border-t" />

      {/* Children's Care */}
      <ServiceSection
        title="👶 Children's Healthcare"
        subtitle="Expert pediatric care to keep your little ones healthy, happy, and thriving from infancy through adolescence."
        services={childrenServices}
        accent="text-sky-600"
        iconBg="bg-sky-100"
      />

      <div className="border-t" />

      {/* Elder Care */}
      <ServiceSection
        title="🧓 Elder Care Programs"
        subtitle="Compassionate, specialized care for seniors — helping them maintain independence, dignity, and quality of life."
        services={elderServices}
        accent="text-amber-600"
        iconBg="bg-amber-100"
      />

      {/* CTA */}
      <section
        className="py-16"
        style={{
          background:
            "linear-gradient(135deg, hsl(211, 80%, 35%) 0%, hsl(211, 80%, 42%) 50%, hsl(199, 89%, 40%) 100%)",
        }}
      >
        <div className="container text-center space-y-6">
          <h2 className="font-display text-3xl font-bold text-white">
            Ready to Get Specialized Care?
          </h2>
          <p className="text-white/80 max-w-lg mx-auto">
            Book an appointment with our maternal, pediatric, or geriatric specialists today.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
              <Link to="/doctors">
                Find a Specialist <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
              <Link to="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
