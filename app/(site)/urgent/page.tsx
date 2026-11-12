"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/Icon";
import { useI18n } from "@/components/LanguageProvider";
import { useToast } from "@/components/ToastProvider";
import { DISTRICTS, GRADES, MODES, SUBJECTS } from "@/lib/data";
import { withBase } from "@/lib/paths";

export default function UrgentPage() {
  const { t, tr } = useI18n();
  const toast = useToast();
  const [form, setForm] = useState({
    subject: "math",
    grade: "secondary",
    district: "mukalla",
    mode: "inperson",
    when: "",
    count: "",
    notes: "",
  });

  return (
    <div className="container" style={{ maxWidth: 820, paddingBlock: 40 }}>
      <div className="row" style={{ gap: 8, marginBottom: 10 }}>
        <span className="chip chip--urgent">
          <Icon name="bolt" />
          <span>{t("urgent.badge")}</span>
        </span>
      </div>
      <h1>{t("urgentForm.title")}</h1>
      <p className="muted">{t("urgentForm.sub")}</p>

      <div className="card card--pad-lg mt-lg">
        <form
          className="stack"
          style={{ gap: 16 }}
          onSubmit={(e) => {
            e.preventDefault();
            toast(t("teacher.contactSent"), "success");
            setTimeout(() => {
              window.location.href = withBase("/dashboard-school");
            }, 700);
          }}
        >
          <div className="form-grid">
            <div className="field">
              <label className="field__label">{t("urgentForm.subject")}</label>
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
              <label className="field__label">{t("urgentForm.grade")}</label>
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
              <label className="field__label">{t("urgentForm.district")}</label>
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
              <label className="field__label">{t("urgentForm.mode")}</label>
              <select
                className="select"
                value={form.mode}
                onChange={(e) => setForm({ ...form, mode: e.target.value })}
              >
                {MODES.map((m) => (
                  <option key={m.id} value={m.id}>
                    {t(m.key)}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label className="field__label">{t("urgentForm.when")}</label>
              <input
                className="input"
                placeholder="مثال: غدًا صباحًا / هذا الأسبوع"
                value={form.when}
                onChange={(e) => setForm({ ...form, when: e.target.value })}
              />
            </div>
            <div className="field">
              <label className="field__label">
                {t("admin.students")} <span className="muted">({t("common.optional")})</span>
              </label>
              <input
                className="input"
                type="number"
                min={1}
                placeholder="4"
                value={form.count}
                onChange={(e) => setForm({ ...form, count: e.target.value })}
              />
            </div>
          </div>
          <div className="field">
            <label className="field__label">{t("urgentForm.notes")}</label>
            <textarea
              className="textarea"
              rows={4}
              placeholder="مثال: مطلوب معلم رياضيات للصف الثالث الثانوي، حصص مسائية، بدء فوري."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
          <div className="alert alert--urgent">
            <Icon name="alert" />
            <span>{t("urgentForm.note")}</span>
          </div>
          <div className="row row--between row--wrap">
            <Link className="btn btn--ghost" href="/dashboard-school">
              {t("common.notNow")}
            </Link>
            <button className="btn btn--urgent btn--lg" type="submit">
              {t("urgentForm.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
