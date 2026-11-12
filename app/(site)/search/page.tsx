"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { EmptyState } from "@/components/EmptyState";
import { Icon } from "@/components/Icon";
import { useI18n } from "@/components/LanguageProvider";
import { TeacherCard } from "@/components/TeacherCard";
import { useToast } from "@/components/ToastProvider";
import {
  DISTRICTS,
  DIST,
  GRADES,
  MODES,
  SUBJECTS,
  SUBJ,
  type Teacher,
} from "@/lib/data";
import { fetchTeachers } from "@/lib/store";

type Filters = {
  q: string;
  subject: string;
  grade: string;
  district: string;
  mode: string;
  verifiedOnly: boolean;
  availableOnly: boolean;
  sort: "match" | "rating" | "experience" | "near";
};

function SearchClient() {
  const { t, tr } = useI18n();
  const toast = useToast();
  const params = useSearchParams();

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [live, setLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    q: "",
    subject: params.get("subject") || "",
    grade: params.get("grade") || "",
    district: params.get("district") || "",
    mode: params.get("mode") || "",
    verifiedOnly: false,
    availableOnly: false,
    sort: "match",
  });

  useEffect(() => {
    let active = true;
    fetchTeachers().then((res) => {
      if (!active) return;
      setTeachers(res.teachers);
      setLive(res.live);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const results = useMemo(() => {
    let list = teachers.filter((x) => {
      if (filters.subject && x.subject !== filters.subject) return false;
      if (filters.grade && !x.grades.includes(filters.grade)) return false;
      if (filters.district && x.district !== filters.district) return false;
      if (filters.mode && x.mode !== filters.mode && x.mode !== "both") return false;
      if (filters.verifiedOnly && !x.verified.identity) return false;
      if (filters.availableOnly && x.availability !== "instant") return false;
      if (filters.q) {
        const hay = `${x.name} ${x.nameEn} ${tr(SUBJ(x.subject))} ${tr(DIST(x.district))}`.toLowerCase();
        if (!hay.includes(filters.q.toLowerCase())) return false;
      }
      return true;
    });
    list = list.slice();
    if (filters.sort === "rating") list.sort((a, b) => b.rating - a.rating);
    else if (filters.sort === "experience") list.sort((a, b) => b.experience - a.experience);
    else if (filters.sort === "near")
      list.sort((a, b) => (a.district === "mukalla" ? -1 : 1) - (b.district === "mukalla" ? -1 : 1));
    else list.sort((a, b) => b.match - a.match);
    return list;
  }, [teachers, filters, tr]);

  const notify = () => toast(t("search.saved"), "success");

  return (
    <div className="container" style={{ paddingBlock: 40 }}>
      <div className="section-head" style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: "clamp(24px,3vw,34px)" }}>{t("search.title")}</h1>
        <p>{t("search.sub")}</p>
      </div>

      <div className="searchbar" style={{ marginBottom: 28 }}>
        <div className="searchbar__grid" style={{ gridTemplateColumns: "repeat(4,minmax(0,1fr))" }}>
          <div className="field">
            <label className="field__label">{t("search.subject")}</label>
            <select
              className="select"
              value={filters.subject}
              onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
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
              value={filters.grade}
              onChange={(e) => setFilters({ ...filters, grade: e.target.value })}
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
              value={filters.district}
              onChange={(e) => setFilters({ ...filters, district: e.target.value })}
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
              value={filters.mode}
              onChange={(e) => setFilters({ ...filters, mode: e.target.value })}
            >
              <option value="">{t("common.all")}</option>
              {MODES.map((m) => (
                <option key={m.id} value={m.id}>
                  {t(m.key)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid search-layout" style={{ alignItems: "start" }}>
        <aside className="card filters" style={{ padding: 18 }}>
          <div className="row row--between" style={{ marginBottom: 8 }}>
            <strong className="small">{t("search.filters")}</strong>
            <span className="chip chip--lavender">
              {results.length} {t("common.results")}
            </span>
          </div>
          <div className="filters__group">
            <div className="input-icon">
              <Icon name="search" />
              <input
                className="input"
                type="search"
                placeholder={t("common.search")}
                value={filters.q}
                onChange={(e) => setFilters({ ...filters, q: e.target.value })}
              />
            </div>
          </div>
          <div className="filters__group">
            <div className="filters__title">{t("common.availability")}</div>
            <label className="checkbox">
              <input
                type="checkbox"
                checked={filters.availableOnly}
                onChange={(e) => setFilters({ ...filters, availableOnly: e.target.checked })}
              />
              <span>{t("search.availableOnly")}</span>
            </label>
            <label className="checkbox" style={{ marginTop: 8 }}>
              <input
                type="checkbox"
                checked={filters.verifiedOnly}
                onChange={(e) => setFilters({ ...filters, verifiedOnly: e.target.checked })}
              />
              <span>{t("search.verifiedOnly")}</span>
            </label>
          </div>
          <div className="filters__group">
            <div className="filters__title">{t("common.sort")}</div>
            <select
              className="select"
              style={{ minHeight: 44 }}
              value={filters.sort}
              onChange={(e) =>
                setFilters({ ...filters, sort: e.target.value as Filters["sort"] })
              }
            >
              <option value="match">{t("sort.match")}</option>
              <option value="rating">{t("sort.rating")}</option>
              <option value="experience">{t("sort.experience")}</option>
              <option value="near">{t("sort.near")}</option>
            </select>
          </div>
          <div className="filters__group">
            <button className="btn btn--secondary btn--block btn--sm" type="button" onClick={notify}>
              {t("search.notify")}
            </button>
          </div>
        </aside>

        <div>
          <div className="row row--between" style={{ marginBottom: 14 }}>
            <h2 style={{ fontSize: 17, margin: 0 }}>{t("search.heading")}</h2>
            <span className="chip">
              {live ? t("admin.connected") : t("common.demoNotice")}
            </span>
          </div>

          {loading ? (
            <p className="muted">{t("common.loading")}</p>
          ) : results.length ? (
            <div className="stack" style={{ gap: 14 }}>
              {results.map((teacher) => (
                <TeacherCard key={teacher.id} teacher={teacher} showMatch />
              ))}
            </div>
          ) : (
            <EmptyState
              title={t("search.noResults")}
              description={t("search.noResultsDesc")}
            >
              <Link className="btn" href="/urgent">
                {t("search.postRequest")}
              </Link>
              <button className="btn btn--ghost" type="button" onClick={notify}>
                {t("search.notify")}
              </button>
            </EmptyState>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container" style={{ paddingBlock: 60 }}>…</div>}>
      <SearchClient />
    </Suspense>
  );
}
