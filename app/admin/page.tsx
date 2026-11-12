"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { Icon } from "@/components/Icon";
import { useI18n } from "@/components/LanguageProvider";
import { useToast } from "@/components/ToastProvider";
import { DISTRICTS, GRADES, MODES, SUBJECTS } from "@/lib/data";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import {
  fetchAllTeachersForAdmin,
  fetchRequests,
  fetchVacancies,
  type RequestRecord,
  type TeacherRow,
  type VacancyRecord,
} from "@/lib/store";

type Tab = "overview" | "teachers" | "requests" | "vacancies" | "settings";

type TeacherForm = {
  id: string;
  name: string;
  name_en: string;
  subject: string;
  grades: string[];
  district: string;
  mode: string;
  experience: number;
  price: number;
  rating: number;
  reviews: number;
  verified_identity: boolean;
  verified_qualification: boolean;
  verified_experience: boolean;
  availability: string;
  bio: string;
  bio_en: string;
  published: boolean;
};

type RequestForm = {
  id: string;
  title: string;
  type: string;
  status: string;
  date: string;
  applicants: number;
  notes: string;
};

type VacancyForm = {
  id: string;
  title: string;
  subject: string;
  grade: string;
  district: string;
  type: string;
  salary: string;
  deadline: string;
  description: string;
  requirements: string;
  published: boolean;
};

