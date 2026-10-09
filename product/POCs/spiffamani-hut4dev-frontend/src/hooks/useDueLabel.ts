"use client";

import { useEffect, useState } from "react";
import { dayLabel, dueFrom } from "@/data/chamber";

export function useDueLabel(iso: string) {
  const [label, setLabel] = useState(() => `Due ${dayLabel(iso)}`);

  useEffect(() => {
    setLabel(dueFrom(iso).label);
  }, [iso]);

  return label;
}
