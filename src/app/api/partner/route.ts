import { NextRequest, NextResponse } from "next/server";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  const { name, company, email, interest, message } = await req.json();

  if (!name?.trim() || !company?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Email not configured" }, { status: 500 });
  }

  const html = `
    <h2>New Partnership Enquiry</h2>
    <table style="border-collapse:collapse;width:100%;max-width:600px">
      <tr><td style="padding:8px 0;color:#888;width:140px">Name</td><td style="padding:8px 0"><strong>${name}</strong></td></tr>
      <tr><td style="padding:8px 0;color:#888">Company</td><td style="padding:8px 0"><strong>${company}</strong></td></tr>
      <tr><td style="padding:8px 0;color:#888">Email</td><td style="padding:8px 0">${email}</td></tr>
      <tr><td style="padding:8px 0;color:#888">Interest</td><td style="padding:8px 0">${interest || "Not specified"}</td></tr>
      <tr><td style="padding:8px 0;color:#888;vertical-align:top">Message</td><td style="padding:8px 0;white-space:pre-wrap">${message}</td></tr>
    </table>
  `;

  let res: Response;
  try {
    res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "LiU AI Society <noreply@liuais.com>",
        to: ["contact@liuais.com"],
        reply_to: email,
        subject: `Partnership enquiry from ${company}`,
        html,
      }),
    });
  } catch (err) {
    console.error("Resend fetch error:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 502 });
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error(`Resend error ${res.status}:`, text);
    return NextResponse.json({ error: "Failed to send email" }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
