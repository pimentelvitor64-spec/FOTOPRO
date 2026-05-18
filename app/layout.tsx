import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fotopro | Galerias privadas para fotógrafos",
  description: "MVP para fotógrafos criarem galerias privadas, receberem escolhas de clientes e venderem fotos extras.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
