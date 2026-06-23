# PLAN.md — Monster Idle

## Filosofia do Plano

- **YAGNI**: não implementar o que não está no milestone atual
- **TDD primeiro**: cada sistema matemático tem testes antes da interface
- **Separação rígida**: simulação nunca depende do React
- **Dados externos ao código**: monstros, habilidades, regiões ficam em `game-data/`
- **Save versionado desde o início**: toda mudança de schema exige migration

---

## Stack (sem alterações sem justificativa no PLAN.md)

| Pacote            | Finalidade                              |
|-------------------|-----------------------------------------|
| React + TypeScript | Interface                              |
| Vite              | Build e dev server                      |
| Zustand           | Estado global em memória               |
| Dexie / IndexedDB | Persistência local                     |
| Zod               | Validação de dados externos e save      |
| Vitest            | Testes unitários da simulação           |
| Playwright        | Testes de interface e fluxos E2E        |

---

## Estrutura de Diretórios Alvo

```
src/
  app/
    App.tsx
    routes.ts

  components/
    ProgressBar/
    MonsterCard/
    ItemTooltip/
    Modal/

  features/
    collection/
    combat/
    eggs/
    expeditions/
    inventory/
    skills/
    team/
    trainer/

  game-data/
    abilities/
    enemies/
    items/
    monsters/        ← arquivos estáticos por espécie
    regions/
    rewards/

  simulation/        ← ZERO dependência de React
    battle/
    experience/
    offline-progress/
    rewards/
    timers/

  save/
    database.ts
    migrations.ts
    save-service.ts

  state/
    game-store.ts

  tests/
```

---

## Milestone 0 — Preparação do Repositório

**Objetivo**: repositório configurado, Superpowers instalado, documentos de projeto no lugar.

### Tarefas

- [ ] Criar repositório no GitHub (`monster-idle`) com README inicial
- [ ] Clonar e criar estrutura base com `npm create vite@latest`
- [ ] Instalar dependências de produção:
  ```
  npm install zustand zod dexie
  ```
- [ ] Instalar dependências de dev:
  ```
  npm install -D vitest @testing-library/react @testing-library/jest-dom
  npm install -D @playwright/test
  ```
- [ ] Instalar Superpowers no Codex CLI:
  ```
  /plugins → buscar "superpowers" → Install Plugin
  ```
- [ ] Commitar `GAME_DESIGN.md`, `PLAN.md`, `ARCHITECTURE.md`, `AGENTS.md`
- [ ] Rodar `/init` no Codex CLI para gerar base do AGENTS.md
- [ ] Ajustar AGENTS.md com as regras do projeto (ver seção abaixo)

### Verificação

- `npm run build` passa sem erros
- Repositório acessível no GitHub com todos os `.md` no root

---

## Milestone 1 — Estrutura do Projeto

**Objetivo**: scaffolding completo, navegação entre telas, tooling funcionando.

### Tarefas

- [x] Configurar estrutura de diretórios conforme `ARCHITECTURE.md`
- [x] Configurar roteamento (React Router ou similar) entre:
  - Home, Coleção, Time, Atividades, Expedições, Ovos
- [x] Configurar Zustand com store vazio inicial
- [x] Configurar Vitest com `vitest.config.ts`
- [x] Configurar Playwright com `playwright.config.ts`
- [x] Configurar ESLint + Prettier
- [x] Criar tela placeholder para cada aba
- [x] Testar navegação com Playwright

### NÃO fazer neste milestone

- Nenhuma lógica de jogo
- Nenhum dado real de monstro
- Nenhuma persistência

### Verificação

```
npm run typecheck  # zero erros
npm run lint       # zero warnings
npm run test       # todos os testes passam
npm run build      # build de produção funciona
npx playwright test  # navegação entre telas funciona
```

---

## Milestone 2 — Modelos e Dados

**Objetivo**: domínio de monstros definido, validado com Zod, 6 espécies placeholder.

### Tarefas

- [x] Definir e exportar interfaces TypeScript:
  - `MonsterSpecies`
  - `OwnedMonster`
  - `MonsterAbility`
  - `MonsterTeam`
  - `MonsterType`
  - `MonsterRole`
