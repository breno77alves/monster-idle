# Monster Idle — AGENTS.md

RPG idle single-player de coleção de monstros. Offline-first. Sem backend.

---

## Leia Primeiro

Antes de qualquer tarefa, leia nesta ordem:

1. `GAME_DESIGN.md` — o que é o jogo, o loop, o MVP
2. `PLAN.md` — o que está no escopo de cada milestone
3. `ARCHITECTURE.md` — decisões técnicas, interfaces, proibições

---

## Stack

| Pacote              | Uso                              |
|---------------------|----------------------------------|
| React + TypeScript  | Interface                        |
| Vite                | Build e dev server               |
| Zustand             | Estado global                    |
| Dexie / IndexedDB   | Persistência local               |
| Zod                 | Validação de dados               |
| Vitest              | Testes unitários                 |
| Playwright          | Testes E2E                       |

---

## Regras do Projeto

### Escopo
- Não implementar multiplayer, backend, autenticação ou cloud services.
- Não implementar breeding, PvP, shiny, marketplace, IVs/EVs, monetização.
- Não adicionar dependência de produção sem documentar o motivo em `PLAN.md`.
- Não aumentar escopo sem atualizar `PLAN.md` e confirmar com o usuário.

### Arquitetura
- `simulation/` não pode importar React. Zero dependência de DOM.
- Lógica de gameplay nunca fica dentro de componentes React.
- Dados de espécie (`MonsterSpecies`) ficam em `game-data/` — imutáveis.
- Dados de instância (`OwnedMonster`) ficam no save do jogador — no Dexie.
- Separar sempre `speciesId` (referência) de `instanceId` (UUID único).

### Save e Persistência
- Toda mudança de schema do Dexie exige migration em `save/migrations.ts`.
- Nunca resetar ou deletar o save do jogador silenciosamente.
- Validar save com Zod ao carregar; em erro, mostrar mensagem clara ao usuário.

### Qualidade
- Sistemas matemáticos (combate, XP, offline, drop tables) têm testes antes da interface.
- Sem `any` no TypeScript. Usar `unknown` + Zod quando tipo não for conhecido.
- Sem duplicação de fórmulas — uma única fonte de verdade por cálculo.
- Não usar nomes, assets ou terminologia de propriedade intelectual alheia.

---

## Verificação Obrigatória Após Cada Tarefa

Execute nesta sequência. A tarefa só está concluída se todos passarem:

```bash
npm run typecheck     # tsc --noEmit
npm run lint          # eslint src/
npm run test          # vitest run
npm run build         # vite build
```

Para mudanças visuais, adicionar:

```bash
npx playwright test   # testar desktop (1280×800) e mobile (390×844)
```

Revisar o diff antes de marcar como concluído. Mudanças não relacionadas à tarefa devem ser revertidas.

---

## Comandos do Projeto

```bash
npm run dev           # servidor de desenvolvimento
npm run build         # build de produção
npm run preview       # visualizar build local
npm run typecheck     # checagem de tipos
npm run lint          # lint
npm run test          # testes unitários
npm run test:watch    # testes em modo watch
npx playwright test   # testes E2E
npx playwright test --ui  # testes E2E com interface visual
```

---

## Superpowers

Este projeto usa o framework [Superpowers](https://github.com/obra/superpowers).

Para instalar no Codex CLI:
```
/plugins → buscar "superpowers" → Install Plugin
```

Para instalar no Claude Code:
```
/plugin install superpowers@claude-plugins-official
```

O Superpowers ativa automaticamente os seguintes workflows:

- **brainstorming** → refinamento de design antes de escrever código
- **writing-plans** → plano detalhado por tarefa antes de implementar
- **test-driven-development** → RED → GREEN → REFACTOR obrigatório
- **subagent-driven-development** → cada tarefa revisada em duas etapas
- **requesting-code-review** → checklist antes de marcar tarefa como pronta
- **finishing-a-development-branch** → merge/PR apenas após testes passarem

Não pule esses workflows. Eles existem para evitar retrabalho.

---

## Convenções

- IDs de espécie: `kebab-case` → `"embercub"`, `"mossling"`, `"aquafin"`
- IDs de instância: UUID v4 → `"a1b2c3d4-..."`
- Datas no save: sempre ISO 8601 string — nunca objetos `Date`
- Tipos elementais: `"chama" | "natureza" | "aquatico"`
- Roles: `"tank" | "damage" | "support"`

---

## O que NÃO Fazer (erros recorrentes a evitar)

- Colocar `import { useState }` dentro de `simulation/`
- Calcular dano em dois lugares diferentes com fórmulas levemente diferentes
- Salvar `Date` objects no IndexedDB — use string ISO 8601
- Iterar ciclo-a-ciclo no cálculo offline — calcule de forma agregada
- Mutar diretamente um objeto de `game-data/`
- Adicionar `any` para resolver erro de tipo — use Zod ou refine o tipo
- Resetar o save sem aviso explícito ao usuário
