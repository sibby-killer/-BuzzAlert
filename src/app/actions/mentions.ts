"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function markAsRead(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const mentionId = formData.get("mentionId") as string;
  if (!mentionId) throw new Error("Missing mention ID");

  const { error } = await supabase
    .from("mentions")
    .update({ is_read: true })
    .eq("id", mentionId)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/mentions");
}
