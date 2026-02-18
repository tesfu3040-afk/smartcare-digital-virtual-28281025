import clinicalBg from "@/assets/clinical-bg.png";

export default function Terms() {
  return (
    <div>
      <section className="relative py-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(211, 80%, 35%) 0%, hsl(211, 80%, 42%) 50%, hsl(199, 89%, 40%) 100%)' }}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(${clinicalBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="container text-center max-w-3xl relative z-10">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white">Terms of Service</h1>
          <p className="mt-2 text-white/80">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </section>
      <div className="container py-16 max-w-3xl prose prose-sm">
      <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

      <h2 className="font-display text-xl font-semibold text-foreground mt-8">1. Acceptance of Terms</h2>
      <p className="text-muted-foreground">By using SmartCare, you agree to these terms. If you do not agree, please do not use our services.</p>

      <h2 className="font-display text-xl font-semibold text-foreground mt-8">2. Services</h2>
      <p className="text-muted-foreground">SmartCare provides virtual healthcare consultation services. Our platform connects patients with licensed healthcare professionals for telemedicine consultations.</p>

      <h2 className="font-display text-xl font-semibold text-foreground mt-8">3. User Responsibilities</h2>
      <p className="text-muted-foreground">Users must provide accurate personal and medical information. Misuse of the platform, including providing false information, may result in account termination.</p>

      <h2 className="font-display text-xl font-semibold text-foreground mt-8">4. Medical Disclaimer</h2>
      <p className="text-muted-foreground">SmartCare is not a substitute for in-person emergency medical care. In case of medical emergency, call 911 or visit your nearest emergency room.</p>

      <h2 className="font-display text-xl font-semibold text-foreground mt-8">5. Limitation of Liability</h2>
      <p className="text-muted-foreground">SmartCare provides a platform for healthcare services but is not liable for medical advice given by individual healthcare providers on our platform.</p>
      </div>
    </div>
  );
}
