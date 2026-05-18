import { Header } from "@/components/Header";
import { saveProfile } from "@/lib/actions/profile";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Perfil({ searchParams }: { searchParams?: Promise<{ erro?: string }> }) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("photographer_profiles").select("*").eq("id", user.id).single();

  return (
    <>
      <Header authenticated />
      <main className="container-page max-w-3xl pb-16">
        <form action={saveProfile} className="card space-y-5">
          <div>
            <p className="eyebrow">Perfil do fotógrafo</p>
            <h1 className="mt-3 text-4xl font-black">Dados do estúdio</h1>
          </div>
          {params?.erro && <p className="rounded-2xl bg-red-50 p-3 text-sm text-red-700">{params.erro}</p>}
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="label" htmlFor="full_name">Seu nome</label><input className="input" id="full_name" name="full_name" defaultValue={profile?.full_name ?? ""} required /></div>
            <div><label className="label" htmlFor="studio_name">Nome do estúdio</label><input className="input" id="studio_name" name="studio_name" defaultValue={profile?.studio_name ?? ""} required /></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="label" htmlFor="phone">Telefone</label><input className="input" id="phone" name="phone" defaultValue={profile?.phone ?? ""} /></div>
            <div><label className="label" htmlFor="website">Site/Instagram</label><input className="input" id="website" name="website" defaultValue={profile?.website ?? ""} /></div>
          </div>
          <div><label className="label" htmlFor="bio">Bio</label><textarea className="input min-h-32" id="bio" name="bio" defaultValue={profile?.bio ?? ""} /></div>
          <button className="button-primary" type="submit">Salvar perfil</button>
        </form>
      </main>
    </>
  );
}
