import Link from "next/link";
import { Header } from "@/components/Header";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: galleries }] = await Promise.all([
    supabase.from("photographer_profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("galleries")
      .select("id,title,client_name,client_email,share_token,is_published,created_at,photos(id),photo_selections(id)")
      .eq("photographer_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  return (
    <>
      <Header authenticated />
      <main className="container-page pb-16">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Área do fotógrafo</p>
            <h1 className="mt-3 text-4xl font-black">Olá, {profile?.studio_name || user.email}</h1>
          </div>
          <div className="flex gap-3">
            <Link className="button-secondary" href="/dashboard/perfil">Editar perfil</Link>
            <Link className="button-primary" href="/dashboard/galerias/nova">Nova galeria</Link>
          </div>
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="card"><p className="text-sm text-black/55">Galerias</p><strong className="mt-2 block text-4xl">{galleries?.length ?? 0}</strong></div>
          <div className="card"><p className="text-sm text-black/55">Fotos enviadas</p><strong className="mt-2 block text-4xl">{galleries?.reduce((sum, item) => sum + item.photos.length, 0) ?? 0}</strong></div>
          <div className="card"><p className="text-sm text-black/55">Escolhas recebidas</p><strong className="mt-2 block text-4xl">{galleries?.reduce((sum, item) => sum + item.photo_selections.length, 0) ?? 0}</strong></div>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="text-2xl font-black">Suas galerias</h2>
          {galleries?.length ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {galleries.map((gallery) => (
                <article className="card" key={gallery.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold">{gallery.title}</h3>
                      <p className="mt-1 text-sm text-black/55">Cliente: {gallery.client_name || gallery.client_email || "Não informado"}</p>
                    </div>
                    <span className="rounded-full bg-brand/15 px-3 py-1 text-xs font-bold text-brand">
                      {gallery.is_published ? "Publicado" : "Rascunho"}
                    </span>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-3 text-sm text-black/60">
                    <span>{gallery.photos.length} fotos</span>
                    <span>•</span>
                    <span>{gallery.photo_selections.length} escolhidas</span>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link className="button-primary" href={`/dashboard/galerias/${gallery.id}`}>Gerenciar</Link>
                    <Link className="button-secondary" href={`/g/${gallery.share_token}`} target="_blank">Abrir link do cliente</Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="card text-center">
              <p className="text-black/60">Crie sua primeira galeria para enviar fotos e compartilhar com um cliente.</p>
              <Link className="button-primary mt-5" href="/dashboard/galerias/nova">Criar galeria</Link>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
