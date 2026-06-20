"use server";

import { createClient, getAdmin } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addKeyword(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const keyword = formData.get("keyword") as string;
  if (!keyword?.trim()) return { error: "Keyword is required" };

  const admin = getAdmin();

  const { count } = await admin
    .from("keywords")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { data: profile } = await admin
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  const plan = profile?.plan || "free";
  const limits: Record<string, number> = { free: 3, starter: 25, pro: 100 };
  const limit = limits[plan] || 3;

  if (count && count >= limit) {
    return {
      error: `You've reached the ${plan} plan limit of ${limit} keywords. Upgrade to add more.`,
    };
  }

  const { error } = await admin
    .from("keywords")
    .insert({ user_id: user.id, keyword: keyword.trim().toLowerCase() });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/keywords");
  return { success: true };
}

export async function deleteKeyword(keywordId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const admin = getAdmin();

  const { error } = await admin
    .from("keywords")
    .delete()
    .eq("id", keywordId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/keywords");
  return { success: true };
}
