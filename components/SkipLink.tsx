"use client";

import { useI18n } from "./LanguageProvider";

export function SkipLink() {
  const { lang } = useI18n();
  return (
    <a className="skip-link" href="#main">
      {lang === "ar" ? "تخطَّ إلى المحتوى" : "Skip to content"}
    </a>
  );
}
