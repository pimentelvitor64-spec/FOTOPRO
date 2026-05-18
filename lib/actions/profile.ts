"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function saveProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("photographer_profiles").upsert({
    id: user.id,
    full_name: String(formData.get("full_name") ?? ""),
    studio_name: String(formData.get("studio_name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    website: String(formData.get("website") ?? ""),
    bio: String(formData.get("bio") ?? ""),
    updated_at: new Date().toISOString(),
  });

  if (error) redirect(`/dashboard/perfil?erro=${encodeURIComponent(error.message)}`);
  revalidatePath("/dashboard");
  redirect("/dashboard");
}