const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}`;

const newTeacher = (): TeacherForm => ({
  id: "",
  name: "",
  name_en: "",
  subject: "math",
  grades: ["middle"],
  district: "mukalla",
  mode: "both",
  experience: 1,
  price: 3000,
  rating: 0,
  reviews: 0,
  verified_identity: false,
  verified_qualification: false,
  verified_experience: false,
  availability: "partial",
  bio: "",
  bio_en: "",
  published: true,
});

const newRequest = (): RequestForm => ({
  id: "",
  title: "",
  type: "urgent",
  status: "open",
  date: new Date().toISOString().slice(0, 10),
  applicants: 0,
  notes: "",
});

const newVacancy = (): VacancyForm => ({
  id: "",
  title: "",
  subject: "math",
  grade: "middle",
  district: "mukalla",
  type: "full",
  salary: "",
  deadline: "",
  description: "",
  requirements: "",
  published: true,
});

function teacherToForm(row: TeacherRow): TeacherForm {
  return {
    id: row.id,
    name: row.name,
    name_en: row.name_en || "",
    subject: row.subject,
    grades: row.grades || [],
    district: row.district,
    mode: row.mode,
    experience: row.experience ?? 0,
    price: row.price ?? 0,
    rating: Number(row.rating ?? 0),
    reviews: row.reviews ?? 0,
    verified_identity: Boolean(row.verified_identity),
    verified_qualification: Boolean(row.verified_qualification),
    verified_experience: Boolean(row.verified_experience),
    availability: row.availability || "booked",
    bio: row.bio || "",
    bio_en: row.bio_en || "",
    published: Boolean(row.published),
  };
}

export default function AdminPage() {
  const { t, lang, toggle } = useI18n();
  const toast = useToast();

  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  const [tab, setTab] = useState<Tab>("overview");
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState<TeacherRow[]>([]);
  const [requests, setRequests] = useState<RequestRecord[]>([]);
  const [vacancies, setVacancies] = useState<VacancyRecord[]>([]);

  const [query, setQuery] = useState("");
  const [teacherForm, setTeacherForm] = useState<TeacherForm | null>(null);
  const [requestForm, setRequestForm] = useState<RequestForm | null>(null);
  const [vacancyForm, setVacancyForm] = useState<VacancyForm | null>(null);
  const [saving, setSaving] = useState(false);

  const checkAdmin = useCallback(async (next: Session | null) => {
    setSession(next);
    if (!next || !supabase) {
      setIsAdmin(false);
      setChecking(false);
      return;
    }
    setChecking(true);
    const { data, error } = await supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", next.user.id)
      .maybeSingle();
    if (error) {
      setIsAdmin(false);
      toast(t("admin.error"), "error");
    } else {
      setIsAdmin(Boolean(data));
    }
    setChecking(false);
  }, [toast, t]);

  useEffect(() => {
    if (!supabase) {
      setChecking(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => checkAdmin(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      checkAdmin(next);
    });
    return () => sub.subscription.unsubscribe();
  }, [checkAdmin]);

  const loadAll = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const [tRows, rRows, vRows] = await Promise.all([
        fetchAllTeachersForAdmin(),
        fetchRequests(),
        fetchVacancies(),
      ]);
      setTeachers(tRows);
      setRequests(rRows);
      setVacancies(vRows);
    } catch {
      toast(t("admin.error"), "error");
    } finally {
      setLoading(false);
    }
  }, [toast, t]);

  useEffect(() => {
    if (isAdmin) loadAll();
  }, [isAdmin, loadAll]);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setSigningIn(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSigningIn(false);
    if (error) toast(error.message, "error");
  };

  const signOut = async () => {
    if (supabase) await supabase.auth.signOut();
    setSession(null);
    setIsAdmin(false);
    setTeachers([]);
    setRequests([]);
    setVacancies([]);
  };

  const saveTeacher = async () => {
    if (!supabase || !teacherForm) return;
    if (!teacherForm.name.trim()) return toast(t("admin.required"), "error");
    setSaving(true);
    const payload = {
      ...teacherForm,
      id: teacherForm.id || uid("t"),
      name_en: teacherForm.name_en || null,
      bio: teacherForm.bio || null,
      bio_en: teacherForm.bio_en || null,
    };
    const { error } = await supabase.from("teachers").upsert(payload);
    setSaving(false);
    if (error) return toast(error.message, "error");
    toast(t("admin.saved"), "success");
    setTeacherForm(null);
    loadAll();
  };

  const saveRequest = async () => {
    if (!supabase || !requestForm) return;
    if (!requestForm.title.trim()) return toast(t("admin.required"), "error");
    setSaving(true);
    const payload = {
      ...requestForm,
      id: requestForm.id || uid("rq"),
      notes: requestForm.notes || null,
    };
    const { error } = await supabase.from("requests").upsert(payload);
    setSaving(false);
    if (error) return toast(error.message, "error");
    toast(t("admin.saved"), "success");
    setRequestForm(null);
    loadAll();
  };

  const saveVacancy = async () => {
    if (!supabase || !vacancyForm) return;
    if (!vacancyForm.title.trim()) return toast(t("admin.required"), "error");
    setSaving(true);
    const payload = {
      ...vacancyForm,
      id: vacancyForm.id || uid("vac"),
      salary: vacancyForm.salary || null,
      deadline: vacancyForm.deadline || null,
      description: vacancyForm.description || null,
      requirements: vacancyForm.requirements || null,
    };
    const { error } = await supabase.from("vacancies").upsert(payload);
    setSaving(false);
    if (error) return toast(error.message, "error");
    toast(t("admin.saved"), "success");
    setVacancyForm(null);
    loadAll();
  };

  const remove = async (table: "teachers" | "requests" | "vacancies", id: string) => {
    if (!supabase) return;
    if (!window.confirm(t("admin.confirmDelete"))) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) return toast(error.message, "error");
    toast(t("admin.deleted"), "success");
    loadAll();
  };

  const togglePublished = async (
    table: "teachers" | "vacancies",
    id: string,
    value: boolean
  ) => {
    if (!supabase) return;
    const { error } = await supabase.from(table).update({ published: value }).eq("id", id);
    if (error) return toast(error.message, "error");
    toast(t("admin.saved"), "success");
    loadAll();
  };

  const filteredTeachers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return teachers;
    return teachers.filter((x) =>
      `${x.name} ${x.name_en || ""} ${x.subject}`.toLowerCase().includes(q)
    );
  }, [teachers, query]);

  const stats = useMemo(
    () => ({
      total: teachers.length,
      published: teachers.filter((x) => x.published).length,
      verified: teachers.filter((x) => x.verified_identity).length,
      openRequests: requests.filter((x) => x.status === "open" || x.status === "review").length,
      vacancies: vacancies.filter((x) => x.published).length,
    }),
    [teachers, requests, vacancies]
  );

  /* ---------------- non-admin states ---------------- */

  if (!isSupabaseConfigured) {
    return (
      <div className="admin-auth">
        <div className="admin-auth__card">
          <div className="admin-auth__logo">
            <Icon name="settings" />
          </div>
          <h1 style={{ fontSize: 22, margin: "0 0 6px" }}>{t("admin.setupTitle")}</h1>
          <p className="small muted">{t("admin.setupDesc")}</p>
          <div className="alert alert--info mt-md">
            <Icon name="info" />
            <span dir="ltr" style={{ textAlign: "start" }}>
              NEXT_PUBLIC_SUPABASE_URL
              <br />
              NEXT_PUBLIC_SUPABASE_ANON_KEY
            </span>
          </div>
          <div className="row mt-lg" style={{ gap: 8 }}>
            <Link className="btn btn--ghost" href="/">
              {t("admin.backToSite")}
            </Link>
            <button className="btn" type="button" onClick={toggle}>
              {lang === "ar" ? "English" : "العربية"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (checking) {
    return (
      <div className="admin-auth">
        <div className="admin-auth__card center">
          <div className="admin-auth__logo" style={{ marginInline: "auto" }}>
            <Icon name="book" />
          </div>
          <p className="muted">{t("admin.loading")}</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="admin-auth">
        <div className="admin-auth__card">
          <div className="admin-auth__logo">
            <Icon name="lock" />
          </div>
          <h1 style={{ fontSize: 23, margin: "0 0 4px" }}>{t("admin.loginTitle")}</h1>
          <p className="small muted">{t("admin.loginSub")}</p>

          <form className="stack mt-lg" style={{ gap: 14 }} onSubmit={signIn}>
            <div className="field">
              <label className="field__label">{t("admin.email")}</label>
              <div className="input-icon">
                <Icon name="mail" />
                <input
                  className="input"
                  type="email"
                  dir="ltr"
                  required
                  autoComplete="email"
                  placeholder={t("admin.emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="field">
              <label className="field__label">{t("admin.password")}</label>
              <div className="input-icon">
                <Icon name="lock" />
                <input
                  className="input"
                  type="password"
                  dir="ltr"
                  required
                  autoComplete="current-password"
                  placeholder={t("admin.passwordPlaceholder")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <button className="btn btn--block btn--lg" type="submit" disabled={signingIn}>
              {signingIn ? t("admin.loading") : t("admin.signIn")}
            </button>
          </form>

          <p className="tiny muted mt-md" style={{ marginBottom: 0 }}>
            {t("admin.passwordHint")}
          </p>
          <div className="row row--between mt-lg">
            <Link className="small" href="/">
              {t("admin.backToSite")}
            </Link>
            <button className="small btn btn--ghost btn--sm" type="button" onClick={toggle}>
              {lang === "ar" ? "English" : "العربية"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="admin-auth">
        <div className="admin-auth__card center">
          <div
            className="admin-auth__logo"
            style={{ marginInline: "auto", background: "var(--urgent)" }}
          >
            <Icon name="alert" />
          </div>
          <h1 style={{ fontSize: 21, margin: "0 0 6px" }}>{t("admin.notAuthorized")}</h1>
          <p className="small muted" dir="ltr">
            {session.user.email}
          </p>
          <p className="tiny muted">{t("admin.supabaseNote")}</p>
          <div className="row mt-lg" style={{ gap: 8, justifyContent: "center" }}>
            <button className="btn btn--ghost" type="button" onClick={signOut}>
              {t("admin.signOut")}
            </button>
            <Link className="btn" href="/">
              {t("admin.backToSite")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- dashboard ---------------- */

  const navItems: { id: Tab; icon: string; label: string }[] = [
    { id: "overview", icon: "grid", label: t("admin.overview") },
    { id: "teachers", icon: "users", label: t("admin.teachers") },
    { id: "requests", icon: "fileText", label: t("admin.requests") },
    { id: "vacancies", icon: "briefcase", label: t("admin.vacancies") },
    { id: "settings", icon: "settings", label: t("admin.settings") },
  ];

  const statusBadge = (status: string) => {
    const cls =
      status === "accepted"
        ? "admin-badge--on"
        : status === "open"
          ? "admin-badge--warn"
          : status === "review"
            ? "admin-badge--info"
            : "admin-badge--off";
    const label =
      status === "accepted"
        ? t("admin.accepted")
        : status === "open"
          ? t("admin.open")
          : status === "review"
            ? t("admin.review")
            : t("admin.closed");
    return <span className={`admin-badge ${cls}`}>{label}</span>;
  };

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <div className="admin-brand">
          <span className="admin-brand__mark">
            <Icon name="book" />
          </span>
          <span>
            <span className="admin-brand__name">{t("brand.name")}</span>
            <span className="admin-brand__tag">{t("admin.brand")}</span>
          </span>
        </div>

        <nav className="admin-nav" aria-label={t("admin.dashboard")}>
          <span className="admin-nav__label">{t("admin.dashboard")}</span>
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`admin-link${tab === item.id ? " is-active" : ""}`}
              onClick={() => setTab(item.id)}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="admin-side__foot">
          <strong dir="ltr">{session.user.email}</strong>
          {t("admin.supabaseNote")}
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-top">
          <div>
            <h1>
              {tab === "overview"
                ? t("admin.overview")
                : tab === "teachers"
                  ? t("admin.teachers")
                  : tab === "requests"
                    ? t("admin.requests")
                    : tab === "vacancies"
                      ? t("admin.vacancies")
                      : t("admin.settings")}
            </h1>
            <p className="small muted">{t("admin.dataHint")}</p>
          </div>
          <div className="row row--wrap" style={{ gap: 8 }}>
            <span className={`admin-conn${isSupabaseConfigured ? "" : " is-off"}`}>
              <span className="dot dot--instant" />
              {isSupabaseConfigured ? t("admin.connected") : t("admin.disconnected")}
            </span>
            <Link className="btn btn--ghost btn--sm" href="/" target="_blank" rel="noreferrer">
              <Icon name="globe" className="icon--sm" />
              {t("admin.viewSite")}
            </Link>
            <button className="btn btn--ghost btn--sm" type="button" onClick={toggle}>
              {lang === "ar" ? "English" : "العربية"}
            </button>
            <button className="btn btn--sm" type="button" onClick={signOut}>
              <Icon name="logout" className="icon--sm" />
              {t("admin.signOut")}
            </button>
          </div>
        </div>

        {tab === "overview" ? (
          <>
            <div className="admin-kpis">
              <div className="admin-kpi">
                <div className="admin-kpi__icon">
                  <Icon name="users" />
                </div>
                <div className="admin-kpi__value">{stats.total}</div>
                <div className="admin-kpi__label">{t("admin.totalTeachers")}</div>
              </div>
              <div className="admin-kpi">
                <div className="admin-kpi__icon">
                  <Icon name="checkCircle" />
                </div>
                <div className="admin-kpi__value">{stats.published}</div>
                <div className="admin-kpi__label">{t("admin.publishedTeachers")}</div>
              </div>
              <div className="admin-kpi">
                <div className="admin-kpi__icon">
                  <Icon name="shield" />
                </div>
                <div className="admin-kpi__value">{stats.verified}</div>
                <div className="admin-kpi__label">{t("admin.verifiedTeachers")}</div>
              </div>
              <div className="admin-kpi">
                <div className="admin-kpi__icon">
                  <Icon name="fileText" />
                </div>
                <div className="admin-kpi__value">{stats.openRequests}</div>
                <div className="admin-kpi__label">{t("admin.openRequests")}</div>
              </div>
            </div>

            <div className="admin-card" style={{ marginBottom: 22 }}>
              <h2 className="admin-section-title">{t("admin.quickAdd")}</h2>
              <p className="admin-sub">{t("admin.dataHint")}</p>
              <div className="row row--wrap" style={{ gap: 10 }}>
                <button className="btn btn--sm" type="button" onClick={() => setTeacherForm(newTeacher())}>
                  <Icon name="plus" className="icon--sm" />
                  {t("admin.addTeacher")}
                </button>
                <button
                  className="btn btn--ghost btn--sm"
                  type="button"
                  onClick={() => setRequestForm(newRequest())}
                >
                  <Icon name="plus" className="icon--sm" />
                  {t("admin.addRequest")}
                </button>
                <button
                  className="btn btn--ghost btn--sm"
                  type="button"
                  onClick={() => setVacancyForm(newVacancy())}
                >
                  <Icon name="plus" className="icon--sm" />
                  {t("admin.addVacancy")}
                </button>
                <button className="btn btn--ghost btn--sm" type="button" onClick={loadAll}>
                  <Icon name="refresh" className="icon--sm" />
                  {t("admin.refresh")}
                </button>
              </div>
            </div>

            <div className="admin-card">
              <div className="row row--between" style={{ marginBottom: 14 }}>
                <h2 className="admin-section-title" style={{ margin: 0 }}>
                  {t("admin.teachers")}
                </h2>
                <button className="btn btn--ghost btn--sm" type="button" onClick={() => setTab("teachers")}>
                  {t("common.viewAll")}
                </button>
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>{t("admin.name")}</th>
                      <th>{t("admin.subject")}</th>
                      <th>{t("admin.district")}</th>
                      <th>{t("admin.verifiedIdentity")}</th>
                      <th>{t("admin.published")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teachers.slice(0, 5).map((row) => (
                      <tr key={row.id}>
                        <td>
                          <strong>{row.name}</strong>
                          <div className="tiny muted" dir="ltr">
                            {row.name_en || row.id}
                          </div>
                        </td>
                        <td>{row.subject}</td>
                        <td>{row.district}</td>
                        <td>
                          <span
                            className={`admin-badge ${
                              row.verified_identity ? "admin-badge--on" : "admin-badge--off"
                            }`}
                          >
                            {row.verified_identity ? t("admin.yes") : t("admin.no")}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`admin-badge ${
                              row.published ? "admin-badge--on" : "admin-badge--off"
                            }`}
                          >
                            {row.published ? t("admin.published") : t("admin.closed")}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {!teachers.length && !loading ? (
                      <tr>
                        <td colSpan={5}>
                          <div className="admin-empty">{t("admin.noData")}</div>
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : null}

        {tab === "teachers" ? (
          <div className="admin-card">
            <div className="admin-toolbar">
              <div className="input-icon">
                <Icon name="search" />
                <input
                  className="input"
                  type="search"
                  placeholder={t("admin.searchPlaceholder")}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className="row row--wrap" style={{ gap: 8 }}>
                <button className="btn btn--ghost btn--sm" type="button" onClick={loadAll}>
                  <Icon name="refresh" className="icon--sm" />
                  {t("admin.refresh")}
                </button>
                <button className="btn btn--sm" type="button" onClick={() => setTeacherForm(newTeacher())}>
                  <Icon name="plus" className="icon--sm" />
                  {t("admin.addTeacher")}
                </button>
              </div>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{t("admin.name")}</th>
                    <th>{t("admin.subject")}</th>
                    <th>{t("admin.grades")}</th>
                    <th>{t("admin.district")}</th>
                    <th>{t("admin.price")}</th>
                    <th>{t("admin.verifiedIdentity")}</th>
                    <th>{t("admin.published")}</th>
                    <th>{t("admin.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeachers.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <strong>{row.name}</strong>
                        <div className="tiny muted" dir="ltr">
                          {row.name_en || row.id}
                        </div>
                      </td>
                      <td>{row.subject}</td>
                      <td className="small">{(row.grades || []).join(", ")}</td>
                      <td>{row.district}</td>
                      <td>{Number(row.price ?? 0).toLocaleString()}</td>
                      <td>
                        <span
                          className={`admin-badge ${
                            row.verified_identity ? "admin-badge--on" : "admin-badge--off"
                          }`}
                        >
                          {row.verified_identity ? t("admin.yes") : t("admin.no")}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className={`admin-badge ${
                            row.published ? "admin-badge--on" : "admin-badge--off"
                          }`}
                          style={{ border: 0, cursor: "pointer" }}
                          onClick={() => togglePublished("teachers", row.id, !row.published)}
                        >
                          {row.published ? t("admin.yes") : t("admin.no")}
                        </button>
                      </td>
                      <td>
                        <div className="row-actions">
                          <button
                            className="btn btn--ghost btn--sm"
                            type="button"
                            onClick={() => setTeacherForm(teacherToForm(row))}
                          >
                            <Icon name="edit" className="icon--sm" />
                            {t("admin.edit")}
                          </button>
                          <button
                            className="btn btn--ghost btn--sm"
                            type="button"
                            onClick={() => remove("teachers", row.id)}
                          >
                            <Icon name="trash" className="icon--sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!filteredTeachers.length ? (
                    <tr>
                      <td colSpan={8}>
                        <div className="admin-empty">
                          <Icon name="users" />
                          <div>{query ? t("admin.emptySearch") : t("admin.noData")}</div>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {tab === "requests" ? (
          <div className="admin-card">
            <div className="admin-toolbar">
              <div>
                <h2 className="admin-section-title">{t("admin.requests")}</h2>
                <p className="admin-sub">{t("admin.manageRequests")}</p>
              </div>
              <div className="row row--wrap" style={{ gap: 8 }}>
                <button className="btn btn--ghost btn--sm" type="button" onClick={loadAll}>
                  <Icon name="refresh" className="icon--sm" />
                  {t("admin.refresh")}
                </button>
                <button className="btn btn--sm" type="button" onClick={() => setRequestForm(newRequest())}>
                  <Icon name="plus" className="icon--sm" />
                  {t("admin.addRequest")}
                </button>
              </div>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{t("admin.reqTitle")}</th>
                    <th>{t("admin.reqType")}</th>
                    <th>{t("admin.status")}</th>
                    <th>{t("admin.date")}</th>
                    <th>{t("admin.applicants")}</th>
                    <th>{t("admin.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <strong>{row.title}</strong>
                        {row.notes ? <div className="tiny muted">{row.notes}</div> : null}
                      </td>
                      <td>
                        <span className="admin-badge admin-badge--info">
                          {row.type === "job"
                            ? t("admin.job")
                            : row.type === "contact"
                              ? t("admin.contact")
                              : t("admin.urgent")}
                        </span>
                      </td>
                      <td>{statusBadge(row.status)}</td>
                      <td className="nowrap">{row.date}</td>
                      <td>{row.applicants}</td>
                      <td>
                        <div className="row-actions">
                          <button
                            className="btn btn--ghost btn--sm"
                            type="button"
                            onClick={() =>
                              setRequestForm({
                                id: row.id,
                                title: row.title,
                                type: row.type,
                                status: row.status,
                                date: row.date,
                                applicants: row.applicants,
                                notes: row.notes || "",
                              })
                            }
                          >
                            <Icon name="edit" className="icon--sm" />
                            {t("admin.edit")}
                          </button>
                          <button
                            className="btn btn--ghost btn--sm"
                            type="button"
                            onClick={() => remove("requests", row.id)}
                          >
                            <Icon name="trash" className="icon--sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!requests.length ? (
                    <tr>
                      <td colSpan={6}>
                        <div className="admin-empty">
                          <Icon name="fileText" />
                          <div>{t("admin.noData")}</div>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {tab === "vacancies" ? (
          <div className="admin-card">
            <div className="admin-toolbar">
              <div>
                <h2 className="admin-section-title">{t("admin.vacancies")}</h2>
                <p className="admin-sub">{t("admin.manageVacancies")}</p>
              </div>
              <div className="row row--wrap" style={{ gap: 8 }}>
                <button className="btn btn--ghost btn--sm" type="button" onClick={loadAll}>
                  <Icon name="refresh" className="icon--sm" />
                  {t("admin.refresh")}
                </button>
                <button className="btn btn--sm" type="button" onClick={() => setVacancyForm(newVacancy())}>
                  <Icon name="plus" className="icon--sm" />
                  {t("admin.addVacancy")}
                </button>
              </div>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{t("admin.vacancyTitle")}</th>
                    <th>{t("admin.subject")}</th>
                    <th>{t("admin.grades")}</th>
                    <th>{t("admin.district")}</th>
                    <th>{t("admin.type")}</th>
                    <th>{t("admin.salary")}</th>
                    <th>{t("admin.published")}</th>
                    <th>{t("admin.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {vacancies.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <strong>{row.title}</strong>
                        {row.deadline ? (
                          <div className="tiny muted">
                            {t("admin.deadline")}: {row.deadline}
                          </div>
                        ) : null}
                      </td>
                      <td>{row.subject}</td>
                      <td>{row.grade}</td>
                      <td>{row.district}</td>
                      <td>{row.type === "part" ? t("admin.partTime") : t("admin.fullTime")}</td>
                      <td>{row.salary || "—"}</td>
                      <td>
                        <button
                          type="button"
                          className={`admin-badge ${
                            row.published ? "admin-badge--on" : "admin-badge--off"
                          }`}
                          style={{ border: 0, cursor: "pointer" }}
                          onClick={() => togglePublished("vacancies", row.id, !row.published)}
                        >
                          {row.published ? t("admin.yes") : t("admin.no")}
                        </button>
                      </td>
                      <td>
                        <div className="row-actions">
                          <button
                            className="btn btn--ghost btn--sm"
                            type="button"
                            onClick={() =>
                              setVacancyForm({
                                id: row.id,
                                title: row.title,
                                subject: row.subject,
                                grade: row.grade,
                                district: row.district,
                                type: row.type,
                                salary: row.salary || "",
                                deadline: row.deadline || "",
                                description: row.description || "",
                                requirements: row.requirements || "",
                                published: Boolean(row.published),
                              })
                            }
                          >
                            <Icon name="edit" className="icon--sm" />
                            {t("admin.edit")}
                          </button>
                          <button
                            className="btn btn--ghost btn--sm"
                            type="button"
                            onClick={() => remove("vacancies", row.id)}
                          >
                            <Icon name="trash" className="icon--sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!vacancies.length ? (
                    <tr>
                      <td colSpan={8}>
                        <div className="admin-empty">
                          <Icon name="briefcase" />
                          <div>{t("admin.noData")}</div>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {tab === "settings" ? (
          <div className="admin-card" style={{ maxWidth: 680 }}>
            <h2 className="admin-section-title">{t("admin.settings")}</h2>
            <p className="admin-sub">{t("admin.supabaseNote")}</p>

            <div className="stack" style={{ gap: 14 }}>
              <div className="row row--between" style={{ gap: 10 }}>
                <span className="small muted">{t("admin.email")}</span>
                <strong className="small" dir="ltr">
                  {session.user.email}
                </strong>
              </div>
              <hr className="divider" style={{ margin: 0 }} />
              <div className="row row--between" style={{ gap: 10 }}>
                <span className="small muted">{t("admin.status")}</span>
                <span className={`admin-badge ${isSupabaseConfigured ? "admin-badge--on" : "admin-badge--off"}`}>
                  {isSupabaseConfigured ? t("admin.connected") : t("admin.disconnected")}
                </span>
              </div>
              <hr className="divider" style={{ margin: 0 }} />
              <div className="row row--between" style={{ gap: 10 }}>
                <span className="small muted">{t("common.language")}</span>
                <button className="btn btn--ghost btn--sm" type="button" onClick={toggle}>
                  {lang === "ar" ? "English" : "العربية"}
                </button>
              </div>
              <hr className="divider" style={{ margin: 0 }} />
              <div className="alert alert--info" style={{ margin: 0 }}>
                <Icon name="shield" />
                <span>{t("admin.supabaseNote")}</span>
              </div>
              <button className="btn btn--block" type="button" onClick={signOut}>
                <Icon name="logout" className="icon--sm" />
                {t("admin.signOut")}
              </button>
            </div>
          </div>
        ) : null}
      </main>

      {/* ---------------- Teacher modal ---------------- */}
      {teacherForm ? (
        <div className="admin-modal" role="dialog" aria-modal="true">
          <div className="admin-modal__scrim" onClick={() => setTeacherForm(null)} />
          <div className="admin-modal__card">
            <div className="admin-modal__head">
              <h2>{teacherForm.id ? t("admin.editTeacher") : t("admin.addTeacher")}</h2>
              <button
                className="btn btn--ghost btn--icon"
                type="button"
                onClick={() => setTeacherForm(null)}
                aria-label={t("admin.cancel")}
              >
                <Icon name="x" />
              </button>
            </div>

            <div className="admin-form-grid">
              <div className="field">
                <label className="field__label">{t("admin.name")}</label>
                <input
                  className="input"
                  value={teacherForm.name}
                  onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                />
              </div>
              <div className="field">
                <label className="field__label">{t("admin.nameEn")}</label>
                <input
                  className="input"
                  dir="ltr"
                  value={teacherForm.name_en}
                  onChange={(e) => setTeacherForm({ ...teacherForm, name_en: e.target.value })}
                />
              </div>
              <div className="field">
                <label className="field__label">{t("admin.subject")}</label>
                <select
                  className="select"
                  value={teacherForm.subject}
                  onChange={(e) => setTeacherForm({ ...teacherForm, subject: e.target.value })}
                >
                  {SUBJECTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {lang === "en" ? s.en : s.ar}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label className="field__label">{t("admin.district")}</label>
                <select
                  className="select"
                  value={teacherForm.district}
                  onChange={(e) => setTeacherForm({ ...teacherForm, district: e.target.value })}
                >
                  {DISTRICTS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {lang === "en" ? d.en : d.ar}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label className="field__label">{t("admin.mode")}</label>
                <select
                  className="select"
                  value={teacherForm.mode}
                  onChange={(e) => setTeacherForm({ ...teacherForm, mode: e.target.value })}
                >
                  {MODES.map((m) => (
                    <option key={m.id} value={m.id}>
                      {t(m.key)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label className="field__label">{t("admin.availability")}</label>
                <select
                  className="select"
                  value={teacherForm.availability}
                  onChange={(e) => setTeacherForm({ ...teacherForm, availability: e.target.value })}
                >
                  <option value="instant">{t("common.instant")}</option>
                  <option value="partial">{t("common.partial")}</option>
                  <option value="booked">{t("common.booked")}</option>
                </select>
              </div>
              <div className="field">
                <label className="field__label">{t("admin.experience")}</label>
                <input
                  className="input"
                  type="number"
                  min={0}
                  value={teacherForm.experience}
                  onChange={(e) =>
                    setTeacherForm({ ...teacherForm, experience: Number(e.target.value) })
                  }
                />
              </div>
              <div className="field">
                <label className="field__label">{t("admin.price")}</label>
                <input
                  className="input"
                  type="number"
                  min={0}
                  value={teacherForm.price}
                  onChange={(e) => setTeacherForm({ ...teacherForm, price: Number(e.target.value) })}
                />
              </div>
              <div className="field">
                <label className="field__label">{t("admin.rating")}</label>
                <input
                  className="input"
                  type="number"
                  min={0}
                  max={5}
                  step={0.1}
                  value={teacherForm.rating}
                  onChange={(e) => setTeacherForm({ ...teacherForm, rating: Number(e.target.value) })}
                />
              </div>
              <div className="field">
                <label className="field__label">{t("admin.reviews")}</label>
                <input
                  className="input"
                  type="number"
                  min={0}
                  value={teacherForm.reviews}
                  onChange={(e) => setTeacherForm({ ...teacherForm, reviews: Number(e.target.value) })}
                />
              </div>

              <div className="field" style={{ gridColumn: "1 / -1" }}>
                <span className="field__label">{t("admin.grades")}</span>
                <div className="row row--wrap" style={{ gap: 8 }}>
                  {GRADES.map((g) => {
                    const on = teacherForm.grades.includes(g.id);
                    return (
                      <label className="admin-check" key={g.id}>
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={() =>
                            setTeacherForm({
                              ...teacherForm,
                              grades: on
                                ? teacherForm.grades.filter((x) => x !== g.id)
                                : [...teacherForm.grades, g.id],
                            })
                          }
                        />
                        <span>{lang === "en" ? g.en : g.ar}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="field" style={{ gridColumn: "1 / -1" }}>
                <label className="field__label">{t("admin.bio")}</label>
                <textarea
                  className="textarea"
                  rows={3}
                  value={teacherForm.bio}
                  onChange={(e) => setTeacherForm({ ...teacherForm, bio: e.target.value })}
                />
              </div>
              <div className="field" style={{ gridColumn: "1 / -1" }}>
                <label className="field__label">{t("admin.bioEn")}</label>
                <textarea
                  className="textarea"
                  rows={3}
                  dir="ltr"
                  value={teacherForm.bio_en}
                  onChange={(e) => setTeacherForm({ ...teacherForm, bio_en: e.target.value })}
                />
              </div>

              <label className="admin-check">
                <input
                  type="checkbox"
                  checked={teacherForm.verified_identity}
                  onChange={(e) =>
                    setTeacherForm({ ...teacherForm, verified_identity: e.target.checked })
                  }
                />
                <span>{t("admin.verifiedIdentity")}</span>
              </label>
              <label className="admin-check">
                <input
                  type="checkbox"
                  checked={teacherForm.verified_qualification}
                  onChange={(e) =>
                    setTeacherForm({ ...teacherForm, verified_qualification: e.target.checked })
                  }
                />
                <span>{t("admin.verifiedQualification")}</span>
              </label>
              <label className="admin-check">
                <input
                  type="checkbox"
                  checked={teacherForm.verified_experience}
                  onChange={(e) =>
                    setTeacherForm({ ...teacherForm, verified_experience: e.target.checked })
                  }
                />
                <span>{t("admin.verifiedExperience")}</span>
              </label>
              <label className="admin-check">
                <input
                  type="checkbox"
                  checked={teacherForm.published}
                  onChange={(e) => setTeacherForm({ ...teacherForm, published: e.target.checked })}
                />
                <span>{t("admin.published")}</span>
              </label>
            </div>

            <div className="row row--between mt-lg" style={{ gap: 8 }}>
              <button className="btn btn--ghost" type="button" onClick={() => setTeacherForm(null)}>
                {t("admin.cancel")}
              </button>
              <button className="btn" type="button" disabled={saving} onClick={saveTeacher}>
                {saving ? t("admin.loading") : t("admin.save")}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* ---------------- Request modal ---------------- */}
      {requestForm ? (
        <div className="admin-modal" role="dialog" aria-modal="true">
          <div className="admin-modal__scrim" onClick={() => setRequestForm(null)} />
          <div className="admin-modal__card" style={{ maxWidth: 560 }}>
            <div className="admin-modal__head">
              <h2>{requestForm.id ? t("admin.editRequest") : t("admin.addRequest")}</h2>
              <button
                className="btn btn--ghost btn--icon"
                type="button"
                onClick={() => setRequestForm(null)}
                aria-label={t("admin.cancel")}
              >
                <Icon name="x" />
              </button>
            </div>
            <div className="admin-form-grid">
              <div className="field" style={{ gridColumn: "1 / -1" }}>
                <label className="field__label">{t("admin.reqTitle")}</label>
                <input
                  className="input"
                  value={requestForm.title}
                  onChange={(e) => setRequestForm({ ...requestForm, title: e.target.value })}
                />
              </div>
              <div className="field">
                <label className="field__label">{t("admin.reqType")}</label>
                <select
                  className="select"
                  value={requestForm.type}
                  onChange={(e) => setRequestForm({ ...requestForm, type: e.target.value })}
                >
                  <option value="urgent">{t("admin.urgent")}</option>
                  <option value="job">{t("admin.job")}</option>
                  <option value="contact">{t("admin.contact")}</option>
                </select>
              </div>
              <div className="field">
                <label className="field__label">{t("admin.status")}</label>
                <select
                  className="select"
                  value={requestForm.status}
                  onChange={(e) => setRequestForm({ ...requestForm, status: e.target.value })}
                >
                  <option value="open">{t("admin.open")}</option>
                  <option value="review">{t("admin.review")}</option>
                  <option value="accepted">{t("admin.accepted")}</option>
                  <option value="closed">{t("admin.closed")}</option>
                </select>
              </div>
              <div className="field">
                <label className="field__label">{t("admin.date")}</label>
                <input
                  className="input"
                  type="date"
                  value={requestForm.date}
                  onChange={(e) => setRequestForm({ ...requestForm, date: e.target.value })}
                />
              </div>
              <div className="field">
                <label className="field__label">{t("admin.applicants")}</label>
                <input
                  className="input"
                  type="number"
                  min={0}
                  value={requestForm.applicants}
                  onChange={(e) =>
                    setRequestForm({ ...requestForm, applicants: Number(e.target.value) })
                  }
                />
              </div>
              <div className="field" style={{ gridColumn: "1 / -1" }}>
                <label className="field__label">{t("admin.notes")}</label>
                <textarea
                  className="textarea"
                  rows={3}
                  value={requestForm.notes}
                  onChange={(e) => setRequestForm({ ...requestForm, notes: e.target.value })}
                />
              </div>
            </div>
            <div className="row row--between mt-lg" style={{ gap: 8 }}>
              <button className="btn btn--ghost" type="button" onClick={() => setRequestForm(null)}>
                {t("admin.cancel")}
              </button>
              <button className="btn" type="button" disabled={saving} onClick={saveRequest}>
                {saving ? t("admin.loading") : t("admin.save")}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* ---------------- Vacancy modal ---------------- */}
      {vacancyForm ? (
        <div className="admin-modal" role="dialog" aria-modal="true">
          <div className="admin-modal__scrim" onClick={() => setVacancyForm(null)} />
          <div className="admin-modal__card">
            <div className="admin-modal__head">
              <h2>{vacancyForm.id ? t("admin.editVacancy") : t("admin.addVacancy")}</h2>
              <button
                className="btn btn--ghost btn--icon"
                type="button"
                onClick={() => setVacancyForm(null)}
                aria-label={t("admin.cancel")}
              >
                <Icon name="x" />
              </button>
            </div>
            <div className="admin-form-grid">
              <div className="field" style={{ gridColumn: "1 / -1" }}>
                <label className="field__label">{t("admin.vacancyTitle")}</label>
                <input
                  className="input"
                  value={vacancyForm.title}
                  onChange={(e) => setVacancyForm({ ...vacancyForm, title: e.target.value })}
                />
              </div>
              <div className="field">
                <label className="field__label">{t("admin.subject")}</label>
                <select
                  className="select"
                  value={vacancyForm.subject}
                  onChange={(e) => setVacancyForm({ ...vacancyForm, subject: e.target.value })}
                >
                  {SUBJECTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {lang === "en" ? s.en : s.ar}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label className="field__label">{t("admin.grades")}</label>
                <select
                  className="select"
                  value={vacancyForm.grade}
                  onChange={(e) => setVacancyForm({ ...vacancyForm, grade: e.target.value })}
                >
                  {GRADES.map((g) => (
                    <option key={g.id} value={g.id}>
                      {lang === "en" ? g.en : g.ar}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label className="field__label">{t("admin.district")}</label>
                <select
                  className="select"
                  value={vacancyForm.district}
                  onChange={(e) => setVacancyForm({ ...vacancyForm, district: e.target.value })}
                >
                  {DISTRICTS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {lang === "en" ? d.en : d.ar}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label className="field__label">{t("admin.type")}</label>
                <select
                  className="select"
                  value={vacancyForm.type}
                  onChange={(e) => setVacancyForm({ ...vacancyForm, type: e.target.value })}
                >
                  <option value="full">{t("admin.fullTime")}</option>
                  <option value="part">{t("admin.partTime")}</option>
                </select>
              </div>
              <div className="field">
                <label className="field__label">{t("admin.salary")}</label>
                <input
                  className="input"
                  value={vacancyForm.salary}
                  onChange={(e) => setVacancyForm({ ...vacancyForm, salary: e.target.value })}
                />
              </div>
              <div className="field">
                <label className="field__label">{t("admin.deadline")}</label>
                <input
                  className="input"
                  type="date"
                  value={vacancyForm.deadline}
                  onChange={(e) => setVacancyForm({ ...vacancyForm, deadline: e.target.value })}
                />
              </div>
              <div className="field" style={{ gridColumn: "1 / -1" }}>
                <label className="field__label">{t("admin.description")}</label>
                <textarea
                  className="textarea"
                  rows={3}
                  value={vacancyForm.description}
                  onChange={(e) =>
                    setVacancyForm({ ...vacancyForm, description: e.target.value })
                  }
                />
              </div>
              <div className="field" style={{ gridColumn: "1 / -1" }}>
                <label className="field__label">{t("admin.requirements")}</label>
                <textarea
                  className="textarea"
                  rows={3}
                  value={vacancyForm.requirements}
                  onChange={(e) =>
                    setVacancyForm({ ...vacancyForm, requirements: e.target.value })
                  }
                />
              </div>
              <label className="admin-check" style={{ gridColumn: "1 / -1" }}>
                <input
                  type="checkbox"
                  checked={vacancyForm.published}
                  onChange={(e) => setVacancyForm({ ...vacancyForm, published: e.target.checked })}
                />
                <span>{t("admin.published")}</span>
              </label>
            </div>
            <div className="row row--between mt-lg" style={{ gap: 8 }}>
              <button className="btn btn--ghost" type="button" onClick={() => setVacancyForm(null)}>
                {t("admin.cancel")}
              </button>
              <button className="btn" type="button" disabled={saving} onClick={saveVacancy}>
                {saving ? t("admin.loading") : t("admin.save")}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
