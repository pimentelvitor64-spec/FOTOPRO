import Link from "next/link";
import { Header } from "@/components/Header";
import { signUp } from "@/lib/actions/auth";

export default async function Cadastro({ searchParams }: { searchParams?: Promise<{ erro?: string }> }) {
  const params = await searchParams;
  return (
    <>
      <Header />
      <main className="container-page flex min-h-[70vh] items-center justify-center py-10">
        <form action={signUp} className="card w-full max-w-xl space-y-5">
          <div>
            <p className="eyebrow">Comece hoje</p>
            <h1 className="mt-3 text-3xl font-black">Criar conta de fotógrafo</h1>
          </div>
          {params?.erro && <p className="rounded-2xl bg-red-50 p-3 text-sm text-red-700">{params.erro}</p>}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="full_name">Seu nome</label>
              <input className="input" id="full_name" name="full_name" required />
            </div>
            <div>
              <label className="label" htmlFor="studio_name">Estúdio</label>
              <input className="input" id="studio_name" name="studio_name" required />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="email">E-mail</label>
            <input className="input" id="email" name="email" type="email" required />
          </div>
          <div>
            <label className="label" htmlFor="password">Senha</label>
            <input className="input" id="password" name="password" type="password" minLength={6} required />
          </div>
          <button className="button-primary w-full" type="submit">Criar conta</button>
          <p className="text-center text-sm text-black/60">
            Já tem acesso? <Link className="font-semibold text-brand" href="/login">Entrar</Link>
          </p>
        </form>
      </main>
    </>
  );
}
