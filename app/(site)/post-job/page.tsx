"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/Icon";
import { useI18n } from "@/components/LanguageProvider";
import { useToast } from "@/components/ToastProvider";
import { DISTRICTS, GRADES, SUBJECTS } from "@/lib/data";
import { withBase } from "@/lib/paths";

export default function PostJobPage() {
  const { t, tr } = useI18n();
  const toast = useToast();
  const [form, setForm] = useState({
    role: "",
    subject: "english",
    grade: "middle",
    type: "full",
    district: "mukalla",
    salary: "",
    deadline: "",
    desc: "",
    reqs: "",
  });

  return (
    <div className="container" style={{ maxWidth: 880, paddingBlock: 40 }}>
      <h1>{t("job.title")}</h1>
      <p className="muted">{t("job.sub")}</p>

      <div className="card card--pad-lg mt-lg">
        <form
          className="stack"
          style={{ gap: 16 }}
          onSubmit={(e) => {
            e.preventDefault();
            toast(t("admin.vacCreated"), "success");
            setTimeout(() => {
              window.location.href = withBase("/dashboard-school");
            }, 700);
          }}
        >
          <div className="form-grid">
            <div className="field field--full">
              <label className="field__label">{t("job.role")}</label>
              <input
                className="input"
                required
                placeholder="معلمة لغة إنجليزية — المرحلة المتوسطة"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              />
            </div>
            <div className="field">
              <label className="field__label">{t("search.subject")}</label>
              <select
                className="select"
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              >
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
                required
                value={form.grade}
                onChange={(e) => setForm({ ...form, grade: e.target.value })}
              >
                {GRADES.map((g) => (
                  <option key={g.id} value={g.id}>
                    {tr(g)}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label className="field__label">{t("job.type")}</label>
              <select
                className="select"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="full">{t("job.full")}</option>
                <option value="part">{t("job.part")}</option>
              </select>
            </div>
            <div className="field">
              <label className="field__label">{t("search.district")}</label>
              <select
                className="select"
                required
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
              >
                {DISTRICTS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {tr(d)}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label className="field__label">
                {t("admin.salary")} <span className="muted">({t("common.optional")})</span>
              </label>
              <input
                className="input"
                placeholder="مثال: 120,000 ر.ي / شهريًا"
                value={form.salary}
                onChange={(e) => setForm({ ...form, salary: e.target.value })}
              />
            </div>
            <div className="field">
              <label className="field__label">{t("admin.deadline")}</label>
              <input
                className="input"
                type="date"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              />
            </div>
          </div>

          <div className="field">
            <label className="field__label">{t("job.desc")}</label>
            <textarea
              className="textarea"
              rows={4}
              placeholder="المهام، عدد الحصص، أيام الدوام…"
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
            />
          </div>
          <div className="field">
            <label className="field__label">{t("job.reqs")}</label>
            <textarea
              className="textarea"
              rows={4}
              placeholder="المؤهل، سنوات الخبرة، المهارات…"
              value={form.reqs}
              onChange={(e) => setForm({ ...form, reqs: e.target.value })}
            />
          </div>

          <div className="alert alert--info">
            <Icon name="info" />
            <span>{t("job.preview")}</span>
          </div>

          <div className="row row--between row--wrap">
            <Link className="btn btn--ghost" href="/dashboard-school">
              {t("common.cancel")}
            </Link>
            <button className="btn btn--lg" type="submit">
              {t("job.publish")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
