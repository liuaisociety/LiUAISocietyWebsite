import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, first_name, last_name, liu_id, program, exam_year } = await req.json();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const apiKey = process.env.KIT_API_KEY;
  const formId = process.env.KIT_FORM_ID;

  if (!apiKey || !formId) {
    return NextResponse.json({ error: "Newsletter not configured" }, { status: 500 });
  }

  const res = await fetch("https://api.kit.com/v4/subscribers", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Kit-Api-Key": apiKey },
    body: JSON.stringify({
      email_address: email,
      first_name,
      fields: { last_name, liu_id, program, exam_year },
      form_ids: [Number(formId)],
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Subscription failed" }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
