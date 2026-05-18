import Link from "next/link";
import { Header } from "@/components/Header";

const features = [
  "Galerias privadas com link compartilhável",
  "Upload de fotos direto para o Supabase Storage",
  "Cliente escolhe favoritas sem criar conta",
  "Fotógrafo acompanha seleções e potencial de extras",
];

export default function Home() {
  return (
    <>
      <Header />
      <main className="container-page pb-16 pt-8">
        <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="eyebrow">MVP para fotógrafos</p>
            <h1 className="mt-4 max-w-4xl text-5xl font-black tracking-tight text-ink sm:text-6xl lg:text-7xl">
              Entregue galerias privadas com seleção de fotos em minutos.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-black/65">
              O Fotopro centraliza álbuns, uploads, links privados para clientes e uma área simples para acompanhar as fotos escolhidas para edição ou compra extra.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/cadastro" className="button-primary">
                Criar minha conta
              </Link>
              <Link href="/login" className="button-secondary">
                Já tenho acesso
              </Link>
            </div>
          </div>
          <div className="card overflow-hidden p-3">
            <div className="rounded-[1.5rem] bg-ink p-5 text-white">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-sm text-white/55">Galeria</p>
                  <h2 className="text-2xl font-bold">Casamento Ana & Leo</h2>
                </div>
                <span className="rounded-full bg-brand px-3 py-1 text-xs font-bold">24 escolhidas</span>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {Array.from({ length: 9 }).map((_, index) => (
                  <div key={index} className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-white/25 to-brand/40" />
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className="mt-16 grid gap-4 md:grid-cols-4">
          {features.map((feature) => (
            <div className="card" key={feature}>
              <div className="mb-5 h-10 w-10 rounded-2xl bg-brand/15" />
              <p className="font-semibold leading-6">{feature}</p>
            </div>
          ))}
        </section>
      </main>
    </>
  );
}
