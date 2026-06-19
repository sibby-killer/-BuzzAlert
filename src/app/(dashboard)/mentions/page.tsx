import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MentionsTable } from "./mentions-table";

export const dynamic = "force-dynamic";

export default async function MentionsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: mentions } = await supabase
    .from("mentions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Mentions</h1>
        <p className="text-sm text-muted-foreground">
          Recent Reddit mentions matching your keywords
        </p>
      </div>
      <MentionsTable mentions={mentions || []} />
    </div>
  );
}
