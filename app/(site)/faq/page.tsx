"use client";

import Link from "next/link";
import { useI18n } from "@/components/LanguageProvider";

export default function FaqPage() {
  const { t } = useI18n();
  const faqs = [
    ["faq.q1", "faq.a1"],
    ["faq.q2", "faq.a2"],
    ["faq.q3", "faq.a3"],
    ["faq.q4", "faq.a4"],
    ["faq.q5", "faq.a5"],
    ["faq.q6", "faq.a6"],
  ];

  return (
    <div className="container" style={{ maxWidth: 820, paddingBlock: 64 }}>
      <div className="section-head center" style={{ marginInline: "auto" }}>
        <h1>{t("faq.title")}</h1>
        <p>{t("faq.sub")}</p>
      </div>
      <div className="accordion">
        {faqs.map(([q, a], i) => (
          <details className="acc" key={q} open={i === 0}>
            <summary>{t(q)}</summary>
            <div className="acc__body">{t(a)}</div>
          </details>
        ))}
      </div>
      <div className="card mt-xl center">
        <h3 style={{ fontSize: 17 }}>{t("footer.contact")}</h3>
        <p className="small muted">لم تجد إجابتك؟ فريق منهل جاهز للمساعدة.</p>
        <Link className="btn" href="/contact">
          {t("footer.contact")}
        </Link>
      </div>
    </div>
  );
}