- [x] Criar schemas Zod para cada interface
- [x] Criar 6 espécies em `src/game-data/monsters/` (com stats placeholder)
- [x] Criar testes unitários para todos os schemas (casos válidos e inválidos)
- [x] Exibir lista de monstros na tela de Coleção (visual simples)

### NÃO fazer neste milestone

- Combate
- Persistência
- Ovos

### Verificação

```
npm run test       # schemas validam corretamente
npm run typecheck  # zero erros de tipo
```

---

## Milestone 3 — Motor de Combate (sem interface)

**Objetivo**: simulação de batalha em TypeScript puro, 100% testável, sem React.

### Decisões fechadas para a simulação

- Empates de `speed`, seleção de habilidade e seleção de alvo usam o RNG determinístico da batalha.
- A ordem de ação é calculada no início de cada rodada; alterações de `speed` valem a partir da rodada seguinte.
- Buffs e debuffs usam `amount` como proporção do atributo atual (`0.1` = 10%).
- Uma habilidade causa seu dano base e depois aplica seu efeito opcional.
- Recompensas de entrada são copiadas para o resultado uma única vez e somente quando o jogador vence.

### Adendo visual do protótipo

- O motor continua sem interface; o refinamento visual é uma camada transversal separada.
- Imagens de referência de terceiros podem ser usadas somente no ambiente local de desenvolvimento.
- Essas imagens ficam em `public/local-prototype/`, ignoradas pelo Git e substituídas automaticamente pelo placeholder original quando ausentes.
- Nenhum nome, imagem ou terminologia de terceiros pode entrar no build de produção ou no repositório.
- Direção visual: painel idle de alta densidade inspirado em interfaces do gênero, com identidade própria de caderno de guilda.

### Tarefas

- [x] Implementar `src/simulation/battle/`:
  - Ordenação por speed
  - Cálculo de dano: `Math.max(1, attack * power - defense * 0.5)`
  - Aplicação de habilidades (dano, buff, debuff)
  - Remoção de monstros derrotados
  - Detecção de vitória/derrota
  - Battle log (array de strings por rodada)
  - Limite de 100 rodadas
  - Seed determinística (LCG simples ou similar)
- [x] Testes unitários para:
  - Batalha normal (time A vence)
  - Batalha normal (time B vence)
  - Time com apenas 1 monstro
  - Monstro com 0 defesa
  - Monstro com speed máxima age primeiro
  - Habilidade de buff aplicada corretamente
  - Recompensas entregues exatamente uma vez
  - Mesmo seed = mesmo resultado
  - Batalha não ultrapassa 100 rodadas

### NÃO fazer neste milestone

- Tela de batalha
- Integração com Zustand
- Persistência

### Verificação

```
npm run test       # todos os casos passam
npm run typecheck  # zero erros
```

---

## Milestone 4 — Interface de Combate

**Objetivo**: tela que exibe e controla uma batalha usando o motor existente.

### Tarefas

- [x] Criar scripts Windows para iniciar a aplicação e encerrar com segurança apenas o servidor iniciado pelo projeto
- [x] Criar componente `BattleScreen` em `src/features/combat/`
- [x] Exibir: times, barras de vida, rodada atual, ação atual, battle log
- [x] Controle de velocidade da simulação (1×, 2×, Skip)
- [x] Exibir resultado (vitória/derrota + recompensas)
- [x] Nenhuma lógica de gameplay dentro de componentes React
- [x] Testes Playwright: fluxo completo de batalha (início → resultado)

### Verificação

```
npm run test
npx playwright test   # batalha completa, desktop e mobile
```

---

## Milestone 5 — Coleção e Time

**Objetivo**: o jogador pode ver seus monstros e montar um time.

### Tarefas

- [ ] Tela de Coleção: listar OwnedMonsters, filtros por tipo/role, abrir detalhes
- [ ] Tela de Time: 3 slots, arrastar/clicar para atribuir monstro
- [ ] Calcular e exibir poder estimado do time
- [ ] Zustand store: `collection`, `activeTeam`
- [ ] Testes: montar time, remover monstro, limite de 3

---

## Milestone 6 — Save Local

**Objetivo**: progresso persiste entre sessões.

### Tarefas

