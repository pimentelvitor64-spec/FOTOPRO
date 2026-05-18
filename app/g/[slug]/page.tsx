import Image from "next/image";
import { choosePhoto } from "@/lib/actions/gallery";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function ClientGallery({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams?: Promise<{ ok?: string; erro?: string }> }) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const supabase = await createClient();
  const { data: gallery } = await supabase
    .from("galleries")
    .select("*,photographer_profiles(studio_name,full_name,website),photos(*),photo_selections(photo_id,client_email)")
    .eq("share_token", slug)
    .eq("is_published", true)
    .single();

  if (!gallery) notFound();
  const selectedIds = new Set(gallery.photo_selections.map((selection) => selection.photo_id));
  const extraPrice = Number(gallery.extra_photo_price_cents ?? 0) / 100;

  return (
    <main className="container-page py-8">
      <section className="card mb-8">
        <p className="eyebrow">Galeria privada</p>
        <div className="mt-3 grid gap-6 lg:grid-cols-[1fr_0.35fr]">
          <div>
            <h1 className="text-4xl font-black sm:text-5xl">{gallery.title}</h1>
            <p className="mt-3 max-w-2xl text-black/65">{gallery.description || "Escolha suas fotos favoritas para edição. Use seu nome e e-mail para registrar cada seleção."}</p>
            <p className="mt-4 text-sm font-semibold text-black/55">
              Por {gallery.photographer_profiles?.studio_name || gallery.photographer_profiles?.full_name || "Fotopro"}
            </p>
          </div>
          <div className="rounded-3xl bg-sand p-5">
            <p className="text-sm text-black/55">Pacote contratado</p>
            <p className="mt-2 text-3xl font-black">{gallery.included_photo_limit || 0} fotos</p>
            <p className="mt-2 text-sm text-black/60">Foto extra: {extraPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
          </div>
        </div>
        {query?.ok && <p className="mt-5 rounded-2xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">Foto escolhida com sucesso.</p>}
        {query?.erro && <p className="mt-5 rounded-2xl bg-red-50 p-3 text-sm text-red-700">{query.erro}</p>}
      </section>

      {gallery.photos.length ? (
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {gallery.photos.map((photo) => {
            const alreadySelected = selectedIds.has(photo.id);
            return (
              <article className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm" key={photo.id}>
                <div className="relative aspect-[4/5] bg-sand">
                  <Image src={photo.public_url} alt={photo.original_filename ?? "Foto da galeria"} fill className="object-cover" sizes="(min-width:1280px) 25vw, (min-width:1024px) 33vw, 50vw" />
                  {alreadySelected && <span className="absolute right-3 top-3 rounded-full bg-brand px-3 py-1 text-xs font-bold text-white">Escolhida</span>}
                </div>
                <form action={choosePhoto} className="space-y-3 p-4">
                  <input type="hidden" name="photo_id" value={photo.id} />
                  <input type="hidden" name="gallery_id" value={gallery.id} />
                  <input type="hidden" name="slug" value={slug} />
                  <input className="input" name="client_name" placeholder="Seu nome" defaultValue={gallery.client_name ?? ""} required />
                  <input className="input" name="client_email" type="email" placeholder="Seu e-mail" defaultValue={gallery.client_email ?? ""} required />
                  <button className="button-primary w-full" type="submit">{alreadySelected ? "Salvar novamente" : "Escolher foto"}</button>
                </form>
              </article>
            );
          })}
        </section>
      ) : (
        <section className="card text-center text-black/60">O fotógrafo ainda não enviou fotos para esta galeria.</section>
      )}
    </main>
  );
}
