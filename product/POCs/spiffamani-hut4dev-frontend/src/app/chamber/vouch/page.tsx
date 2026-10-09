import type { Metadata } from "next";
import { VouchDesk } from "@/components/chamber/VouchDesk";

export const metadata: Metadata = { title: "Vouch" };

export default function VouchPage() {
  return <VouchDesk />;
}
