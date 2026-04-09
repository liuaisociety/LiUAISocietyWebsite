import { NextRequest, NextResponse } from "next/server";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

type KitSubscriber = {
  email_address?: string;
  state?: string;
};

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email")?.trim() ?? "";

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const apiKey = process.env.KIT_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "Newsletter not configured" }, { status: 500 });
  }

  let res: Response;
  try {
    res = await fetch(`https://api.kit.com/v4/subscribers?email_address=${encodeURIComponent(email)}&status=all`, {
      method: "GET",
      headers: { "Content-Type": "application/json", "X-Kit-Api-Key": apiKey },
      cache: "no-store",
    });
  } catch (err) {
    console.error("Kit API fetch error:", err);
    return NextResponse.json({ error: "Membership lookup failed" }, { status: 502 });
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error(`Kit API error ${res.status}:`, text);
    return NextResponse.json({ error: "Membership lookup failed" }, { status: 502 });
  }

  const body = await res.json();
  const subscribers = Array.isArray(body?.subscribers)
    ? body.subscribers
    : Array.isArray(body?.data)
      ? body.data
      : [];
  const matched = subscribers.find((subscriber: KitSubscriber) =>
    typeof subscriber.email_address === "string" &&
    subscriber.email_address.toLowerCase() === email.toLowerCase(),
  );

  return NextResponse.json({ isMember: Boolean(matched), state: matched?.state ?? null });
}

export async function POST(req: NextRequest) {
  const { email, first_name, last_name, liu_id, program, exam_year } = await req.json();

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const apiKey = process.env.KIT_API_KEY;
  const formId = process.env.KIT_FORM_ID;

  if (!apiKey || !formId) {
    return NextResponse.json({ error: "Newsletter not configured" }, { status: 500 });
  }

  let res: Response;
  try {
    res = await fetch("https://api.kit.com/v4/subscribers", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Kit-Api-Key": apiKey },
      body: JSON.stringify({
        email_address: email,
        first_name,
        fields: { last_name, liu_id, program, exam_year },
        form_ids: [Number(formId)],
      }),
    });
  } catch (err) {
    console.error("Kit API fetch error:", err);
    return NextResponse.json({ error: "Subscription failed" }, { status: 502 });
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error(`Kit API error ${res.status}:`, text);
    return NextResponse.json({ error: "Subscription failed" }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
