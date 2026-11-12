import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: "لوحة إدارة منهل",
  description: "لوحة تحكم صاحبة المنصة — إدارة المعلمين والطلبات والوظائف.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-root">{children}</div>;
}
