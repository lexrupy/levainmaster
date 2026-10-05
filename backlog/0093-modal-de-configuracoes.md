# 0093 — Modal de configurações a partir do Sobre

- **Autor:** Alexandre da Silva
- **Data:** 2026-10-05
- **Status:** concluída
- **Arquivos:** `index.html`, `app.js`, `app.css`, `ServiceWorker.js`, `tests/service-worker.test.js`, `tests/ui/run.mjs`, `AGENTS.md`

## Contexto

Com a adição da calibração do levain e das opções de cálculo da hidratação, o modal Sobre ficou sobrecarregado, misturando informações institucionais/versão do app com controles de configuração técnica e calibração de fermento.

## O que foi feito

1. **Novo modal de Configurações (`index.html`, `app.js`):** Criado o diálogo `<dialog ref="configDialog">` reunindo a configuração de cálculo do levain (inclusão de água e farinha da isca) e a lista/gerenciamento de calibrações de fermento.
2. **Modal Sobre enxuto:** O Sobre voltou a ser focado e leve, contendo apenas dados da versão, disponibilidade offline, persistência de dados, botão "Configurações" para abrir o novo modal, botão de checar atualizações/instalar e créditos. Na seção de calibração do modal Configurações foi adicionada uma explicação sucinta (*«Mede o ritmo real da sua farinha e fermento para prever a hora do pico com precisão»*) e o link direto com o rótulo *«O que é e como fazer o teste»*.
3. **Atualização de instruções e textos (`index.html`, `app.js`):** Ajustados os textos orientativos do guia dos dois potes e a nota explicativa da temperatura para indicar que as calibrações e o registro ficam em Configurações (acessível pelo Sobre).
4. **Estilo e responsividade (`app.css`):** Adicionada estilização para o bloco do botão de configurações no Sobre (`.about-config-box`, `.about-config-btn`).
5. **Testes e Cache:** Os cenários de teste de interface (`tests/ui/run.mjs`) foram atualizados para navegar pelo botão de configurações e validar o link do guia em Configurações. O cache do service worker foi incrementado para `padeiro-v100`.

## Critérios de aceite

- [x] O modal Sobre não exibe mais a lista extensa de calibração nem o bloco de opções de cálculo diretamente na sua raiz.
- [x] O modal Sobre possui o botão "Configurações", mantendo a tela leve.
- [x] O modal Configurações reúne o cálculo do levain, as calibrações e o link para o teste dos dois potes.
- [x] Tocar em "Configurações" abre o diálogo de Configurações.
- [x] As orientações do guia do teste dos dois potes indicam o caminho via Configurações.
- [x] Todos os testes unitários (`npm test`) e de interface (`npm run test:ui`) passam.

## Como verificar

1. Toque no ícone/marca no topo para abrir o Sobre.
2. Verifique que a tela está limpa, contendo o botão "Configurações".
3. Toque no botão "Configurações": confirme que ele abre o modal com as opções de cálculo do levain, a lista de calibrações e o link "Como fazer o teste dos dois potes".
4. Toque no link e confirme que o guia abre corretamente.
5. Rode `npm test` e `npm run test:ui`.
