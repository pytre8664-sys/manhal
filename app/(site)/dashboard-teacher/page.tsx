"use client";

import { useState } from "react";
import { DashShell, useDashUser, type DashItem } from "@/components/DashShell";
import { Icon } from "@/components/Icon";
import { useI18n } from "@/components/LanguageProvider";
import { useToast } from "@/components/ToastProvider";
import { GRADE, MODE_LABEL, NOTIFICATIONS, SUBJ, TEACHER_REQUESTS } from "@/lib/data";

const STATUS: Record<string, [string, string]> = {
  pending: ["chip--urgent", "admin.review"],
  accepted: ["chip--verified", "admin.accepted"],
  declined: ["", "common.notNow"],
};

const URGENT = [
  { school: "مدرسة الأمل الأهلية", subject: "math", grade: "secondary", district: "mukalla", when: "غدًا صباحًا" },
  { school: "ثانوية الشحر للبنين", subject: "physics", grade: "secondary", district: "shihr", when: "هذا الأسبوع" },
];

export default function TeacherDashboard() {
  const { t, tr, lang, setLang } = useI18n();
  const toast = useToast();
  const name = useDashUser("teacher");
  const [active, setActive] = useState("overview");

  const items: DashItem[] = [
    { id: "overview", icon: "grid", label: t("dash.overview") },
    { id: "requests", icon: "message", label: t("dash.contactRequests") },
    { id: "urgent", icon: "bolt", label: t("dash.urgentOpps") },
    { id: "availability", icon: "calendar", label: t("dash.availability") },
    { id: "profile", icon: "user", label: t("dash.profile") },
    { id: "notifications", icon: "bell", label: t("dash.notifications") },
    { id: "settings", icon: "settings", label: t("dash.settings") },
  ];

  const urgentCard = (u: (typeof URGENT)[number], key: string) => (
    <div
      className="card"
      key={key}
      style={{ display: "flex", gap: 14, alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap" }}
    >
      <div>
        <div className="row" style={{ gap: 8 }}>
          <span className="chip chip--urgent">{t("urgent.badge")}</span>
          <strong className="small">{u.when}</strong>
        </div>
        <h4 style={{ margin: "8px 0 2px" }}>{u.school}</h4>
        <p className="small muted" style={{ margin: 0 }}>
          {tr(SUBJ(u.subject))} · {tr(GRADE(u.grade))} · {u.district}
        </p>
      </div>
      <button className="btn btn--sm" onClick={() => toast(t("teacher.contactSent"), "success")}>
        {t("common.apply")}
      </button>
    </div>
  );

  return (
    <DashShell role="teacher" items={items} active={active} onChange={setActive}>
      {active === "overview" ? (
        <section>
          <h1 style={{ fontSize: 24, margin: 0 }}>
            {t("dash.welcome")}، {name} 👋
          </h1>
          <p className="small muted">{t("teachers.desc")}</p>

          <div className="card mt-lg">
            <div className="row row--between">
              <strong className="small">{t("dash.completeness")}</strong>
              <span className="small muted">78% {t("dash.complete")}</span>
            </div>
            <div className="progress mt-sm">
              <div className="progress__bar" style={{ width: "78%" }} />
            </div>
            <div className="stack mt-md" style={{ gap: 8 }}>
              {[
                ["trust.v1", true],
                ["trust.v2", true],
                ["trust.v3", false],
              ].map(([key, ok]) => (
                <div className="row" style={{ gap: 8 }} key={key as string}>
                  <span className={ok ? "chip chip--verified" : "chip chip--outline"}>
                    <Icon name={ok ? "checkCircle" : "x"} />
                  </span>
                  <span className={ok ? "small" : "small muted"}>{t(key as string)}</span>
                </div>
              ))}
            </div>
            <button className="btn btn--sm mt-md" onClick={() => setActive("profile")}>
              {t("dash.completeProfile")}
            </button>
          </div>

          <div className="grid grid-3 mt-lg" style={{ gap: 14 }}>
            <div className="kpi">
              <div className="kpi__value">3</div>
              <div className="kpi__label">{t("dash.contactRequests")}</div>
            </div>
            <div className="kpi">
              <div className="kpi__value">2</div>
              <div className="kpi__label">{t("dash.urgentOpps")}</div>
            </div>
            <div className="kpi">
              <div className="kpi__value">4.9</div>
              <div className="kpi__label">{t("common.rating")}</div>
            </div>
          </div>

          <div className="card mt-lg" style={{ padding: 0, overflow: "hidden" }}>
            <div className="row row--between" style={{ padding: "18px 20px" }}>
              <h2 style={{ fontSize: 16, margin: 0 }}>{t("dash.contactRequests")}</h2>
              <button className="btn btn--ghost btn--sm" onClick={() => setActive("requests")}>
                {t("common.viewAll")}
              </button>
            </div>
            <div className="table-wrap" style={{ border: 0, borderRadius: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>{t("common.status")}</th>
                    <th>{t("common.date")}</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {TEACHER_REQUESTS.map((r) => {
                    const [cls, key] = STATUS[r.status] || ["", r.status];
                    return (
                      <tr key={r.id}>
                        <td>{r.from}</td>
                        <td>
                          <span className={`chip ${cls}`}>{t(key)}</span>
                        </td>
                        <td className="nowrap">{r.date}</td>
                        <td>
                          <a className="small" href="#">
                            {t("common.details")}
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <h2 className="mt-lg" style={{ fontSize: 16 }}>
            {t("dash.urgentOpps")}
          </h2>
          <div className="stack mt-sm" style={{ gap: 12 }}>
            {URGENT.map((u) => urgentCard(u, u.school))}
          </div>
        </section>
      ) : null}

      {active === "requests" ? (
        <section>
          <h1 style={{ fontSize: 22 }}>{t("dash.contactRequests")}</h1>
          <div className="stack" style={{ gap: 14 }}>
            {TEACHER_REQUESTS.map((r) => {
              const [cls, key] = STATUS[r.status] || ["", r.status];
              return (
                <div className="card" key={r.id}>
                  <div className="row row--between row--wrap" style={{ gap: 10 }}>
                    <div>
                      <h4 style={{ margin: 0 }}>{r.from}</h4>
                      <p className="small muted" style={{ margin: "2px 0 0" }}>
                        {tr(SUBJ(r.subject))} · {tr(GRADE(r.grade))} · {r.district} · {t(MODE_LABEL(r.mode))}
                      </p>
                    </div>
                    <span className={`chip ${cls}`}>{t(key)}</span>
                  </div>
                  <div className="row mt-md" style={{ gap: 8 }}>
                    <button
                      className="btn btn--sm"
                      disabled={r.status !== "pending"}
                      onClick={() => toast(t("admin.accepted"), "success")}
                    >
                      {t("common.confirm")}
                    </button>
                    <button className="btn btn--ghost btn--sm" disabled={r.status !== "pending"}>
                      {t("common.cancel")}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {active === "urgent" ? (
        <section>
          <h1 style={{ fontSize: 22 }}>{t("dash.urgentOpps")}</h1>
          <div className="stack" style={{ gap: 12 }}>
            {URGENT.concat(URGENT.map((u) => ({ ...u, school: "مدرسة النور الخاصة" }))).map((u, i) =>
              urgentCard(u, `${u.school}-${i}`)
            )}
          </div>
        </section>
      ) : null}

      {active === "availability" ? (
        <section>
          <h1 style={{ fontSize: 22 }}>{t("dash.availability")}</h1>
          <p className="small muted">حدّد أوقات توفرك بشكل منفصل للمدارس والدروس الخصوصية.</p>
          <div className="card">
            <div className="stack" style={{ gap: 10 }}>
              {[
                ["السبت", true],
                ["الأحد", true],
                ["الإثنين", true],
                ["الثلاثاء", true],
                ["الأربعاء", true],
                ["الخميس", false],
                ["الجمعة", false],
              ].map(([day, on]) => (
                <div
                  className="row row--between"
                  style={{ padding: "10px 0", borderBottom: "1px solid var(--border)" }}
                  key={day as string}
                >
                  <strong className="small">{day as string}</strong>
                  <div className="row" style={{ gap: 8 }}>
                    <label className="checkbox">
                      <input type="checkbox" defaultChecked={on as boolean} />
                      <span className="small">{t("common.teacher")}</span>
                    </label>
                    <label className="checkbox">
                      <input type="checkbox" defaultChecked={on as boolean} />
                      <span className="small">{t("common.parent")}</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <div className="row mt-md" style={{ gap: 8 }}>
              <button className="btn btn--sm" onClick={() => toast(t("admin.saved"), "success")}>
                {t("common.save")}
              </button>
              <button className="btn btn--ghost btn--sm">{t("admin.refresh")}</button>
            </div>
          </div>
        </section>
      ) : null}

      {active === "profile" ? (
        <section>
          <h1 style={{ fontSize: 22 }}>{t("dash.profile")}</h1>
          <div className="card">
            <div className="form-grid">
              <div className="field">
                <label className="field__label">{t("auth.name")}</label>
                <input className="input" defaultValue={name} />
              </div>
              <div className="field">
                <label className="field__label">{t("common.subject")}</label>
                <input className="input" defaultValue="رياضيات" />
              </div>
              <div className="field">
                <label className="field__label">{t("common.grade")}</label>
                <input className="input" defaultValue="متوسط / ثانوي" />
              </div>
              <div className="field">
                <label className="field__label">{t("common.district")}</label>
                <input className="input" defaultValue="المكلا" />
              </div>
              <div className="field field--full">
                <label className="field__label">{t("teacher.about")}</label>
                <textarea className="textarea" rows={4} defaultValue="معلمة رياضيات بخبرة تسع سنوات…" />
              </div>
            </div>
            <div className="row row--between mt-md">
              <a className="btn btn--ghost btn--sm" href="/teacher?id=t1" target="_blank" rel="noreferrer">
                {t("common.viewProfile")}
              </a>
              <button className="btn btn--sm" onClick={() => toast(t("admin.saved"), "success")}>
                {t("common.save")}
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {active === "notifications" ? (
        <section>
          <h1 style={{ fontSize: 22 }}>{t("dash.notifications")}</h1>
          <div className="stack" style={{ gap: 10 }}>
            {NOTIFICATIONS.map((n) => (
              <div
                className="row"
                style={{ gap: 12, padding: 14, border: "1px solid var(--border)", borderRadius: 16, background: "#fff" }}
                key={n.id}
              >
                <span className={`dot${n.unread ? " dot--instant" : ""}`} />
                <div style={{ flex: 1 }}>
                  <div className="small" style={{ fontWeight: 700 }}>
                    {lang === "en" ? n.textEn : n.text}
                  </div>
                  <div className="tiny muted">{lang === "en" ? n.timeEn : n.time}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {active === "settings" ? (
        <section>
          <h1 style={{ fontSize: 22 }}>{t("dash.settings")}</h1>
          <div className="card">
            <h3 style={{ fontSize: 15 }}>{t("common.language")}</h3>
            <div className="row" style={{ gap: 8 }}>
              <button className="btn btn--ghost btn--sm" onClick={() => setLang("ar")}>
                العربية
              </button>
              <button className="btn btn--ghost btn--sm" onClick={() => setLang("en")}>
                English
              </button>
            </div>
            <hr className="divider" />
            <label className="checkbox">
              <input type="checkbox" defaultChecked />
              <span>إشعارات داخل المنصة</span>
            </label>
            <label className="checkbox mt-sm">
              <input type="checkbox" defaultChecked />
              <span>إشعارات البريد الإلكتروني</span>
            </label>
            <button className="btn btn--sm mt-md" onClick={() => toast(t("admin.saved"), "success")}>
              {t("common.save")}
            </button>
          </div>
        </section>
      ) : null}
    </DashShell>
  );
}
