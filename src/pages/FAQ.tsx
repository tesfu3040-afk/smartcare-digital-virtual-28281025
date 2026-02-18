import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const faqs = [
  { q: "How do I book an appointment?", a: "Sign up for a free account, browse our list of doctors, select your preferred doctor, choose a date and time, and confirm your booking." },
  { q: "What types of consultations are available?", a: "We offer video consultations, chat consultations, and in-person visits at select locations." },
  { q: "How much does a consultation cost?", a: "Consultation fees vary by doctor and specialty. You can see each doctor's fee on their profile page before booking." },
  { q: "Can I get a prescription online?", a: "Yes! After your consultation, your doctor can issue an e-prescription that you can use at any pharmacy or have delivered." },
  { q: "How do I access my lab results?", a: "Lab results are uploaded to your patient dashboard where you can view and download them anytime." },
  { q: "Is my data secure?", a: "Absolutely. We use industry-standard encryption and comply with healthcare data protection regulations." },
  { q: "Can I choose a specific doctor?", a: "Yes, you can browse doctors by specialty, read their profiles, and choose the one that best fits your needs." },
  { q: "What if I need to cancel my appointment?", a: "You can cancel or reschedule appointments from your dashboard up to 2 hours before the scheduled time." },
  { q: "How do I become a doctor on SmartCare?", a: "Register as a doctor, submit your credentials, and our admin team will review and approve your account." },
  { q: "Do you offer mental health services?", a: "Yes, we have licensed therapists and psychiatrists available for therapy sessions, counseling, and medication management." },
];

export default function FAQ() {
  return (
    <div>
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16">
        <div className="container text-center max-w-3xl">
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-foreground">Frequently Asked Questions</h1>
          <p className="mt-4 text-lg text-muted-foreground">Find answers to common questions about SmartCare.</p>
        </div>
      </section>

      <section className="container py-16 max-w-3xl">
        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border rounded-lg px-4">
              <AccordionTrigger className="text-left font-display font-semibold text-foreground">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center mt-12 space-y-3">
          <p className="text-muted-foreground">Still have questions?</p>
          <Button asChild>
            <Link to="/contact">Contact Support</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
