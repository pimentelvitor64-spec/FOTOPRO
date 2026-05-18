"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createGallery(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("galleries")
    .insert({
      photographer_id: user.id,
      title: String(formData.get("title") ?? ""),
      client_name: String(formData.get("client_name") ?? ""),
      client_email: String(formData.get("client_email") ?? ""),
      description: String(formData.get("description") ?? ""),
      extra_photo_price_cents: Number(formData.get("extra_photo_price_cents") ?? 0),
      included_photo_limit: Number(formData.get("included_photo_limit") ?? 0),
      is_published: formData.get("is_published") === "on",
    })
    .select("id")
    .single();

  if (error || !data) redirect(`/dashboard/galerias/nova?erro=${encodeURIComponent(error?.message ?? "Erro ao criar galeria")}`);
  revalidatePath("/dashboard");
  redirect(`/dashboard/galerias/${data.id}`);
}

export async function uploadPhotos(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const galleryId = String(formData.get("gallery_id") ?? "");
  const files = formData.getAll("photos").filter((file): file is File => file instanceof File && file.size > 0);

  const { data: gallery } = await supabase
    .from("galleries")
    .select("id, photographer_id")
    .eq("id", galleryId)
    .eq("photographer_id", user.id)
    .single();

  if (!gallery) redirect("/dashboard");

  for (const file of files) {
    const extension = file.name.split(".").pop() ?? "jpg";
    const path = `${user.id}/${galleryId}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage.from("gallery-photos").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

    if (uploadError) redirect(`/dashboard/galerias/${galleryId}?erro=${encodeURIComponent(uploadError.message)}`);

    const { data: publicUrl } = supabase.storage.from("gallery-photos").getPublicUrl(path);
    await supabase.from("photos").insert({
      gallery_id: galleryId,
      photographer_id: user.id,
      storage_path: path,
      public_url: publicUrl.publicUrl,
      original_filename: file.name,
    });
  }

  revalidatePath(`/dashboard/galerias/${galleryId}`);
  redirect(`/dashboard/galerias/${galleryId}`);
}

export async function choosePhoto(formData: FormData) {
  const supabase = await createClient();
  const photoId = String(formData.get("photo_id") ?? "");
  const galleryId = String(formData.get("gallery_id") ?? "");
  const clientName = String(formData.get("client_name") ?? "");
  const clientEmail = String(formData.get("client_email") ?? "");
  const slug = String(formData.get("slug") ?? "");

  const { error } = await supabase.from("photo_selections").upsert(
    {
      photo_id: photoId,
      gallery_id: galleryId,
      client_name: clientName,
      client_email: clientEmail,
      selected_at: new Date().toISOString(),
    },
    { onConflict: "photo_id,client_email" },
  );

  if (error) redirect(`/g/${slug}?erro=${encodeURIComponent(error.message)}`);
  revalidatePath(`/g/${slug}`);
  redirect(`/g/${slug}?ok=foto-escolhida`);
}
