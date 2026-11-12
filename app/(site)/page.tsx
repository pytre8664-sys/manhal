"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/Icon";
import { useI18n } from "@/components/LanguageProvider";
import { DISTRICTS, GRADES, MODES, SUBJECTS } from "@/lib/data";

export default function HomePage() {
  const { t, tr } = useI18n();
  const router = useRouter();
  const [form, setForm] = useState({ subject: "", grade: "", district: "", mode: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams();
    (Object.keys(form) as (keyof typeof form)[]).forEach((k) => {
      if (form[k]) p.set(k, form[k]);
    });
    router.push("/search" + (p.toString() ? `?${p.toString()}` : ""));
  };

  const roles = [
    {
      icon: "school",
      title: "roles.school.title",
      desc: "roles.school.desc",
      items: ["roles.school.f1", "roles.school.f2", "roles.school.f3"],
      cta: "roles.school.cta",
      href: "/role-select",
    },
    {
      icon: "user",
      title: "roles.parent.title",
      desc: "roles.parent.desc",
      items: ["roles.parent.f1", "roles.parent.f2", "roles.parent.f3"],
      cta: "roles.parent.cta",
      href: "/search",
    },
    {
      icon: "award",
      title: "roles.teacher.title",
      desc: "roles.teacher.desc",
      items: ["roles.teacher.f1", "roles.teacher.f2", "roles.teacher.f3"],
      cta: "roles.teacher.cta",
      href: "/signup?role=teacher",
    },
  ];

  const faqs = [
    ["faq.q1", "faq.a1"],
    ["faq.q2", "faq.a2"],
    ["faq.q3", "faq.a3"],
    ["faq.q4", "faq.a4"],
    ["faq.q5", "faq.a5"],
    ["faq.q6", "faq.a6"],
  ];

  return (
    <>
      <section className="hero">
        <div className="container">
          <span className="hero__eyebrow">
            <Icon name="star" className="icon--sm" />
            <span>{t("hero.badge")}</span>
          </span>
          <h1 className="hero__title">
            <span>{t("hero.title1")}</span>{" "}
            <span className="accent">{t("hero.title2")}</span>
          </h1>
          <p className="hero__sub">{t("hero.sub")}</p>
          <div className="hero__actions">
            <Link className="btn btn--lg" href="/search">
              <Icon name="search" />
              <span>{t("hero.cta1")}</span>
            </Link>
            <Link className="btn btn--ghost btn--lg" href="/signup?role=teacher">
              {t("hero.cta2")}
            </Link>
          </div>
          <div className="hero__stats">
            <div className="stat">
              <div className="stat__value">+240</div>
              <div className="stat__label">{t("hero.stat1")}</div>
            </div>
            <div className="stat">
              <div className="stat__value">+38</div>
              <div className="stat__label">{t("hero.stat2")}</div>
            </div>
            <div className="stat">
              <div className="stat__value">{t("hero.stat3v")}</div>
              <div className="stat__label">{t("hero.stat3")}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="roles">
        <div className="container">
          <div className="section-head center" style={{ marginInline: "auto" }}>
            <h2>{t("roles.title")}</h2>
            <p>{t("roles.sub")}</p>
          </div>
          <div className="grid grid-3">
            {roles.map((r) => (
              <article className="role-card" key={r.title}>
                <div className="role-card__icon">
                  <Icon name={r.icon} />
                </div>
                <h3 className="role-card__title">{t(r.title)}</h3>
                <p className="role-card__desc">{t(r.desc)}</p>
                <ul className="role-card__list">
                  {r.items.map((it) => (
                    <li key={it}>
                      <Icon name="check" />
                      <span>{t(it)}</span>
                    </li>
                  ))}
                </ul>
                <Link className="btn btn--block" href={r.href}>
                  {t(r.cta)}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--lavender" id="how">
        <div className="container">
          <div className="section-head">
            <h2>{t("how.title")}</h2>
            <p>{t("how.sub")}</p>
          </div>
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

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>{t("why.title")}</h2>
            <p>{t("why.sub")}</p>
          </div>
          <div className="grid grid-3">
            {[
              ["bolt", "why.speed.title", "why.speed.desc"],
              ["shield", "why.trust.title", "why.trust.desc"],
              ["check", "why.easy.title", "why.easy.desc"],
            ].map(([icon, title, desc]) => (
              <div className="feature" key={title}>
                <div className="feature__icon">
                  <Icon name={icon} />
                </div>
                <div>
                  <h3>{t(title)}</h3>
                  <p>{t(desc)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--white">
        <div className="container">
          <div className="section-head" style={{ marginBottom: 24 }}>
            <h2>{t("search.title")}</h2>
            <p>{t("search.sub")}</p>
          </div>
          <form className="searchbar" onSubmit={submit}>
            <div className="searchbar__grid">
              <div className="field">
                <label className="field__label">{t("search.subject")}</label>
                <select
                  className="select"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                >
                  <option value="">{t("search.any")}</option>
                  {SUBJECTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {tr(s)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label className="field__label">{t("search.grade")}</label>
                <select
                  className="select"
                  value={form.grade}
                  onChange={(e) => setForm({ ...form, grade: e.target.value })}
                >
                  <option value="">{t("search.anyGrade")}</option>
                  {GRADES.map((g) => (
                    <option key={g.id} value={g.id}>
                      {tr(g)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label className="field__label">{t("search.district")}</label>
                <select
                  className="select"
                  value={form.district}
                  onChange={(e) => setForm({ ...form, district: e.target.value })}
                >
                  <option value="">{t("search.anyDistrict")}</option>
                  {DISTRICTS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {tr(d)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label className="field__label">{t("search.mode")}</label>
                <select
                  className="select"
                  value={form.mode}
                  onChange={(e) => setForm({ ...form, mode: e.target.value })}
                >
                  <option value="">{t("common.all")}</option>
                  {MODES.map((m) => (
                    <option key={m.id} value={m.id}>
                      {t(m.key)}
                    </option>
                  ))}
                </select>
              </div>
              <button className="btn" type="submit">
                <Icon name="search" />
                <span>{t("search.button")}</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div
            className="card card--pad-lg"
            style={{ borderColor: "rgba(245,158,11,.45)", background: "linear-gradient(120deg,#fffdf7,#fff7ed)" }}
          >
            <div className="row row--between row--wrap" style={{ gap: 24 }}>
              <div style={{ maxWidth: 560 }}>
                <span className="chip chip--urgent mb-md">
                  <Icon name="bolt" />
                  <span>{t("urgent.badge")}</span>
                </span>
                <h2>{t("urgent.title")}</h2>
                <p style={{ marginBottom: 0 }}>{t("urgent.desc")}</p>
              </div>
              <div className="row row--wrap" style={{ gap: 10 }}>
                <Link className="btn btn--urgent btn--lg" href="/urgent">
                  {t("urgent.cta")}
                </Link>
                <Link className="btn btn--ghost btn--lg" href="/post-job">
                  {t("urgent.secondary")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--lavender">
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: "center", gap: 40 }}>
            <div>
              <h2>{t("teachers.title")}</h2>
              <p>{t("teachers.desc")}</p>
              <ul className="stack" style={{ gap: 10, listStyle: "none", padding: 0 }}>
                {[
                  ["checkCircle", "teachers.b1"],
                  ["calendar", "teachers.b2"],
                  ["message", "teachers.b3"],
                ].map(([icon, key]) => (
                  <li className="row" style={{ gap: 10 }} key={key}>
                    <span className={icon === "checkCircle" ? "chip chip--verified" : "chip chip--lavender"}>
                      <Icon name={icon} />
                    </span>
                    <span className="small">{t(key)}</span>
                  </li>
                ))}
              </ul>
              <Link className="btn btn--lg mt-md" href="/signup?role=teacher">
                {t("teachers.cta")}
              </Link>
            </div>
            <div className="card card--pad-lg">
              <div className="row row--between" style={{ marginBottom: 12 }}>
                <strong className="small">{t("dash.completeness")}</strong>
                <span className="small muted">78%</span>
              </div>
              <div className="progress">
                <div className="progress__bar" style={{ width: "78%" }} />
              </div>
              <hr className="divider" />
              <div className="stack" style={{ gap: 12 }}>
                {[
                  ["trust.v1", true],
                  ["trust.v2", true],
                  ["trust.v3", false],
                ].map(([key, ok]) => (
                  <div className="row" style={{ gap: 10 }} key={key as string}>
                    <span className={ok ? "chip chip--verified" : "chip chip--outline"}>
                      <Icon name={ok ? "checkCircle" : "x"} />
                    </span>
                    <span className={ok ? "small" : "small muted"}>{t(key as string)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>{t("trust.title")}</h2>
            <p>{t("trust.desc")}</p>
          </div>
          <div className="grid grid-2">
            <div className="card">
              <h3 style={{ fontSize: 16 }}>{t("teacher.verification")}</h3>
              <div className="stack" style={{ gap: 12, marginTop: 12 }}>
                {["trust.v1", "trust.v2", "trust.v3"].map((key) => (
                  <div className="row" style={{ gap: 10 }} key={key}>
                    <span className="chip chip--verified">
                      <Icon name="shield" />
                    </span>
                    <span>{t(key)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid" style={{ gap: 16 }}>
              <div className="card">
                <h4>{t("trust.school")}</h4>
                <p className="small muted" style={{ marginBottom: 0 }}>
                  {t("trust.school.desc")}
                </p>
              </div>
              <div className="card">
                <h4>{t("trust.parent")}</h4>
                <p className="small muted" style={{ marginBottom: 0 }}>
                  {t("trust.parent.desc")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--white" id="faq">
        <div className="container">
          <div className="section-head">
            <h2>{t("faq.title")}</h2>
            <p>{t("faq.sub")}</p>
          </div>
          <div className="accordion">
            {faqs.map(([q, a]) => (
              <details className="acc" key={q}>
                <summary>{t(q)}</summary>
                <div className="acc__body">{t(a)}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
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
              <Link
                className="btn btn--ghost btn--lg"
                href="/about"
                style={{ borderColor: "rgba(255,255,255,.5)", color: "#fff" }}
              >
                {t("cta.secondary")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
