import type { Metadata } from "next";
import { ChamberShell } from "@/components/chamber/ChamberShell";

export const metadata: Metadata = {
  title: "Chamber 4",
};

export default function ChamberLayout({ children }: { children: React.ReactNode }) {
  return <ChamberShell>{children}</ChamberShell>;
}