- [ ] Configurar Dexie (`src/save/database.ts`)
- [ ] Schema inicial versionado (`version: 1`)
- [ ] `save-service.ts`: carregar, salvar, exportar JSON
- [ ] Migration de schema ao mudar versão
- [ ] Validar save carregado com Zod antes de usar
- [ ] Nunca resetar save silenciosamente — erro visível ao usuário
- [ ] Testes: salvar → recarregar → estado idêntico

---

## Milestone 7 — Atividade Idle

**Objetivo**: monstro atribuído coleta recursos ao longo do tempo.

### Tarefas

- [ ] Definir `ActivityDefinition` em `game-data/`
- [ ] Implementar `src/simulation/timers/` e `rewards/`
- [ ] Calcular `productionBonus` com base em tipo e nível do monstro
- [ ] Tela de Atividades: iniciar, parar, ver progresso
- [ ] Testes: 1 ciclo completo, bônus de tipo, bônus de nível

---

## Milestone 8 — Progressão Offline

**Objetivo**: recursos acumulam enquanto o jogo está fechado.

### Tarefas

- [ ] Salvar `lastSavedAt` no save
- [ ] Ao carregar: `elapsed = now - lastSavedAt`
- [ ] `completedCycles = Math.floor(elapsed / durationMs)`, limitado a 8 h
- [ ] Calcular recompensas de forma agregada (não loop ciclo-a-ciclo)
- [ ] Exibir resumo de ganhos offline ao abrir o jogo
- [ ] Testes: 1 h offline, 8 h offline, 20 h offline (teto aplicado)

---

## Milestone 9 — Expedições

**Objetivo**: time enviado para região, batalha sequencial, recompensas ao fim.

### Tarefas

- [ ] Definir `RegionDefinition` e `EnemyDefinition` em `game-data/`
- [ ] Implementar fluxo: selecionar região → batalhas automáticas em sequência
- [ ] Ao terminar: experiência, materiais, chance de ovo
- [ ] Tela de Expedições: selecionar região, acompanhar progresso, ver resultado
- [ ] Testes: expedição completa, time eliminado antes do chefe

---

## Milestone 10 — Ovos e Incubação

**Objetivo**: ovos obtidos podem ser chocados para gerar novos monstros.

### Tarefas

- [ ] Definir `EggDefinition` e `IncubatorSlot`
- [ ] Ovos obtidos de expedições e atividades (drop table)
- [ ] Timer de incubação; monstro de suporte reduz tempo
- [ ] Ao eclodir: sortear espécie conforme `possibleSpecies` do ovo
- [ ] Tela de Ovos: slots, timers, histórico
- [ ] Testes: sorteio de espécie, redução de tempo, eclosão

---

## Milestone 11 — Chefe e Balanceamento

**Objetivo**: o jogador pode derrotar o chefe da primeira região — MVP completo.

### Tarefas

- [ ] Definir boss da região 1 com stats elevados e habilidade especial
- [ ] Recompensa garantida ao derrotar o chefe
- [ ] Ajustar stats de monstros e inimigos para progressão satisfatória
- [ ] Sessão de playtesting: loop completo do início ao chefe
- [ ] Documentar valores ajustados em `BALANCE.md`

---

## Marcos Futuros (pós-MVP)

- Arte definitiva e identidade visual
- PWA (instalável no celular)
- 3 regiões adicionais
- 12 novas espécies
- 2 novas atividades idle
- Sistema de evolução linear
- Breeding (se validado pelo playtesting)

---

## Regra de Adição de Dependências

Antes de instalar qualquer pacote novo:

1. Documentar aqui o motivo
2. Confirmar que não existe solução com o que já está instalado
3. Revisar impacto no bundle size

| Pacote           | Versão | Motivo                                |
|------------------|--------|---------------------------------------|
| zustand          | latest | Estado global simples sem boilerplate |
| zod              | latest | Validação de dados e schemas          |
| dexie            | latest | Abstração de IndexedDB tipada         |
| vitest           | latest | Testes unitários rápidos com Vite     |
| @playwright/test | latest | Testes E2E e de interface             |
| prettier         | latest | Formatação consistente do código      |
| @fontsource-variable/fraunces | latest | Fonte display OFL empacotada localmente para a identidade do protótipo |
| @fontsource-variable/manrope | latest | Fonte de interface OFL legível em painéis densos e offline |
