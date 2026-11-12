"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { useI18n } from "./LanguageProvider";
import { withBase } from "@/lib/paths";

const NAV = [
  { href: "/", key: "nav.home" },
  { href: "/how-it-works", key: "nav.how" },
  { href: "/search", key: "nav.teachers" },
  { href: "/about", key: "nav.about" },
  { href: "/faq", key: "nav.faq" },
];

export function Header() {
  const { t, lang, toggle } = useI18n();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("manhal.user");
      setUser(raw ? JSON.parse(raw) : null);
    } catch {
      setUser(null);
    }
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isCurrent = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const logout = () => {
    localStorage.removeItem("manhal.user");
    localStorage.removeItem("manhal.role");
    window.location.href = withBase("/");
  };

  const dashHref =
    user?.role === "parent"
      ? "/dashboard-parent"
      : user?.role === "teacher"
        ? "/dashboard-teacher"
        : "/dashboard-school";

  return (
    <>
      <header className="site-header">
        <div className="container site-header__inner">
          <Link className="brand" href="/" aria-label={t("brand.name")}>
            <span className="brand__mark">
              <Icon name="book" />
            </span>
            <span className="brand__text">
              <span className="brand__name">{t("brand.name")}</span>
              <span className="brand__tag">{t("brand.tag")}</span>
            </span>
          </Link>

          <nav className="nav" aria-label="main">
            {NAV.map((n) => (
              <Link
                key={n.href}
                className="nav__link"
                href={n.href}
                aria-current={isCurrent(n.href) ? "page" : undefined}
              >
                {t(n.key)}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <button
              className="lang-toggle"
              type="button"
              onClick={toggle}
              aria-label={lang === "ar" ? "Switch to English" : "التبديل إلى العربية"}
            >
              <Icon name="globe" className="icon--sm" />
              <span>{lang === "ar" ? "English" : "العربية"}</span>
            </button>

            {user ? (
              <>
                <Link className="btn btn--ghost btn--sm" href={dashHref}>
                  {t("nav.dashboard")}
                </Link>
                <button className="btn btn--sm" type="button" onClick={logout}>
                  {t("nav.logout")}
                </button>
              </>
            ) : (
              <>
                <Link className="btn btn--ghost btn--sm" href="/login">
                  {t("nav.login")}
                </Link>
                <Link className="btn btn--sm" href="/role-select">
                  {t("nav.start")}
                </Link>
              </>
            )}

            <button
              className="nav-burger"
              type="button"
              aria-label={t("nav.menu")}
              onClick={() => setOpen(true)}
            >
              <Icon name="menu" />
            </button>
          </div>
        </div>
      </header>

      <div className={`drawer${open ? " is-open" : ""}`} role="dialog" aria-modal="true">
        <div className="drawer__scrim" onClick={() => setOpen(false)} />
        <div className="drawer__panel">
          <div className="row row--between">
            <Link className="brand" href="/" onClick={() => setOpen(false)}>
              <span className="brand__mark">
                <Icon name="book" />
              </span>
              <span className="brand__name">{t("brand.name")}</span>
            </Link>
            <button
              className="btn btn--ghost btn--icon"
              type="button"
              aria-label={t("nav.close")}
              onClick={() => setOpen(false)}
            >
              <Icon name="x" />
            </button>
          </div>
          {NAV.map((n) => (
            <Link key={n.href} className="nav__link" href={n.href} onClick={() => setOpen(false)}>
              {t(n.key)}
            </Link>
          ))}
          <hr className="divider" />
          {user ? (
            <>
              <Link className="btn btn--block" href={dashHref} onClick={() => setOpen(false)}>
                {t("nav.dashboard")}
              </Link>
              <button className="btn btn--ghost btn--block" type="button" onClick={logout}>
                {t("nav.logout")}
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn--ghost btn--block" href="/login" onClick={() => setOpen(false)}>
                {t("nav.login")}
              </Link>
              <Link className="btn btn--block" href="/role-select" onClick={() => setOpen(false)}>
                {t("nav.start")}
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
