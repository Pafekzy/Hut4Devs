import type { Metadata } from "next";
import { TrailView } from "@/components/chamber/TrailView";

export const metadata: Metadata = { title: "Trail" };

export default function TrailPage() {
  return <TrailView />;
}
