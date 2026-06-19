import { NextResponse } from "next/server";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!;

async function verifyPaystackSignature(body: string, signature: string): Promise<boolean> {
  try {
    const keyData = new TextEncoder().encode(PAYSTACK_SECRET);
    const bodyData = new TextEncoder().encode(body);

    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-512" },
      false,
      ["sign"]
    );

    const sig = await crypto.subtle.sign("HMAC", key, bodyData);
    const hash = Array.from(new Uint8Array(sig))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return hash === signature;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-paystack-signature");

    const isValid = await verifyPaystackSignature(body, signature || "");
    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);

    if (event.event === "charge.success") {
      const { metadata, customer, status } = event.data;

      if (status !== "success") {
        return NextResponse.json({ received: true });
      }

      const plan = metadata?.plan;
      const email = customer?.email;

      if (!plan || !email) {
        return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
      }

      if (!["starter", "pro"].includes(plan)) {
        return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
      }

      const { createClient } = await import("@supabase/supabase-js");
      const supabaseService = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
          auth: { autoRefreshToken: false, persistSession: false },
        }
      );

      const { error } = await supabaseService
        .from("profiles")
        .update({
          plan,
          paystack_customer_code: customer.customer_code,
        })
        .eq("email", email);

      if (error) {
        console.error("Failed to update profile:", error);
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
