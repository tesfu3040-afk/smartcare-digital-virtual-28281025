import clinicalBg from "@/assets/clinical-bg.png";
import { useLanguage } from "@/lib/i18n";

export default function Privacy() {
  const { t } = useLanguage();
  return (
    <div>
      <section className="relative py-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(211, 80%, 35%) 0%, hsl(211, 80%, 42%) 50%, hsl(199, 89%, 40%) 100%)' }}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(${clinicalBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="container text-center max-w-3xl relative z-10">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white">{t("privacy.title")}</h1>
          <p className="mt-2 text-white/80">{t("privacy.updated")} {new Date().toLocaleDateString()}</p>
        </div>
      </section>
      <div className="container py-16 max-w-3xl prose prose-sm">
      <p className="text-muted-foreground">{t("privacy.updated")} {new Date().toLocaleDateString()}</p>

      <h2 className="font-display text-xl font-semibold text-foreground mt-8">{t("privacy.h1")}</h2>
      <p className="text-muted-foreground">{t("privacy.p1")}</p>

      <h2 className="font-display text-xl font-semibold text-foreground mt-8">{t("privacy.h2")}</h2>
      <p className="text-muted-foreground">{t("privacy.p2")}</p>

      <h2 className="font-display text-xl font-semibold text-foreground mt-8">{t("privacy.h3")}</h2>
      <p className="text-muted-foreground">{t("privacy.p3")}</p>

      <h2 className="font-display text-xl font-semibold text-foreground mt-8">{t("privacy.h4")}</h2>
      <p className="text-muted-foreground">{t("privacy.p4")}</p>

      <h2 className="font-display text-xl font-semibold text-foreground mt-8">{t("privacy.h5")}</h2>
      <p className="text-muted-foreground">{t("privacy.p5")}</p>
      </div>
    </div>
  );
}
