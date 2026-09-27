import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";

export const metadata: Metadata = {
  title: "Administração",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <AdminShell>{children}</AdminShell>;
}
