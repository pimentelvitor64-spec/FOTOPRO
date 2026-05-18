import Link from "next/link";
import { signOut } from "@/lib/actions/auth";

export function Header({ authenticated = false }: { authenticated?: boolean }) {
  return (
    <header className="container-page py-6">
      <nav className="flex items-center justify-between rounded-full border border-black/10 bg-white/70 px-5 py-3 shadow-sm backdrop-blur">
        <Link href="/" className="text-lg font-black tracking-tight text-ink">
          Foto<span className="text-brand">pro</span>
        </Link>
        <div className="flex items-center gap-2">
          {authenticated ? (
            <>
              <Link className="button-secondary hidden sm:inline-flex" href="/dashboard">
                Dashboard
              </Link>
              <form action={signOut}>
                <button className="button-primary" type="submit">
                  Sair
                </button>
              </form>
            </>
          ) : (
            <>
              <Link className="button-secondary" href="/login">
                Entrar
              </Link>
              <Link className="button-primary" href="/cadastro">
                Começar
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
