"use server";

import { createClient, getAdmin } from "@/lib/supabase/server";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

export async function initializePaystack(priceId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const admin = getAdmin();
  const { data: profile } = await admin
    .from("profiles")
    .select("email")
    .eq("id", user.id)
    .single();

  if (!profile) throw new Error("Profile not found");

  const plans: Record<string, { amount: number; label: string }> = {
    starter: { amount: 1500, label: "Starter" },
    pro: { amount: 3900, label: "Pro" },
  };

  const plan = plans[priceId];
  if (!plan) throw new Error("Invalid plan");

  const response = await fetch(
    "https://api.paystack.co/transaction/initialize",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: profile.email,
        amount: plan.amount * 100,
        currency: "USD",
        metadata: {
          plan: priceId,
          user_id: user.id,
        },
        callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/upgrade?success=true`,
      }),
    }
  );

  const data = await response.json();

  if (!data.status) {
    throw new Error(data.message || "Failed to initialize payment");
  }

  return data.data.authorization_url;
}
