import type { Metadata } from "next";
import { PrinciplesView } from "@/components/landing/PrinciplesView";
import { SiteFooter } from "@/components/site/SiteFooter";

export const metadata: Metadata = {
  title: "Principles",
};

export default function PrinciplesPage() {
  return (
    <>
      <main id="main">
        <PrinciplesView />
      </main>
      <SiteFooter />
    </>
  );
}
