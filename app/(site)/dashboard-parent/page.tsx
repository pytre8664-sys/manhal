"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DashShell, useDashUser, type DashItem } from "@/components/DashShell";
import { EmptyState } from "@/components/EmptyState";
import { Icon } from "@/components/Icon";
import { useI18n } from "@/components/LanguageProvider";
import { TeacherCard } from "@/components/TeacherCard";
import { useToast } from "@/components/ToastProvider";
import { NOTIFICATIONS, SUBJ, TEACHERS } from "@/lib/data";
import { withBase } from "@/lib/paths";

const PARENT_REQUESTS = [
  { name: "أ. سارة بامطرف", subject: "math", date: "2026-11-07", accepted: true },
  { name: "أ. نورة العولقي", subject: "english", date: "2026-11-09", accepted: false },
];

export default function ParentDashboard() {
  const { t, tr, lang, setLang } = useI18n();
  const toast = useToast();
  const name = useDashUser("parent");
  const [active, setActive] = useState("overview");
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      setSavedIds(JSON.parse(localStorage.getItem("manhal.saved") || "[]"));
    } catch {
      setSavedIds([]);
    }
  }, [active]);

  const items: DashItem[] = [
    { id: "overview", icon: "grid", label: t("dash.overview") },
    { id: "search", icon: "search", label: t("dash.search") },
    { id: "saved", icon: "heart", label: t("dash.saved") },
    { id: "requests", icon: "message", label: t("dash.contactRequests") },
    { id: "notifications", icon: "bell", label: t("dash.notifications") },
    { id: "settings", icon: "settings", label: t("dash.settings") },
  ];

  const onNav = (id: string) => {
    if (id === "search") {
      window.location.href = withBase("/search");
      return;
    }
    setActive(id);
  };

  const saved = savedIds
    .map((id) => TEACHERS.find((x) => x.id === id))
    .filter((x): x is (typeof TEACHERS)[number] => Boolean(x));

  return (
    <DashShell role="parent" items={items} active={active} onChange={onNav}>
      {active === "overview" ? (
        <section>
          <h1 style={{ fontSize: 24, margin: 0 }}>
            {t("dash.welcome")}، {name} 👋
          </h1>
          <p className="small muted">{t("roles.parent.desc")}</p>

          <div className="grid grid-3 mt-lg" style={{ gap: 14 }}>
            <Link className="action-tile" href="/search">
              <div className="action-tile__icon">
                <Icon name="search" />
              </div>
              <strong>{t("roles.parent.cta")}</strong>
              <small>{t("search.sub")}</small>
            </Link>
            <Link className="action-tile" href="/urgent">
              <div className="action-tile__icon">
                <Icon name="message" />
              </div>
              <strong>{t("search.postRequest")}</strong>
              <small>{t("search.noResultsDesc")}</small>
            </Link>
            <button className="action-tile" type="button" onClick={() => setActive("saved")}>
              <div className="action-tile__icon">
                <Icon name="heart" />
              </div>
              <strong>{t("dash.saved")}</strong>
              <small>{t("teachers.b3")}</small>
            </button>
          </div>

          <div className="grid grid-3 mt-lg" style={{ gap: 14 }}>
            <div className="kpi">
              <div className="kpi__value">2</div>
              <div className="kpi__label">{t("dash.contactRequests")}</div>
            </div>
            <div className="kpi">
              <div className="kpi__value">{saved.length}</div>
              <div className="kpi__label">{t("dash.saved")}</div>
            </div>
            <div className="kpi">
              <div className="kpi__value">1</div>
              <div className="kpi__label">{t("search.saved")}</div>
            </div>
          </div>

          <h2 className="mt-lg" style={{ fontSize: 16 }}>
            {t("dash.suggested")}
          </h2>
          <div className="grid grid-2 mt-sm" style={{ gap: 14 }}>
            {TEACHERS.slice(2, 4).map((teacher) => (
              <TeacherCard key={teacher.id} teacher={teacher} showMatch />
            ))}
          </div>
        </section>
      ) : null}

      {active === "requests" ? (
        <section>
          <h1 style={{ fontSize: 22 }}>{t("dash.contactRequests")}</h1>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div className="table-wrap" style={{ border: 0, borderRadius: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>{t("common.teacher")}</th>
                    <th>{t("common.subject")}</th>
                    <th>{t("common.status")}</th>
                    <th>{t("common.date")}</th>
                  </tr>
                </thead>
                <tbody>
                  {PARENT_REQUESTS.map((r) => (
                    <tr key={r.name}>
                      <td>{r.name}</td>
                      <td>{tr(SUBJ(r.subject))}</td>
                      <td>
                        <span className={r.accepted ? "chip chip--verified" : "chip chip--urgent"}>
                          {r.accepted ? t("admin.accepted") : t("admin.review")}
                        </span>
                      </td>
                      <td>{r.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ) : null}

      {active === "saved" ? (
        <section>
          <h1 style={{ fontSize: 22 }}>{t("dash.saved")}</h1>
          <div className="stack" style={{ gap: 14 }}>
            {saved.length ? (
              saved.map((teacher) => <TeacherCard key={teacher.id} teacher={teacher} />)
            ) : (
              <EmptyState title={t("common.empty")} description={t("search.noResultsDesc")}>
                <Link className="btn" href="/search">
                  {t("common.searchTeacher")}
                </Link>
              </EmptyState>
            )}
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
