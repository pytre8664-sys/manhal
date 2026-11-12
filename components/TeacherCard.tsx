"use client";

import Link from "next/link";
import { DIST, GRADE, MODE_LABEL, SUBJ, type Teacher } from "@/lib/data";
import { Icon } from "./Icon";
import { useI18n } from "./LanguageProvider";

export function AvailabilityBadge({ availability }: { availability: string }) {
  const { t } = useI18n();
  const cls =
    availability === "instant" ? "instant" : availability === "partial" ? "partial" : "booked";
  const key =
    availability === "instant"
      ? "common.instant"
      : availability === "partial"
        ? "common.partial"
        : "common.booked";
  return (
    <span className="availability">
      <span className={`dot dot--${cls}`} />
      {t(key)}
    </span>
  );
}

export function TeacherCard({
  teacher,
  showMatch = false,
  basePath = "",
}: {
  teacher: Teacher;
  showMatch?: boolean;
  basePath?: string;
}) {
  const { t, tr, lang } = useI18n();
  const name = lang === "en" ? teacher.nameEn : teacher.name;
  const initials = name.replace(/^(أ\.|Mr\.|Ms\.)\s*/, "").trim().charAt(0);

  return (
    <article className="teacher-card" data-teacher={teacher.id}>
      <div className="teacher-card__avatar">{initials}</div>
      <div className="teacher-card__body">
        <div className="teacher-card__top">
          <div>
            <h3 className="teacher-card__name">{name}</h3>
            <p className="teacher-card__meta">
              {tr(SUBJ(teacher.subject))} · {teacher.grades.map((g) => tr(GRADE(g))).join(" / ")} ·{" "}
              {tr(DIST(teacher.district))}
            </p>
          </div>
          {teacher.verified.identity ? (
            <span className="chip chip--verified">
              <Icon name="shield" />
              {t("common.verified")}
            </span>
          ) : (
            <span className="chip chip--outline">{t("common.notVerified")}</span>
          )}
        </div>

        <div className="teacher-card__tags">
          <span className="chip">{t(MODE_LABEL(teacher.mode))}</span>
          <span className="chip">
            {teacher.experience} {t("common.years")}
          </span>
          {showMatch ? (
            <span className="match-badge">
              {teacher.match}% {t("sort.match")}
            </span>
          ) : null}
        </div>

        <div className="teacher-card__foot">
          <div className="row" style={{ gap: 12 }}>
            <span className="rating">
              <Icon name="star" />
              {teacher.rating.toFixed(1)}{" "}
              <span className="muted small">({teacher.reviews})</span>
            </span>
            <AvailabilityBadge availability={teacher.availability} />
          </div>
          <div className="row" style={{ gap: 8 }}>
            <span className="price">
              {teacher.price.toLocaleString()} <span>{t("common.perHour")}</span>
            </span>
            <Link className="btn btn--sm" href={`/teacher?id=${teacher.id}`}>
              {t("common.viewProfile")}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
