"use client";

import Link from "next/link";
import { Icon } from "@/components/Icon";
import { useI18n } from "@/components/LanguageProvider";

export default function AboutPage() {
  const { t } = useI18n();

  return (
    <>
      <section className="hero" style={{ paddingBlock: "64px 56px" }}>
        <div className="container">
          <span className="hero__eyebrow">{t("nav.about")}</span>
          <h1>{t("about.title")}</h1>
          <p className="hero__sub">{t("about.lead")}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-2" style={{ gap: 32 }}>
            {[
              ["about.mission", "about.missionText"],
              ["about.vision", "about.visionText"],
            ].map(([title, body]) => (
              <div className="card card--pad-lg" key={title}>
                <span className="chip chip--lavender">{t(title)}</span>
                <h2 className="mt-sm" style={{ fontSize: 22 }}>
                  {t(title)}
                </h2>
                <p className="muted" style={{ marginBottom: 0 }}>
                  {t(body)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--lavender">
        <div className="container">
          <div className="section-head">
            <h2>لماذا اسم «منهل»؟</h2>
            <p>الاسم عربي أصيل، ومعناه موضع ورود الماء والشرب منه — مورد يستقي منه الناس ما يحتاجون.</p>
          </div>
          <div className="grid grid-3">
            {[
              ["للمعلم", "منهل للفرص الوظيفية والوصول إلى الطلاب."],
              ["للمدرسة", "منهل للعثور على المعلمين المناسبين عند وجود شاغر."],
              ["لولي الأمر", "منهل للوصول إلى معلم مناسب للدروس الخصوصية."],
            ].map(([title, body]) => (
              <div className="card" key={title}>
                <h4>{title}</h4>
                <p className="small muted" style={{ marginBottom: 0 }}>
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>{t("about.values")}</h2>
          </div>
          <div className="grid grid-3">
            {[
              ["info", "about.v1", "about.v1d"],
              ["lock", "about.v2", "about.v2d"],
              ["shield", "about.v3", "about.v3d"],
            ].map(([icon, title, body]) => (
              <div className="feature" key={title}>
                <div className="feature__icon">
                  <Icon name={icon} />
                </div>
                <div>
                  <h3>{t(title)}</h3>
                  <p>{t(body)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <div className="cta-band">
            <h2>{t("cta.title")}</h2>
            <p>{t("cta.desc")}</p>
            <div
              className="row"
              style={{ justifyContent: "center", gap: 10, flexWrap: "wrap", marginTop: 20 }}
            >
              <Link className="btn btn--secondary btn--lg" href="/role-select">
                {t("cta.primary")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
