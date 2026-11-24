# Product

<!-- impeccable:product-schema 1 -->

> Registro inferido do brief do dono, sem entrevista (não havia canal de resposta nesta sessão). Cada fato abaixo vem do brief ou do `PRODUCT.md` da Strig; o que não veio está marcado como em aberto.

## Platform

web

## Stack

Waku (React Server Components, build estático), TypeScript strict, MDX pelo `fumadocs-mdx`, `fumadocs-core` para árvore de páginas, TOC e busca. Nenhum `fumadocs-ui`: toda a interface sai do design system do próprio site. CSS puro com custom properties.

## Users

- **Quem integra a Strig**: escreve o catálogo, os papéis e os grants numa das três sintaxes da DSL (Blocks, Rules, Actors), chama a lib em Rust ou o binding Node/wasm e precisa entender por que uma decisão saiu permitida ou negada. Lê a doc para executar uma tarefa: achar um conceito, copiar um trecho, conferir uma assinatura.
- **Quem audita ou avalia a adoção**: confere o modelo de decisão, as garantias (negar vence, sem estado oculto) e o formato de auditoria antes de confiar na lib.

## Product Purpose

Documentar a Strig, uma lib Rust genérica e pública de autorização com DSL de política em três sintaxes, binding Node/wasm e playground. O site tem sucesso quando a pessoa chega a uma resposta ("como modelo isto?", "por que negou?") sem ler código-fonte.

## Positioning

A Strig decide sem olhar quem pergunta: a marca é a Corte, uma lua cheia com uma mordida. O site herda isso: sóbrio, legível, com o selo de permitir/negar como marca da decisão. O que o site mostra é o que o motor decide, sem regra reinterpretada na doc.

## Operating Context

Leitura pontual e dirigida, em desktop e celular, em claro ou escuro conforme o sistema. Muito código ao lado da prosa: três sintaxes de política, Rust, TypeScript e JSON.

## Capabilities and Constraints

- Esta entrega é a **base**: projeto, design system e esqueleto de páginas, com conteúdo de amostra estrutural. Conteúdo real, repositório na organização, CI, deploy e domínio ficam para depois.
- O site é público. Nenhum cliente, empresa ou produto de terceiros aparece, nem é citado pelo nome. Nada que identifique a máquina de quem construiu (caminho local, usuário, planos).
- Fontes só com licença aberta (OFL), servidas pelo próprio site, com a licença junto. Sem CDN em tempo de execução.
- Vocabulário: sujeito, permissão, recurso, grant, papel, relação, âncora, escopo, estratégia, veredito, trilha.
- Idioma do texto de amostra: inglês (idioma da lib e do playground). Idioma final do conteúdo: em aberto.

## Brand Commitments

Identidade em `brand/` (folha de marca, SVG, Cinzel só no wordmark): carmim `#B01030` no claro e `#FF5E70` no escuro, apoio `#996C6C`, fundo `#FFFFFF`/`#0A0A0A`. Símbolo Corte, sem sangue pingando. Mark e wordmark são vetores; o texto do site é Inter.

## Evidence on Hand

- Folha de marca, SVG do símbolo, wordmark e lockups em `brand/`.
- Playground com realce das três sintaxes (`playground/highlight.js`).
- Não há conteúdo de doc migrado, depoimentos, números de adoção nem logos de clientes: nada disso pode ser inventado.

## Product Principles

1. A decisão vem primeiro; o rastro a explica, nunca a esconde.
2. Permitir e negar se distinguem pela palavra e pela forma antes da cor.
3. O código é o conteúdo: legibilidade do bloco de código vence decoração.
4. A personalidade mora nos detalhes (selo, símbolo Corte, wordmark), não em efeitos.
5. Tudo sai de tokens: uma fonte para cor, tipo, espaço e movimento, nos dois temas.

## Accessibility & Inclusion

WCAG 2.2 AA: contraste medido (as razões da identidade), foco visível em carmim, alvo de toque de 44 px, navegação por teclado completa (busca, sidebar, tabs), `prefers-reduced-motion` respeitado, sem informação só por cor.
