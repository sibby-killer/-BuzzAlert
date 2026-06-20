import { createClient, getAdmin } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SettingsForm } from "./settings-form";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const admin = getAdmin();

  const { data: profile } = await admin
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Update your profile information
        </p>
      </div>
      <SettingsForm
        email={profile?.email || user.email || ""}
        fullName={profile?.full_name || ""}
        phone={profile?.phone || ""}
        redditUsername={profile?.reddit_username || ""}
        location={profile?.location || ""}
      />
    </div>
  );
}
