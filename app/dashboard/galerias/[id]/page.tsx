import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { uploadPhotos } from "@/lib/actions/gallery";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function GaleriaDetalhe({ params, searchParams }: { params: Promise<{ id: string }>; searchParams?: Promise<{ erro?: string }> }) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: gallery } = await supabase
    .from("galleries")
    .select("*,photos(*),photo_selections(*,photos(public_url,original_filename))")
    .eq("id", id)
    .eq("photographer_id", user.id)
    .single();

  if (!gallery) redirect("/dashboard");
  const shareUrl = `/g/${gallery.share_token}`;

  return (
    <>
      <Header authenticated />
      <main className="container-page pb-16">
        <div className="grid gap-6 lg:grid-cols-[0.75fr_0.25fr]">
          <section className="card">
            <p className="eyebrow">Gerenciar galeria</p>
            <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <h1 className="text-4xl font-black">{gallery.title}</h1>
                <p className="mt-2 text-black/60">Cliente: {gallery.client_name || gallery.client_email || "Não informado"}</p>
              </div>
              <Link className="button-secondary" href={shareUrl} target="_blank">Ver link do cliente</Link>
            </div>
            <div className="mt-6 rounded-2xl bg-sand p-4 text-sm text-black/65">
              Compartilhe: <code className="font-semibold text-ink">{shareUrl}</code>
            </div>
          </section>

          <form action={uploadPhotos} className="card space-y-4">
            <input type="hidden" name="gallery_id" value={gallery.id} />
            <h2 className="text-xl font-black">Enviar fotos</h2>
            {query?.erro && <p className="rounded-2xl bg-red-50 p-3 text-sm text-red-700">{query.erro}</p>}
            <input className="input" name="photos" type="file" accept="image/*" multiple required />
            <button className="button-primary w-full" type="submit">Fazer upload</button>
          </form>
        </div>

        <section className="mt-8">
          <h2 className="mb-4 text-2xl font-black">Fotos enviadas</h2>
          {gallery.photos.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {gallery.photos.map((photo) => (
                <article className="overflow-hidden rounded-3xl border border-black/10 bg-white" key={photo.id}>
                  <div className="relative aspect-[4/5] bg-sand">
                    <Image src={photo.public_url} alt={photo.original_filename ?? "Foto da galeria"} fill className="object-cover" sizes="(min-width:1024px) 25vw, 50vw" />
                  </div>
                  <div className="p-4 text-sm font-semibold">{photo.original_filename}</div>
                </article>
              ))}
            </div>
          ) : <p className="card text-black/60">Nenhuma foto enviada ainda.</p>}
        </section>

        <section className="mt-10">
          <h2 className="mb-4 text-2xl font-black">Escolhas do cliente</h2>
          {gallery.photo_selections.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.photo_selections.map((selection) => (
                <div className="card flex gap-4" key={selection.id}>
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-2xl bg-sand">
                    <Image src={selection.photos.public_url} alt={selection.photos.original_filename ?? "Escolha"} fill className="object-cover" sizes="80px" />
                  </div>
                  <div>
                    <p className="font-bold">{selection.client_name || selection.client_email}</p>
                    <p className="text-sm text-black/55">{selection.photos.original_filename}</p>
                    <p className="mt-2 text-xs text-brand">Escolhida em {new Date(selection.selected_at).toLocaleDateString("pt-BR")}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="card text-black/60">As fotos escolhidas aparecerão aqui.</p>}
        </section>
      </main>
    </>
  );
}
