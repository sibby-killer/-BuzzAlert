import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PricingCards } from "./pricing-cards";

export const dynamic = "force-dynamic";

export default async function UpgradePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, email")
    .eq("id", user.id)
    .single();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Upgrade Your Plan</h1>
        <p className="text-muted-foreground mt-2">
          Monitor more keywords and never miss a mention
        </p>
      </div>
      <PricingCards
        currentPlan={profile?.plan || "free"}
        email={profile?.email || ""}
      />
    </div>
  );
}
