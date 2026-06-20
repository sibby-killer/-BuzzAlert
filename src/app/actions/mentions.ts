"use server";

import { createClient, getAdmin } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function markAsRead(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const mentionId = formData.get("mentionId") as string;
  if (!mentionId) return { error: "Missing mention ID" };

  const admin = getAdmin();

  const { error } = await admin
    .from("mentions")
    .update({ is_read: true })
    .eq("id", mentionId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/mentions");
  return { success: true };
}
