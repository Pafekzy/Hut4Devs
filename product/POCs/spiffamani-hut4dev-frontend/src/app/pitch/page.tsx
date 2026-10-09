import type { Metadata } from "next";
import { PitchDeck } from "@/components/pitch/PitchDeck";

export const metadata: Metadata = {
  title: "Pitch",
  description: "Hut4Devs pitch — trails of trust, starting with Chamber 4.",
};

export default function PitchPage() {
  return <PitchDeck />;
}
