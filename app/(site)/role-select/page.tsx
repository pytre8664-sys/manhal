"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/Icon";
import { useI18n } from "@/components/LanguageProvider";

type Role = "school" | "parent" | "teacher";

export default function RoleSelectPage() {
  const { t } = useI18n();
  const [selected, setSelected] = useState<Role | null>(null);

  const choose = (role: Role) => {
    setSelected(role);
    localStorage.setItem("manhal.role", role);
  };

  const roles: { id: Role; icon: string; title: string; desc: string }[] = [
    { id: "school", icon: "school", title: "roles.school.title", desc: "roles.school.desc" },
    { id: "parent", icon: "user", title: "roles.parent.title", desc: "roles.parent.desc" },
    { id: "teacher", icon: "award", title: "roles.teacher.title", desc: "roles.teacher.desc" },
  ];

  return (
    <div className="container" style={{ maxWidth: 1040, paddingBlock: 64 }}>
      <div className="section-head center" style={{ marginInline: "auto" }}>
        <span className="hero__eyebrow">{t("nav.start")}</span>
        <h1>{t("role.title")}</h1>
        <p>{t("role.sub")}</p>
      </div>

      <div className="grid grid-3">
        {roles.map((r) => (
          <article
            key={r.id}
            className={`role-card${selected === r.id ? " role-card--selected" : ""}`}
            tabIndex={0}
            role="button"
            aria-pressed={selected === r.id}
            style={{ cursor: "pointer" }}
            onClick={() => choose(r.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                choose(r.id);
              }
            }}
          >
            <div className="role-card__icon">
              <Icon name={r.icon} />
            </div>
            <h2 className="role-card__title">{t(r.title)}</h2>
            <p className="role-card__desc">{t(r.desc)}</p>
            {selected === r.id ? (
              <span className="chip chip--lavender mt-sm">{t("role.selected")}</span>
            ) : null}
          </article>
        ))}
      </div>

      <div className="alert alert--info mt-lg">
        <Icon name="info" />
        <span>{t("role.note")}</span>
      </div>

      <div className="row row--between row--wrap mt-xl">
        <div className="row small muted" style={{ gap: 6 }}>
          <span>{t("auth.haveAccount")}</span>
          <Link href="/login">{t("nav.login")}</Link>
        </div>
        <Link
          className={`btn btn--lg${selected ? "" : " hidden"}`}
          href={selected ? `/signup?role=${selected}` : "/signup"}
          aria-disabled={!selected}
        >
          <span>{t("common.next")}</span>
          <Icon name="arrowLeft" />
        </Link>
      </div>
    </div>
  );
}
