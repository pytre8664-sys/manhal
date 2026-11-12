"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { EmptyState } from "@/components/EmptyState";
import { Icon } from "@/components/Icon";
import { useI18n } from "@/components/LanguageProvider";
import { AvailabilityBadge, TeacherCard } from "@/components/TeacherCard";
import { useToast } from "@/components/ToastProvider";
import { DIST, GRADE, MODES, SUBJECTS, SUBJ, TEACHERS, type Teacher } from "@/lib/data";
import { fetchTeachers } from "@/lib/store";

const DAYS_AR = ["السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];
const DAYS_EN = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

function TeacherClient() {
  const { t, tr, lang } = useI18n();
  const toast = useToast();
  const params = useSearchParams();
  const id = params.get("id") || "t1";

  const [teachers, setTeachers] = useState<Teacher[]>(TEACHERS);
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchTeachers().then((res) => {
      setTeachers(res.teachers);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    try {
      const list: string[] = JSON.parse(localStorage.getItem("manhal.saved") || "[]");
      setSaved(list.includes(id));
    } catch {
      setSaved(false);
    }
  }, [id]);

  const teacher = teachers.find((x) => x.id === id);

  if (loaded && !teacher) {
    return (
      <div className="container" style={{ paddingBlock: 60 }}>
        <EmptyState icon="alert" title="404" description={t("common.empty")}>
          <Link className="btn" href="/search">
            {t("common.searchTeacher")}
          </Link>
        </EmptyState>
      </div>
    );
  }

  if (!teacher) return <div className="container" style={{ paddingBlock: 60 }}>{t("common.loading")}</div>;

  const name = lang === "en" ? teacher.nameEn : teacher.name;
  const v = teacher.verified;
  const totalV = [v.identity, v.qualification, v.experience].filter(Boolean).length;
  const days = lang === "en" ? DAYS_EN : DAYS_AR;

  const toggleSave = () => {
    try {
      const list: string[] = JSON.parse(localStorage.getItem("manhal.saved") || "[]");
      const next = list.includes(teacher.id)
        ? list.filter((x) => x !== teacher.id)
        : [...list, teacher.id];
      localStorage.setItem("manhal.saved", JSON.stringify(next));
      setSaved(next.includes(teacher.id));
      toast(t(next.includes(teacher.id) ? "teacher.savedMsg" : "common.saved"), "success");
    } catch {
      toast(t("admin.error"), "error");
    }
  };

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      /* ignore */
    }
    toast(t("teacher.shared"), "success");
  };

  return (
    <>
      <div className="container" style={{ paddingBlock: 40 }}>
        <nav className="row small muted" style={{ gap: 6, marginBottom: 18 }}>
          <Link href="/">{t("brand.name")}</Link>
          <span>/</span>
          <Link href="/search">{t("common.searchTeacher")}</Link>
          <span>/</span>
          <span>{t("teacher.profile")}</span>
        </nav>

        <div className="grid profile-layout" style={{ alignItems: "start" }}>
          <div className="stack" style={{ gap: 24 }}>
            <div className="card">
              <div className="profile-head">
                <div className="profile-avatar">
                  {name.replace(/^(أ\.|Mr\.|Ms\.)\s*/, "").charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div className="row row--wrap" style={{ gap: 8 }}>
                    <h1 style={{ fontSize: 26, margin: 0 }}>{name}</h1>
                    {v.identity ? (
                      <span className="chip chip--verified">
                        <Icon name="shield" />
                        {t("common.verified")}
                      </span>
                    ) : null}
                  </div>
                  <p className="muted" style={{ margin: "6px 0 10px" }}>
                    {tr(SUBJ(teacher.subject))} · {teacher.grades.map((g) => tr(GRADE(g))).join(" / ")}
                  </p>
                  <div className="row row--wrap" style={{ gap: 8 }}>
                    <span className="chip">
                      <Icon name="mapPin" />
                      {tr(DIST(teacher.district))}
                    </span>
                    <span className="chip">{t(MODES.find((m) => m.id === teacher.mode)?.key || teacher.mode)}</span>
                    <span className="chip">
                      {teacher.experience} {t("common.years")}
                    </span>
                    <span className="rating">
                      <Icon name="star" />
                      {teacher.rating.toFixed(1)}{" "}
                      <span className="muted small">
                        ({teacher.reviews} {t("common.reviews")})
                      </span>
                    </span>
                  </div>
                </div>
              </div>
              <hr className="divider" />
              <h3>{t("teacher.about")}</h3>
              <p className="muted" style={{ marginBottom: 0 }}>
                {lang === "en" ? teacher.bioEn || teacher.bio : teacher.bio}
              </p>
            </div>

            <div className="card">
              <h3>{t("teacher.subjects")}</h3>
              <div className="row row--wrap" style={{ gap: 8 }}>
                <span className="chip chip--lavender">{tr(SUBJ(teacher.subject))}</span>
                {teacher.grades.map((g) => (
                  <span className="chip" key={g}>
                    {tr(GRADE(g))}
                  </span>
                ))}
                <span className="chip">{t(MODES.find((m) => m.id === teacher.mode)?.key || teacher.mode)}</span>
              </div>
              <hr className="divider" />
              <h3>{t("teacher.verification")}</h3>
              <p className="small muted">
                {totalV}/3 — {t("trust.desc")}
              </p>
              <div className="stack" style={{ gap: 8 }}>
                {[
                  ["trust.v1", v.identity],
                  ["trust.v2", v.qualification],
                  ["trust.v3", v.experience],
                ].map(([key, ok]) => (
                  <div className="row" style={{ gap: 10 }} key={key as string}>
                    <span className={ok ? "chip chip--verified" : "chip chip--outline"}>
                      <Icon name={ok ? "checkCircle" : "x"} />
                    </span>
                    <span
                      className="small"
                      style={{ color: ok ? "var(--text-body)" : "var(--text-muted)" }}
                    >
                      {t(key as string)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3>{t("teacher.schedule")}</h3>
              <div className="grid" style={{ gridTemplateColumns: "repeat(7,minmax(0,1fr))", gap: 6 }}>
                {days.map((d, i) => (
                  <div
                    className="center"
                    key={d}
                    style={{
                      padding: "10px 4px",
                      borderRadius: 12,
                      border: `1px solid ${i < 5 ? "var(--border)" : "transparent"}`,
                      background: i < 5 ? "var(--lavender)" : "var(--surface-subtle)",
                    }}
                  >
                    <div className="tiny muted" style={{ fontWeight: 700 }}>
                      {d}
                    </div>
                    <div
                      className="tiny"
                      style={{
                        fontWeight: 800,
                        color: i < 5 ? "var(--primary)" : "var(--text-muted)",
                      }}
                    >
                      {i < 5 ? (lang === "en" ? "Open" : "متاح") : "—"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mt-lg">{t("teacher.similar")}</h3>
              <div className="grid grid-2" style={{ marginTop: 12 }}>
                {teachers
                  .filter(
                    (y) =>
                      y.id !== teacher.id &&
                      (y.subject === teacher.subject || y.district === teacher.district)
                  )
                  .slice(0, 2)
                  .map((y) => (
                    <TeacherCard key={y.id} teacher={y} />
                  ))}
              </div>
            </div>
          </div>

          <aside className="stack" style={{ gap: 16, position: "sticky", top: 96 }}>
            <div className="card">
              <div className="row row--between">
                <span className="price" style={{ fontSize: 22 }}>
                  {teacher.price.toLocaleString()} <span>{t("common.perHour")}</span>
                </span>
                <AvailabilityBadge availability={teacher.availability} />
              </div>
              <div className="stack mt-md" style={{ gap: 8 }}>
                <button className="btn btn--block" type="button" onClick={() => setOpen(true)}>
                  {t("common.contact")}
                </button>
                <div className="row" style={{ gap: 8 }}>
                  <button
                    className={`btn btn--secondary btn--block${saved ? " is-saved" : ""}`}
                    type="button"
                    onClick={toggleSave}
                  >
                    <Icon name="heart" className="icon--sm" /> {t("common.save")}
                  </button>
                  <button className="btn btn--ghost btn--block" type="button" onClick={share}>
                    <Icon name="share" className="icon--sm" /> {t("common.share")}
                  </button>
                </div>
              </div>
              <p className="tiny muted mt-md" style={{ marginBottom: 0 }}>
                {t("teacher.contactSub")}
              </p>
            </div>
            <div className="card card--lavender">
              <div className="row" style={{ gap: 8 }}>
                <Icon name="lock" className="icon--sm" />
                <strong className="small">{t("about.v2")}</strong>
              </div>
              <p className="tiny muted mt-sm" style={{ marginBottom: 0 }}>
                {t("about.v2d")}
              </p>
            </div>
          </aside>
        </div>
      </div>

      {open ? (
        <div className="modal is-open">
          <div className="modal__scrim" onClick={() => setOpen(false)} />
          <div className="modal__card">
            <div className="row row--between">
              <h3 style={{ margin: 0 }}>{t("teacher.contactTitle")}</h3>
              <button
                className="btn btn--ghost btn--icon"
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t("nav.close")}
              >
                <Icon name="x" />
              </button>
            </div>
            <p className="small muted">{t("teacher.contactSub")}</p>
            <form
              className="stack"
              style={{ gap: 12 }}
              onSubmit={(e) => {
                e.preventDefault();
                setOpen(false);
                toast(t("teacher.contactSent"), "success");
              }}
            >
              <div className="field">
                <label className="field__label">{t("search.subject")}</label>
                <select className="select" required defaultValue={teacher.subject}>
                  {SUBJECTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {tr(s)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-grid">
                <div className="field">
                  <label className="field__label">{t("search.grade")}</label>
                  <select className="select">
                    {teacher.grades.map((g) => (
                      <option key={g}>{tr(GRADE(g))}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label className="field__label">{t("search.mode")}</label>
                  <select className="select">
                    {MODES.map((m) => (
                      <option key={m.id}>{t(m.key)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="field">
                <label className="field__label">{t("urgentForm.notes")}</label>
                <textarea className="textarea" rows={3} placeholder={t("urgentForm.notes")} />
              </div>
              <button className="btn btn--block" type="submit">
                {t("teacher.contactSend")}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default function TeacherPage() {
  return (
    <Suspense fallback={<div className="container" style={{ paddingBlock: 60 }}>…</div>}>
      <TeacherClient />
    </Suspense>
  );
}
