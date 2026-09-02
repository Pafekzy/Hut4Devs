import Link from "next/link";

const sections = [
  {
    kicker: "Design challenge",
    title: "How might we help fellows and interns coordinate shared responsibilities, peer support, and repayments in a way that builds trust, starting with accommodation?",
    body: "Understand before automating. Validate before scaling. Solve the human problem before choosing technology.",
  },
  {
    kicker: "Privacy",
    title: "Transparency is not a public financial life.",
    body: "The architecture should distinguish what must be verifiable from what should remain private — who may see it, why, for how long, and whether consent can be declined.",
  },
  {
    kicker: "Repair",
    title: "A missed commitment should not permanently define someone.",
    body: "History is not erased. Newer evidence still matters. Communication, a revised agreement, and completion can sit on the same trail as the difficulty.",
  },
  {
    kicker: "Governance",
    title: "A role grants responsibility before it grants privilege.",
    body: "Technical capability is not legitimate authority. A sponsor’s funding does not grant unrestricted access to community data. A room-level matter need not become a platform-wide matter.",
  },
  {
    kicker: "Technology",
    title: "Architecture first. Stack later.",
    body: "Hut4Devs is modular first, blockchain-aware not blockchain-dependent, and privacy-first for sensitive records. None of the tools is the product.",
  },
];

export function PrinciplesView() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-8">
      <p className="text-[11px] uppercase tracking-[0.22em] text-laterite">Holding the line</p>
      <h1 className="serif mt-4 text-4xl leading-[1.05] tracking-tight sm:text-5xl">
        Principles before features.
      </h1>
      <p className="mt-6 text-[17px] leading-relaxed text-ink-2">
        Hut4Devs is trusted community coordination infrastructure. Accommodation is
        the proving ground. These lines are how we refuse to become a score, a
        registry, or a marketplace for other people&apos;s need.
      </p>

      <div className="mt-12 space-y-4">
        {sections.map((section) => (
          <section key={section.kicker} className="desk desk-interactive p-6 sm:p-7">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink-3">
              {section.kicker}
            </p>
            <h2 className="serif mt-3 text-2xl leading-snug tracking-tight">
              {section.title}
            </h2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-ink-2">{section.body}</p>
          </section>
        ))}
      </div>

      <p className="serif mt-14 text-2xl leading-snug">
        We are not simply building software for a community. We are building
        infrastructure that helps a community coordinate, support, preserve
        evidence, repair, and grow.
      </p>

      <Link href="/chamber" className="btn btn-primary mt-10">
        Return to Chamber 4
      </Link>
    </article>
  );
}
