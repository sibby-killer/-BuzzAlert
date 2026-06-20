import { createClient, getAdmin } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { KeywordsTable } from "./keywords-table";

export const dynamic = "force-dynamic";

export default async function KeywordsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const admin = getAdmin();

  const { data: profile } = await admin
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  const { data: keywords } = await admin
    .from("keywords")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const plan = profile?.plan || "free";
  const limits: Record<string, number> = { free: 3, starter: 25, pro: 100 };
  const limit = limits[plan] || 3;
  const count = keywords?.length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Keywords</h1>
          <p className="text-sm text-muted-foreground">
            {count}/{limit} keywords used on {plan} plan
          </p>
        </div>
        <KeywordsTable
          keywords={keywords || []}
          plan={plan}
          count={count}
          limit={limit}
        />
      </div>
    </div>
  );
}
