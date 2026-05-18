import { Header } from "@/components/Header";
import { createGallery } from "@/lib/actions/gallery";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function NovaGaleria({ searchParams }: { searchParams?: Promise<{ erro?: string }> }) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <>
      <Header authenticated />
      <main className="container-page max-w-3xl pb-16">
        <form action={createGallery} className="card space-y-5">
          <div>
            <p className="eyebrow">Nova galeria</p>
            <h1 className="mt-3 text-4xl font-black">Configurar álbum do cliente</h1>
          </div>
          {params?.erro && <p className="rounded-2xl bg-red-50 p-3 text-sm text-red-700">{params.erro}</p>}
          <div><label className="label" htmlFor="title">Título</label><input className="input" id="title" name="title" placeholder="Ensaio família Silva" required /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="label" htmlFor="client_name">Nome do cliente</label><input className="input" id="client_name" name="client_name" /></div>
            <div><label className="label" htmlFor="client_email">E-mail do cliente</label><input className="input" id="client_email" name="client_email" type="email" /></div>
          </div>
          <div><label className="label" htmlFor="description">Descrição</label><textarea className="input min-h-28" id="description" name="description" placeholder="Explique o prazo de escolha, pacote contratado e observações." /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="label" htmlFor="included_photo_limit">Fotos inclusas</label><input className="input" id="included_photo_limit" name="included_photo_limit" type="number" min="0" defaultValue="0" /></div>
            <div><label className="label" htmlFor="extra_photo_price_cents">Valor foto extra (centavos)</label><input className="input" id="extra_photo_price_cents" name="extra_photo_price_cents" type="number" min="0" defaultValue="0" /></div>
          </div>
          <label className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white p-4 text-sm font-semibold">
            <input name="is_published" type="checkbox" defaultChecked /> Publicar link privado imediatamente
          </label>
          <button className="button-primary" type="submit">Criar galeria</button>
        </form>
      </main>
    </>
  );
}
