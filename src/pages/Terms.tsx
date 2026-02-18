export default function Terms() {
  return (
    <div className="container py-16 max-w-3xl prose prose-sm">
      <h1 className="font-display text-3xl font-bold text-foreground">Terms of Service</h1>
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
  );
}
