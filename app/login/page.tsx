import Link from "next/link";
import { Header } from "@/components/Header";
import { signIn } from "@/lib/actions/auth";

export default async function Login({ searchParams }: { searchParams?: Promise<{ erro?: string }> }) {
  const params = await searchParams;
  return (
    <>
      <Header />
      <main className="container-page flex min-h-[70vh] items-center justify-center py-10">
        <form action={signIn} className="card w-full max-w-md space-y-5">
          <div>
            <p className="eyebrow">Bem-vindo de volta</p>
            <h1 className="mt-3 text-3xl font-black">Entrar no Fotopro</h1>
          </div>
          {params?.erro && <p className="rounded-2xl bg-red-50 p-3 text-sm text-red-700">{params.erro}</p>}
          <div>
            <label className="label" htmlFor="email">E-mail</label>
            <input className="input" id="email" name="email" type="email" required />
          </div>
          <div>
            <label className="label" htmlFor="password">Senha</label>
            <input className="input" id="password" name="password" type="password" minLength={6} required />
          </div>
          <button className="button-primary w-full" type="submit">Entrar</button>
          <p className="text-center text-sm text-black/60">
            Ainda não tem conta? <Link className="font-semibold text-brand" href="/cadastro">Cadastre-se</Link>
          </p>
        </form>
      </main>
    </>
  );
}
