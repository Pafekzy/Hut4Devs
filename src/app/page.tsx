import { LandingView } from "@/components/landing/LandingView";
import { SiteFooter } from "@/components/site/SiteFooter";

export default function HomePage() {
  return (
    <>
      <main id="main">
        <LandingView />
      </main>
      <SiteFooter />
    </>
  );
}
