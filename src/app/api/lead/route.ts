import { NextResponse } from "next/server";

import { siteConfig } from "@/lib/site-config";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type LeadBody = {
  email?: unknown;
  brief?: unknown;
};

/**
 * POST /api/lead — owner notify via Resend (no Convex).
 * Returns 503 when RESEND_API_KEY / LEADS_NOTIFY_EMAIL are unset — client falls back to mailto.
 */
export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const notifyTo = process.env.LEADS_NOTIFY_EMAIL?.trim();
  const from =
    process.env.RESEND_FROM_EMAIL?.trim() ??
    `${siteConfig.name} <onboarding@resend.dev>`;

  if (!apiKey || !notifyTo) {
    return NextResponse.json(
      { error: "Lead API not configured", hint: "Set RESEND_API_KEY and LEADS_NOTIFY_EMAIL" },
      { status: 503 },
    );
  }

  const body: unknown = await request.json();
  const record =
    typeof body === "object" && body !== null ? (body as LeadBody) : {};
  const email =
    typeof record.email === "string" ? record.email.trim().toLowerCase() : "";
  const brief = typeof record.brief === "string" ? record.brief.trim() : "";

  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  const briefBlock = brief
    ? `<p><strong>Brief:</strong></p><pre style="white-space:pre-wrap">${escapeHtml(brief)}</pre>`
    : "";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [notifyTo],
      subject: `Brief — ${siteConfig.name}`,
      html: `<p>New lead on <strong>${escapeHtml(siteConfig.name)}</strong>:</p><p>${escapeHtml(email)}</p>${briefBlock}`,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("[api/lead] Resend error:", response.status, text);
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
