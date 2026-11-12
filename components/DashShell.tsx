"use client";

import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { useI18n } from "./LanguageProvider";

export type DashRole = "school" | "parent" | "teacher";

export type DashItem = { id: string; icon: string; label: string };

const DEFAULT_NAMES: Record<DashRole, { ar: string; en: string }> = {
  school: { ar: "مدرسة النهضة الأهلية", en: "Al-Nahda School" },
  parent: { ar: "أحمد باشراحيل", en: "Ahmed Basharahil" },
  teacher: { ar: "أ. سارة بامطرف", en: "Sara Bamatraf" },
};

const ROLE_KEYS: Record<DashRole, string> = {
  school: "common.school",
  parent: "common.parent",
  teacher: "common.teacher",
};

export function useDashUser(role: DashRole) {
  const { lang } = useI18n();
  const [name, setName] = useState(DEFAULT_NAMES[role][lang === "en" ? "en" : "ar"]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("manhal.user");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.name) setName(parsed.name);
      }
    } catch {
      /* ignore */
    }
  }, []);

  return name;
}

export function DashShell({
  role,
  items,
  active,
  onChange,
  children,
  headerRight,
}: {
  role: DashRole;
  items: DashItem[];
  active: string;
  onChange: (id: string) => void;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
}) {
  const { t } = useI18n();
  const name = useDashUser(role);
  const initials = name.replace(/^(أ\.|Mr\.|Ms\.)\s*/, "").charAt(0);

  return (
    <div className="dash">
      <aside className="dash__side">
        <div className="dash__profile">
          <div className="avatar">{initials}</div>
          <div>
            <strong>{name}</strong>
            <span>{t(ROLE_KEYS[role])}</span>
          </div>
        </div>
        <nav className="dash__nav">
          {items.map((item) => (
            <a
              key={item.id}
              className={`dash__link${active === item.id ? " is-active" : ""}`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onChange(item.id);
              }}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </aside>
      <div className="dash__main">
        {headerRight ? (
          <div className="row row--between row--wrap" style={{ gap: 12, marginBottom: 18 }}>
            <div />
            {headerRight}
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}
