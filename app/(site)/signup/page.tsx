"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Icon } from "@/components/Icon";
import { useI18n } from "@/components/LanguageProvider";
import { withBase } from "@/lib/paths";

function SignupClient() {
  const { t } = useI18n();
  const params = useSearchParams();
  const initialRole =
    params.get("role") ||
    (typeof window !== "undefined" ? localStorage.getItem("manhal.role") : null) ||
    "school";
  const [role, setRole] = useState(initialRole);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
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
      <div className="auth-card" style={{ width: "min(560px,100%)" }}>
        <h1 style={{ fontSize: 24 }}>{t("auth.signup.title")}</h1>
        <p className="small muted">{t("auth.signup.sub")}</p>

        <form className="stack" style={{ gap: 14 }} onSubmit={submit}>
          <div className="field">
            <span className="field__label">{t("auth.role")}</span>
            <div className="grid grid-3" style={{ gap: 8 }}>
              {[
                ["school", "common.school"],
                ["parent", "common.parent"],
                ["teacher", "common.teacher"],
              ].map(([value, key]) => (
                <label
                  className="card"
                  key={value}
                  style={{ padding: 12, display: "flex", gap: 8, alignItems: "center", cursor: "pointer" }}
                >
                  <input
                    type="radio"
                    name="role"
                    value={value}
                    checked={role === value}
                    onChange={() => setRole(value)}
                    style={{ accentColor: "var(--primary)" }}
                  />
                  <span className="small">{t(key)}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="field">
            <label className="field__label">{t("auth.name")}</label>
            <input className="input" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-grid">
            <div className="field">
              <label className="field__label">{t("auth.email")}</label>
              <input
                className="input"
                type="email"
                required
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="field">
              <label className="field__label">{t("auth.phone")}</label>
              <input className="input" type="tel" dir="ltr" placeholder="+967 7XX XXX XXX" />
            </div>
          </div>
          <div className="field">
            <label className="field__label">{t("auth.password")}</label>
            <input className="input" type="password" required minLength={8} />
            <span className="field__hint">8</span>
          </div>
          <label className="checkbox">
            <input type="checkbox" required />
            <span>{t("auth.terms")}</span>
          </label>
          <button className="btn btn--block btn--lg" type="submit">
            {t("auth.create")}
          </button>
        </form>

        <div className="alert alert--info mt-md">
          <Icon name="info" />
          <span>{t("common.demoNotice")}</span>
        </div>

        <p className="small muted center" style={{ margin: "18px 0 0" }}>
          <span>{t("auth.haveAccount")}</span> <Link href="/login">{t("nav.login")}</Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="auth-wrap" />}>
      <SignupClient />
    </Suspense>
  );
}
