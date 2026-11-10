# Nosreme — Caderno de Ensaios & Blog Editorial

O **Nosreme** é um blog pessoal editorial dedicado a ensaios, literatura, filosofia, tecnologia, cultura e jogos. Projetado para ser publicado em `blog.nosreme.cloud`, o site prioriza a experiência de leitura atenta de periódicos literários e revistas acadêmicas, utilizando uma arquitetura 100% estática com [Hugo](https://gohugo.io/).

O site principal `nosreme.cloud` funciona como um portfólio separado; este repositório é dedicado exclusivamente ao blog.

---

## Características & Filosofia

- **Minimalismo editorial**: Tipografia clássica de alto contraste e legibilidade (`Charter`, `Newsreader`, `Georgia`) inspirada nas melhores publicações literárias independentes.
- **Leveza e independência técnica**: Zero frameworks (sem React, Vue, Next.js, Tailwind ou Node.js). Apenas HTML semântico, CSS puro e JavaScript nativo mínimo.
- **Zero rastreamento**: Sem cookies de terceiros, sem Google Analytics, sem scripts invasivos e sem necessidade de banners de consentimento (LGPD/GDPR compliance por design).
- **Modo escuro e claro**: Alternância com respeito automático às preferências do sistema (`prefers-color-scheme`) e persistência segura em `localStorage` sem efeito de *flash* (FOUC).
- **Pesquisa instantânea local**: Busca client-side leve alimentada por um índice JSON gerado nativamente pelo Hugo (`/index.json`), sem dependência de servidores ou bancos de dados externos.
- **Navegação editorial completa**: Sumário expansível para artigos longos, tempo de leitura estimado, tags, categorias nativas, navegação entre artigos e botão discreto de cópia de link permanente.
- **SEO & Distribuição**: RSS feed nativo (`/index.xml`), Sitemap (`/sitemap.xml`), Robots.txt, Open Graph, Twitter Cards e URLs amigáveis.
- **Pronto para impressão**: Estilos dedicados (`@media print`) para leitura ou exportação em PDF limpa e acadêmica.

---

## Requisitos

- **Hugo Extended**: versão `0.158.0` ou superior (testado e homologado na versão `v0.162.1+extended`).
- **Python 3**: opcional, para executar a suíte de testes de integridade (`tests/validate_site.py`).

---

## Como Executar Localmente

Para iniciar o servidor de desenvolvimento do Hugo com recarregamento em tempo real (LiveReload):

```bash
hugo server -D
```

Acesse no navegador:
```
http://localhost:1313/
```

> **Dica**: A flag `-D` inclui rascunhos (`draft = true`). Para visualizar o site exatamente como será publicado em produção, execute apenas `hugo server`.

---

## Como Criar um Novo Artigo

O projeto possui um archetype configurado com todas as variáveis editoriais. Para criar um novo texto:

```bash
hugo new posts/meu-novo-ensaio.md
```

O arquivo será criado em `content/posts/meu-novo-ensaio.md` com o front matter estruturado:

```toml
+++
title = 'Meu Novo Ensaio'
date = 2026-11-10T17:00:00-03:00
description = 'Uma breve sinopse reflexiva que aparecerá nos resumos e metadados Open Graph.'
categories = ['Ensaios', 'Filosofia']
tags = ['leitura', 'epistemologia']
draft = true
featured = false
toc = true
image = ''
+++

Seu texto em Markdown aqui...
```

### Campos do Front Matter

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `title` | String | Título principal do artigo. |
| `date` | Timestamp | Data de publicação (ISO 8601). |
| `description` | String | Subtítulo e resumo editorial do texto. |
| `categories` | Array | Lista de categorias temáticas. |
| `tags` | Array | Tópicos específicos para indexação. |
| `draft` | Booleano | Se `true`, o artigo não é incluído no build de produção. Mude para `false` para publicar. |
| `featured` | Booleano | Se `true`, destaca o artigo na página inicial. |
| `toc` | Booleano | Ativa (`true`) ou oculta (`false`) o sumário no início do artigo. |

---

## SEO & Canonicalização

O blog foi projetado como publicação editorial autoral primária e independente:

- **URLs Canônicas**: Cada artigo emite uma tag `<link rel="canonical" href="https://blog.nosreme.cloud/posts/<slug>/">` apontando para si próprio.
- **Transparência Editorial**: Artigos originados do Substack contêm uma referência discreta no rodapé indicando a publicação original via front matter (`originalUrl` e `originalPublication`), com link direto.
- **Estratégia contra Conteúdo Duplicado**:
  1. O domínio próprio `blog.nosreme.cloud` funciona como a sede oficial dos ensaios.
  2. No Substack, recomenda-se configurar o campo *Custom Canonical URL* nas configurações de cada post apontando para o endereço correspondente no blog (`https://blog.nosreme.cloud/posts/<slug>/`), consolidando a autoridade de domínio perante mecanismos de busca (Google, Bing).
  3. Não se deve alterar o canonical do blog para o Substack, garantindo que a autoridade permaneça sob o controle e infraestrutura do autor.

---

## Artigos Publicados

1. **O latino que viraliza não é o latino que existe**
   - *Publicação*: 14 de março de 2026
   - *Categorias*: Ensaios, Filosofia
   - *Tags*: america-latina, cultura, identidade, futebol, algoritmos
   - *Original*: [Substack](https://nosremekk.substack.com/p/o-latino-que-viraliza-nao-e-o-latino)
2. **Fantasma na Máquina: Uma Genealogia do Reacionarismo Gamer**
   - *Publicação*: 4 de fevereiro de 2026
   - *Categorias*: Jogos, Filosofia, Ensaios
   - *Tags*: game-studies, estetica, industria-cultural, critica
   - *Original*: [Substack](https://nosremekk.substack.com/p/fantasma-na-maquina-uma-genealogia)

---

As seções temáticas iniciais estão definidas em `content/categories/`:

- **Ensaios** (`content/categories/ensaios/_index.md`)
- **Filosofia** (`content/categories/filosofia/_index.md`)
- **Literatura** (`content/categories/literatura/_index.md`)
- **Tecnologia** (`content/categories/tecnologia/_index.md`)
- **Jogos** (`content/categories/jogos/_index.md`)
- **Projetos** (`content/categories/projetos/_index.md`)

Para adicionar uma nova categoria ou editar a descrição editorial existente, edite o respectivo arquivo `_index.md` dentro de `content/categories/<nome-da-categoria>/`.

---

## Personalização Visual

Toda a identidade estética está concentrada em **`assets/css/main.css`**, utilizando variáveis nativas (CSS custom properties) processadas e minificadas automaticamente pelo Hugo Pipes:

### Paleta de Cores

```css
:root {
  /* Modo Claro: papel aquecido */
  --bg-canvas: #fbf9f5;
  --bg-surface: #f3f0e8;
  --text-main: #1c1b18;
  --accent: #8d232a; /* Carmim editorial */
}

[data-theme="dark"] {
  /* Modo Escuro: grafite profundo */
  --bg-canvas: #151618;
  --bg-surface: #1d1f23;
  --text-main: #ebe9e4;
  --accent: #d9747a;
}
```

---

## Build de Produção

Para gerar os arquivos estáticos de produção:

```bash
hugo --minify
```

Os arquivos compilados (HTML, CSS minificado com fingerprint SRI, JS, RSS, sitemap e índice de busca) serão gerados no diretório `public/`.

### Validação Automatizada de Integridade

Para garantir que não haja links quebrados e que todos os índices estejam válidos:

```bash
python3 tests/validate_site.py
```

---

## Estrutura do Projeto

```
nosreme-blog/
├── archetypes/
│   ├── default.md              # Modelo padrão de documento
│   └── posts.md                # Archetype para novos artigos
├── assets/
│   ├── css/
│   │   └── main.css            # Estilos editoriais e tema claro/escuro
│   └── js/
│       └── main.js             # Alternador de tema, busca local e utilitários
├── content/
│   ├── categories/             # Metadados e descrições das categorias
│   ├── posts/                  # Artigos e ensaios em Markdown
│   ├── arquivo.md              # Página do índice cronológico (/arquivo/)
│   ├── pesquisa.md             # Página de pesquisa (/pesquisa/)
│   └── sobre.md                # Página institucional editorial (/sobre/)
├── layouts/
│   ├── _default/
│   │   ├── _markup/
│   │   │   └── render-heading.html # Render hook para âncoras em títulos
│   │   ├── archive.html        # Template do arquivo cronológico
│   │   ├── baseof.html         # Shell HTML base do site
│   │   ├── list.html           # Template para listagens gerais
│   │   ├── search.html         # Template da página de pesquisa
│   │   └── single.html         # Layout de leitura do artigo individual
│   ├── page/
│   │   └── single.html         # Layout para páginas estáticas (ex: /sobre/)
│   ├── partials/
│   │   ├── footer.html         # Rodapé editorial e inclusão de scripts
│   │   ├── head.html           # Meta tags SEO, Open Graph e CSS pipeline
│   │   ├── header.html         # Marca "nosreme.", menu e alternador de tema
│   │   ├── post-meta.html      # Formatação de datas e leitura estimada
│   │   └── toc.html            # Sumário expansível
│   ├── taxonomy/
│   │   ├── taxonomy.html       # Lista de artigos por categoria/tag
│   │   └── terms.html          # Índice geral de categorias
│   ├── 404.html                # Página 404 personalizada
│   ├── index.html              # Página inicial (apresentação e destaque)
│   ├── index.json              # Geração do índice de busca client-side
│   └── robots.txt              # Template dinâmico para robots.txt
├── static/
│   └── favicon.svg             # Ícone vetorial adaptável aos temas
├── tests/
│   └── validate_site.py        # Suíte leve de testes de integridade estática
├── hugo.toml                   # Configuração global do site
└── README.md                   # Documentação do projeto
```

---

## Preparação para Publicação Estática (Caddy)

Como o blog gera arquivos 100% estáticos na pasta `public/`, a publicação na VPS requer apenas um servidor web eficiente como o **Caddy**.

Exemplo de bloco no `Caddyfile`:

```caddyfile
blog.nosreme.cloud {
    root * /var/www/blog.nosreme.cloud/public
    file_server

    # Compressão zstd e gzip automática
    encode zstd gzip

    # Cabeçalhos de segurança e cache para assets versionados
    header {
        X-Content-Type-Options nosniff
        X-Frame-Options DENY
        Referrer-Policy strict-origin-when-cross-origin
    }

    # Cache longo para arquivos com fingerprint do Hugo
    @static {
        path /css/* /js/* /favicon.svg
    }
    header @static Cache-Control "public, max-age=31536000, immutable"

    # Página 404 personalizada
    handle_errors {
        rewrite * /{err.status_code}.html
        file_server
    }
}
```
