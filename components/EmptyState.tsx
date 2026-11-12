"use client";

import type { ReactNode } from "react";
import { Icon } from "./Icon";

export function EmptyState({
  icon = "search",
  title,
  description,
  children,
}: {
  icon?: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="empty">
      <div className="empty__icon">
        <Icon name={icon} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {children ? (
        <div className="row row--wrap mt-md" style={{ justifyContent: "center", gap: 8 }}>
          {children}
        </div>
      ) : null}
    </div>
  );
}
