"use client";

import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { Icon } from "@/components/Icon";
import { useI18n } from "@/components/LanguageProvider";
import { useToast } from "@/components/ToastProvider";

export default function HowItWorksPage() {
  const { t } = useI18n();
  const toast = useToast();

  const roles = [
    {
      icon: "school",
      title: "common.school",
      items: [
        "اختر «ابحث عن معلم» أو «انشر وظيفة» أو «طلب عاجل».",
        "حدد المادة والصف والمنطقة ونمط التدريس والوقت.",
        "راجع النتائج مرتبة حسب المطابقة وافتح ملف المعلم.",
        "أرسل طلب تواصل — يصل للمعلم بالإشعار.",
        "بعد قبول المعلم تظهر وسائل التواصل المسموح بها.",
      ],
    },
    {
      icon: "user",
      title: "common.parent",
      items: [
        "ابحث عن مدرس حسب المادة والصف والمنطقة.",
        "رتّب النتائج حسب المطابقة أو التقييم أو الخبرة.",
        "احفظ الملفات وقارن بينها قبل القرار.",
        "أرسل طلب تواصل أو سؤالًا مباشرة من الملف.",
        "عند عدم وجود نتائج: بدائل، نشر طلب، أو تنبيه.",
      ],
    },
    {
      icon: "award",
      title: "common.teacher",
      items: [
        "أنشئ حسابًا واختر دور «معلم».",
        "أكمل ملفك: البيانات، المؤهلات، المواد، المنطقة، التوفر.",
        "ارفع مستندات التوثيق وانتظر المراجعة.",
        "استقبل طلبات التواصل ووافق أو ارفض.",
        "تصلك الطلبات العاجلة المطابقة لموادك مباشرة.",
      ],
    },
  ];

  return (
    <>
      <section className="hero" style={{ paddingBlock: "56px 48px" }}>
        <div className="container">
          <span className="hero__eyebrow">{t("nav.how")}</span>
          <h1>{t("how.page.title")}</h1>
          <p className="hero__sub">{t("how.page.lead")}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-3 steps">
            {[
              ["how.s1.title", "how.s1.desc"],
              ["how.s2.title", "how.s2.desc"],
              ["how.s3.title", "how.s3.desc"],
            ].map(([title, desc]) => (
              <div className="step" key={title}>
                <div className="step__num" />
                <h3>{t(title)}</h3>
                <p>{t(desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--lavender">
        <div className="container">
          <div className="section-head">
            <h2>مسار كل دور</h2>
            <p>تفاصيل العملية من البداية إلى التواصل، لكل طرف في المنصة.</p>
          </div>
          <div className="grid grid-3">
            {roles.map((r) => (
              <div className="card" key={r.title}>
                <div className="row" style={{ gap: 10, marginBottom: 10 }}>
                  <span className="role-card__icon" style={{ width: 40, height: 40, margin: 0 }}>
                    <Icon name={r.icon} />
                  </span>
                  <h3 style={{ margin: 0, fontSize: 16 }}>{t(r.title)}</h3>
                </div>
                <ol className="small muted" style={{ paddingInlineStart: 18 }}>
                  {r.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: "center", gap: 40 }}>
            <div>
              <h2>عندما لا توجد نتائج</h2>
              <p className="muted">
                عدم وجود نتيجة مناسبة ليس نهاية الطريق — المنصة تقترح مسارات بديلة واضحة.
              </p>
              <div className="stack" style={{ gap: 10 }}>
                {[
                  "اقتراح بدائل قريبة مع توضيح الفروق",
                  "نشر طلبك ليصل للمعلمين المناسبين",
                  "حفظ البحث وتفعيل تنبيه عند ظهور تطابق",
                ].map((item, i) => (
                  <div className="row" style={{ gap: 10 }} key={item}>
                    <span className="chip chip--lavender">{i + 1}</span>
                    <span className="small">{item}</span>
                  </div>
                ))}
              </div>
              <Link className="btn mt-lg" href="/search">
                {t("common.searchTeacher")}
              </Link>
            </div>
            <EmptyState title={t("search.noResults")} description={t("search.noResultsDesc")}>
              <Link className="btn btn--sm" href="/urgent">
                {t("search.postRequest")}
              </Link>
              <button
                className="btn btn--ghost btn--sm"
                type="button"
                onClick={() => toast(t("search.saved"), "success")}
              >
                {t("search.notify")}
              </button>
            </EmptyState>
          </div>
        </div>
      </section>
    </>
  );
}
