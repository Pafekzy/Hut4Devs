export class BmoniError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body: unknown,
  ) {
    super(message);
    this.name = "BmoniError";
  }
}

const BASE = (process.env.BMONI_BASE_URL ?? "https://embedded-dev.bmoni.com").replace(/\/v1\/?$/, "");
const KEY = process.env.BMONI_API_KEY ?? "";

function unwrap(body: unknown): unknown {
  if (body && typeof body === "object" && "data" in body) {
    const data = (body as { data: unknown }).data;
    if (data != null) return data;
  }
  return body;
}

function errorMessage(parsed: unknown, status: number) {
  if (parsed && typeof parsed === "object") {
    const row = parsed as Record<string, unknown>;
    const nested = row.data && typeof row.data === "object" ? (row.data as Record<string, unknown>) : null;
    const message = row.message ?? row.error ?? nested?.message ?? nested?.error;
    if (message) return String(message);
  }
  if (typeof parsed === "string" && parsed.trim()) return parsed;
  return `BMONI ${status}`;
}

export async function bmoni<T>(path: string, init?: RequestInit): Promise<T> {
  if (!KEY) {
    throw new BmoniError("BMONI_API_KEY is missing.", 500, null);
  }

  const headers = new Headers(init?.headers);
  headers.set("x-api-key", KEY);
  if (init?.body && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  const response = await fetch(`${BASE}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  const text = await response.text();
  let parsed: unknown = null;
  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = text;
    }
  }

  if (!response.ok) {
    throw new BmoniError(errorMessage(parsed, response.status), response.status, parsed);
  }

  return unwrap(parsed) as T;
}

export function pickId(
  value: unknown,
  keys = ["bmoniUserId", "userId", "smartWalletId", "proposalId", "id"],
): string {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (!value || typeof value !== "object") return "";

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = pickId(item, keys);
      if (found) return found;
    }
    return "";
  }

  const row = value as Record<string, unknown>;
  for (const key of keys) {
    const found = row[key];
    if (typeof found === "string" && found.trim()) return found.trim();
  }

  for (const nestedKey of ["data", "user", "result", "account", "wallet", "smartWallet"]) {
    if (row[nestedKey]) {
      const found = pickId(row[nestedKey], keys);
      if (found) return found;
    }
  }

  const blob = JSON.stringify(row);
  const uuid = blob.match(/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i);
  return uuid?.[0] ?? "";
}
