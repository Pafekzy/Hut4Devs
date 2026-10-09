import { avatarTone } from "@/data/chamber";

export function Avatar({
  id,
  initials,
  size = "md",
}: {
  id: string;
  initials: string;
  size?: "sm" | "md" | "lg";
}) {
  const dim = size === "sm" ? "h-8 w-8 text-[10px]" : size === "lg" ? "h-12 w-12 text-[13px]" : "h-10 w-10 text-[12px]";
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full font-medium ${dim} ${avatarTone[id] ?? "bg-paper-2 text-ink"}`}
      aria-hidden
    >
      {initials}
    </span>
  );
}
