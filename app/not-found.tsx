"use client";

import Link from "next/link";
import { useI18n } from "@/components/LanguageProvider";

export default function NotFound() {
  const { t } = useI18n();
  return (
    <div className="auth-wrap">
      <div className="empty" style={{ maxWidth: 520, borderStyle: "solid" }}>
        <div className="empty__icon" style={{ fontSize: 26, fontWeight: 800, color: "var(--primary)" }}>
          404
        </div>
        <h1 style={{ fontSize: 24, margin: 0 }}>
          {t("nav.home") === "Home" ? "Page not found" : "الصفحة غير موجودة"}
        </h1>
        <p>
          {t("nav.home") === "Home"
            ? "The link you requested is incorrect or has moved. Try the home page or search for a teacher."
            : "الرابط الذي طلبته غير صحيح أو تم نقله. جرّب العودة إلى الصفحة الرئيسية أو البحث عن معلم."}
        </p>
        <div className="row" style={{ gap: 8, justifyContent: "center" }}>
          <Link className="btn" href="/">
            {t("nav.home")}
          </Link>
          <Link className="btn btn--ghost" href="/search">
            {t("common.searchTeacher")}
          </Link>
        </div>
      </div>
    </div>
  );
}
