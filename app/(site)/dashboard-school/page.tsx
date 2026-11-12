"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DashShell, useDashUser, type DashItem } from "@/components/DashShell";
import { EmptyState } from "@/components/EmptyState";
import { Icon } from "@/components/Icon";
import { useI18n } from "@/components/LanguageProvider";
import { TeacherCard } from "@/components/TeacherCard";
import { useToast } from "@/components/ToastProvider";
import { NOTIFICATIONS, REQUESTS, TEACHERS } from "@/lib/data";
import { withBase } from "@/lib/paths";

const STATUS: Record<string, [string, string]> = {
  open: ["chip--urgent", "admin.open"],
  review: ["chip--lavender", "admin.review"],
  accepted: ["chip--verified", "admin.accepted"],
  closed: ["", "admin.closed"],
};

function StatusChip({ status }: { status: string }) {
  const { t } = useI18n();
  const [cls, key] = STATUS[status] || ["", status];
  return <span className={`chip ${cls}`}>{t(key)}</span>;
}

export default function SchoolDashboard() {
  const { t, tr, lang, setLang } = useI18n();
  const toast = useToast();
  const name = useDashUser("school");
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
    { id: "jobs", icon: "briefcase", label: t("dash.jobs") },
    { id: "requests", icon: "fileText", label: t("dash.requests") },
    { id: "saved", icon: "heart", label: t("dash.saved") },
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
    <DashShell role="school" items={items} active={active} onChange={onNav}>
      {active === "overview" ? (
        <section>
          <div className="row row--between row--wrap" style={{ gap: 12 }}>
            <div>
              <h1 style={{ fontSize: 24, margin: 0 }}>
                {t("dash.welcome")}، {name} 👋
              </h1>
              <p className="small muted" style={{ margin: "4px 0 0" }}>
                {t("dash.suggestedNote")}
              </p>
            </div>
            <button className="btn btn--ghost btn--sm" onClick={() => setActive("notifications")}>
              <Icon name="bell" className="icon--sm" />
              <span>{t("dash.notifications")}</span>
              <span className="chip chip--urgent">2</span>
            </button>
          </div>

          <div className="grid grid-3 mt-lg" style={{ gap: 14 }}>
            <Link className="action-tile" href="/search">
              <div className="action-tile__icon">
                <Icon name="search" />
              </div>
              <strong>{t("dash.search")}</strong>
              <small>{t("search.sub")}</small>
            </Link>
            <Link className="action-tile action-tile--urgent" href="/urgent">
              <div className="action-tile__icon">
                <Icon name="bolt" />
              </div>
              <strong>{t("dash.urgent")}</strong>
              <small>{t("urgent.desc")}</small>
            </Link>
            <Link className="action-tile" href="/post-job">
              <div className="action-tile__icon">
                <Icon name="briefcase" />
              </div>
              <strong>{t("dash.postJob")}</strong>
              <small>{t("job.sub")}</small>
            </Link>
          </div>

          <div className="grid grid-4 mt-lg" style={{ gap: 14 }}>
            <div className="kpi">
              <div className="kpi__value">4</div>
              <div className="kpi__label">{t("dash.requests")}</div>
            </div>
            <div className="kpi">
              <div className="kpi__value">12</div>
              <div className="kpi__label">{t("dash.contactRequests")}</div>
            </div>
            <div className="kpi">
              <div className="kpi__value">{saved.length}</div>
              <div className="kpi__label">{t("dash.saved")}</div>
            </div>
            <div className="kpi">
              <div className="kpi__value">2</div>
              <div className="kpi__label">{t("dash.jobs")}</div>
            </div>
          </div>

          <div className="card mt-lg" style={{ padding: 0, overflow: "hidden" }}>
            <div className="row row--between" style={{ padding: "18px 20px" }}>
              <h2 style={{ fontSize: 16, margin: 0 }}>{t("dash.recent")}</h2>
              <button className="small btn btn--ghost btn--sm" onClick={() => setActive("requests")}>
                {t("common.viewAll")}
              </button>
            </div>
            <div className="table-wrap" style={{ border: 0, borderRadius: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>{t("common.details")}</th>
                    <th>{t("common.status")}</th>
                    <th>{t("common.date")}</th>
                    <th>{t("common.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {REQUESTS.slice(0, 3).map((r) => (
                    <tr key={r.id}>
                      <td>{r.title}</td>
                      <td>
                        <StatusChip status={r.status} />
                      </td>
                      <td className="nowrap">{r.date}</td>
                      <td>
                        <a className="small" href="#">
                          {t("common.details")}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <h2 className="mt-lg" style={{ fontSize: 16 }}>
            {t("dash.suggested")}
          </h2>
          <div className="grid grid-2 mt-sm" style={{ gap: 14 }}>
            {TEACHERS.slice(0, 2).map((teacher) => (
              <TeacherCard key={teacher.id} teacher={teacher} showMatch />
            ))}
          </div>
        </section>
      ) : null}

      {active === "requests" ? (
        <section>
          <h1 style={{ fontSize: 22 }}>{t("dash.requests")}</h1>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div className="table-wrap" style={{ border: 0, borderRadius: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>{t("common.details")}</th>
                    <th>#</th>
                    <th>{t("common.status")}</th>
                    <th>{t("common.date")}</th>
                    <th>{t("common.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {REQUESTS.map((r) => (
                    <tr key={r.id}>
                      <td>{r.title}</td>
                      <td className="tiny muted">{r.id}</td>
                      <td>
                        <StatusChip status={r.status} />
                      </td>
                      <td className="nowrap">{r.date}</td>
                      <td>
                        <a className="small" href="#">
                          {t("common.details")}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ) : null}

      {active === "jobs" ? (
        <section>
          <div className="row row--between">
            <h1 style={{ fontSize: 22, margin: 0 }}>{t("dash.jobs")}</h1>
            <Link className="btn btn--sm" href="/post-job">
              {t("dash.postJob")}
            </Link>
          </div>
          <div className="card mt-md" style={{ padding: 0, overflow: "hidden" }}>
            <div className="table-wrap" style={{ border: 0, borderRadius: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>{t("job.role")}</th>
                    <th>{t("common.status")}</th>
                    <th>{t("common.date")}</th>
                    <th>—</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>معلمة لغة إنجليزية — متوسط</td>
                    <td>
                      <span className="chip chip--lavender">{t("admin.review")}</span>
                    </td>
                    <td>2026-11-04</td>
                    <td>
                      <a className="small" href="#">
                        {t("admin.actions")}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td>معلم رياضيات — ثانوي</td>
                    <td>
                      <span className="chip chip--verified">{t("admin.published")}</span>
                    </td>
                    <td>2026-10-21</td>
                    <td>
                      <a className="small" href="#">
                        {t("admin.actions")}
                      </a>
                    </td>
                  </tr>
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
              <button
                className="btn btn--ghost btn--sm"
                type="button"
                onClick={() => setLang("ar")}
              >
                العربية
              </button>
              <button
                className="btn btn--ghost btn--sm"
                type="button"
                onClick={() => setLang("en")}
              >
                English
              </button>
            </div>
            <hr className="divider" />
            <h3 style={{ fontSize: 15 }}>{t("dash.notifications")}</h3>
            <label className="checkbox">
              <input type="checkbox" defaultChecked />
              <span>إشعارات داخل المنصة</span>
            </label>
            <label className="checkbox mt-sm">
              <input type="checkbox" defaultChecked />
              <span>إشعارات البريد الإلكتروني</span>
            </label>
            <label className="checkbox mt-sm">
              <input type="checkbox" />
              <span>إشعارات الجوال</span>
            </label>
            <button
              className="btn btn--sm mt-md"
              type="button"
              onClick={() => toast(t("admin.saved"), "success")}
            >
              {t("common.save")}
            </button>
          </div>
        </section>
      ) : null}
    </DashShell>
  );
}
