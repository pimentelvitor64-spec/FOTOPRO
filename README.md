# Fotopro

MVP web em **Next.js + Supabase + Tailwind CSS** para fotógrafos criarem galerias privadas, enviarem fotos, compartilharem um link com clientes e acompanharem as fotos escolhidas para edição ou compra extra.

## Funcionalidades implementadas

- Login e cadastro com e-mail/senha via Supabase Auth.
- Perfil do fotógrafo com dados do estúdio.
- Área do fotógrafo com resumo de galerias, fotos e escolhas.
- Criação de álbum/galeria com cliente, limite de fotos inclusas e valor de foto extra.
- Upload múltiplo de imagens para o Supabase Storage.
- Link privado público com token não sequencial para o cliente.
- Cliente escolhe/favorita fotos informando nome e e-mail, sem precisar criar conta.
- Fotógrafo visualiza as fotos selecionadas na página da galeria.
- Layout responsivo, moderno e limpo com Tailwind CSS.

## Requisitos

- Node.js 20+ (recomendado 22+)
- npm
- Projeto no Supabase

## Como rodar localmente

1. Instale as dependências:

```bash
npm install
```

2. Copie as variáveis de ambiente:

```bash
cp .env.example .env.local
```

3. Preencha `.env.local` com as chaves do seu projeto Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_CHAVE_ANON
```

4. No Supabase, abra **SQL Editor** e execute o arquivo:

```bash
supabase/schema.sql
```

O script cria as tabelas `photographer_profiles`, `galleries`, `photos`, `photo_selections`, políticas RLS, trigger de criação automática de perfil e o bucket público `gallery-photos`.

5. Rode o servidor de desenvolvimento:

```bash
npm run dev
```

6. Acesse `http://localhost:3000`.

## Fluxo principal de uso

1. Crie uma conta em `/cadastro`.
2. Complete o perfil em `/dashboard/perfil`.
3. Crie uma galeria em `/dashboard/galerias/nova`.
4. Faça upload das fotos na página da galeria.
5. Compartilhe o link `/g/{share_token}` com o cliente.
6. O cliente escolhe as fotos.
7. O fotógrafo acompanha as escolhas em `/dashboard/galerias/{id}`.

## Estrutura do projeto

```text
app/                         Rotas e páginas do Next.js App Router
app/dashboard/               Área autenticada do fotógrafo
app/g/[slug]/                Galeria privada para o cliente
components/                  Componentes reutilizáveis
lib/actions/                 Server Actions de auth, perfil e galerias
lib/supabase/                Clientes Supabase para server/browser
supabase/schema.sql          Schema, RLS e storage do Supabase
```

## Observações do MVP

- O bucket `gallery-photos` é público para simplificar a entrega das imagens no MVP. Em produção, considere URLs assinadas, marca d'água e controles adicionais de expiração.
- O link da galeria usa `share_token` aleatório para dificultar descoberta, mas não substitui autenticação do cliente caso o produto exija segurança mais forte.
- Pagamentos de fotos extras ainda não foram integrados; o valor por foto extra já fica salvo na galeria para uma próxima etapa com Stripe, Mercado Pago ou similar.
