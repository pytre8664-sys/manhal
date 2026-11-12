"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/Icon";
import { useI18n } from "@/components/LanguageProvider";
import { useToast } from "@/components/ToastProvider";
import { withBase } from "@/lib/paths";

export default function LoginPage() {
  const { t } = useI18n();
  const toast = useToast();
  const [email, setEmail] = useState("");

  const go = (name: string, role: string) => {
    localStorage.setItem("manhal.user", JSON.stringify({ name, email, role }));
    localStorage.setItem("manhal.role", role);
    window.location.href = withBase(
      role === "parent"
        ? "/dashboard-parent"
        : role === "teacher"
          ? "/dashboard-teacher"
          : "/dashboard-school"
    );
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <Link className="brand" href="/" style={{ marginBottom: 20 }}>
          <span className="brand__mark">
            <Icon name="book" />
          </span>
          <span className="brand__text">
            <span className="brand__name">{t("brand.name")}</span>
            <span className="brand__tag">{t("brand.tag")}</span>
          </span>
        </Link>
        <h1 style={{ fontSize: 24 }}>{t("auth.login.title")}</h1>
        <p className="small muted">{t("auth.login.sub")}</p>

        <form
          className="stack"
          style={{ gap: 14 }}
          onSubmit={(e) => {
            e.preventDefault();
            const role = localStorage.getItem("manhal.role") || "school";
            go("مستخدم تجريبي", role);
            toast(t("admin.saved"), "success");
          }}
        >
          <div className="field">
            <label className="field__label">{t("auth.email")}</label>
            <div className="input-icon">
              <Icon name="mail" />
              <input
                className="input"
                type="email"
                required
                dir="ltr"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <label className="field__label">{t("auth.password")}</label>
            <div className="input-icon">
              <Icon name="lock" />
              <input className="input" type="password" required placeholder="••••••••" />
            </div>
          </div>
          <div className="row row--between">
            <label className="checkbox">
              <input type="checkbox" defaultChecked />
              <span>{t("common.confirm")}</span>
            </label>
            <a className="small" href="#">
              {t("auth.forgot")}
            </a>
          </div>
          <button className="btn btn--block btn--lg" type="submit">
            {t("auth.login.title")}
          </button>
        </form>

        <div className="row" style={{ gap: 10, margin: "16px 0" }}>
          <hr className="divider" style={{ flex: 1, margin: 0 }} />
          <span className="tiny muted">{t("auth.or")}</span>
          <hr className="divider" style={{ flex: 1, margin: 0 }} />
        </div>
        <button
          className="btn btn--ghost btn--block"
          type="button"
          onClick={() => {
            localStorage.setItem(
              "manhal.user",
              JSON.stringify({ name: "مستخدم تجريبي", email: "demo@manhal.app", role: "school" })
            );
            localStorage.setItem("manhal.role", "school");
            window.location.href = withBase("/dashboard-school");
          }}
        >
          <Icon name="globe" />
          <span>{t("auth.google")}</span>
        </button>

        <p className="small muted center" style={{ margin: "20px 0 0" }}>
          <span>{t("auth.noAccount")}</span> <Link href="/signup">{t("auth.create")}</Link>
        </p>
        <div className="alert alert--info mt-md">
          <Icon name="info" />
          <span>{t("common.demoNotice")}</span>
        </div>
      </div>
    </div>
  );
}
