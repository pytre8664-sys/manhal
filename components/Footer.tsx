"use client";

import Link from "next/link";
import { Icon } from "./Icon";
import { useI18n } from "./LanguageProvider";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <Link className="brand" href="/">
              <span className="brand__mark">
                <Icon name="book" />
              </span>
              <span className="brand__text">
                <span className="brand__name">{t("brand.name")}</span>
                <span className="brand__tag">{t("brand.tag")}</span>
              </span>
            </Link>
            <p className="small muted mt-md">{t("footer.about")}</p>
          </div>

          <div className="footer-col">
            <h4>{t("footer.platform")}</h4>
            <Link href="/how-it-works">{t("footer.how")}</Link>
            <Link href="/search">{t("footer.search")}</Link>
            <Link href="/urgent">{t("footer.urgent")}</Link>
            <Link href="/post-job">{t("dash.postJob")}</Link>
          </div>

          <div className="footer-col">
            <h4>{t("footer.roles")}</h4>
            <Link href="/dashboard-school">{t("common.school")}</Link>
            <Link href="/dashboard-parent">{t("common.parent")}</Link>
            <Link href="/dashboard-teacher">{t("common.teacher")}</Link>
            <Link href="/role-select">{t("nav.start")}</Link>
          </div>

          <div className="footer-col">
            <h4>{t("footer.legal")}</h4>
            <Link href="/about">{t("footer.aboutUs")}</Link>
            <Link href="/faq">{t("footer.faq")}</Link>
            <Link href="/contact">{t("footer.contact")}</Link>
            <Link href="/privacy">{t("footer.privacy")}</Link>
            <Link href="/terms">{t("footer.terms")}</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {t("brand.name")} — {t("footer.rights")}
          </span>
          <span>{t("footer.made")}</span>
        </div>
      </div>
    </footer>
  );
}
