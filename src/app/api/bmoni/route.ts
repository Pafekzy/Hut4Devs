import { NextResponse } from "next/server";
import { BmoniError } from "@/lib/bmoni";
import { getRailStatus, provisionRail, sendOnRail } from "@/lib/bmoni-rail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function fail(error: unknown) {
  if (error instanceof BmoniError) {
    return NextResponse.json(
      { ok: false, error: error.message, status: error.status, details: error.body },
      { status: error.status >= 400 && error.status < 600 ? error.status : 502 },
    );
  }
  return NextResponse.json(
    { ok: false, error: error instanceof Error ? error.message : "Unknown BMONI error" },
    { status: 502 },
  );
}

export async function GET() {
  try {
    const rail = await getRailStatus();
    return NextResponse.json({ ok: true, rail });
  } catch (error) {
    return fail(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      action?: string;
      amount?: string;
      purpose?: string;
      toAddress?: string;
    };

    if (body.action === "provision") {
      const rail = await provisionRail();
      return NextResponse.json({ ok: true, rail });
    }

    if (body.action === "pay") {
      const amount = Number(body.amount);
      if (!Number.isFinite(amount) || amount <= 0) {
        return NextResponse.json({ ok: false, error: "Enter an amount in naira." }, { status: 400 });
      }
      const receipt = await sendOnRail({
        amount: amount.toFixed(2),
        purpose: body.purpose?.trim() || "Chamber 4 September rent",
        toAddress: body.toAddress,
      });
      return NextResponse.json({ ok: true, receipt });
    }

    return NextResponse.json({ ok: false, error: "Unknown action." }, { status: 400 });
  } catch (error) {
    return fail(error);
  }
}
