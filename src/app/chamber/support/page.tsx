import type { Metadata } from "next";
import { SupportDesk } from "@/components/chamber/SupportDesk";

export const metadata: Metadata = { title: "Support" };

export default function SupportPage() {
  return <SupportDesk />;
}
