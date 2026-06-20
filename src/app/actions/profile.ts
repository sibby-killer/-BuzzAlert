"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

function getAdmin() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const fullName = formData.get("full_name") as string;
  const phone = formData.get("phone") as string;
  const redditUsername = formData.get("reddit_username") as string;
  const location = formData.get("location") as string;

  const admin = getAdmin();

  const { error } = await admin
    .from("profiles")
    .update({
      full_name: fullName || null,
      phone: phone || null,
      reddit_username: redditUsername || null,
      location: location || null,
    })
    .eq("id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/settings");
}
