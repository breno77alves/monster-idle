# ARCHITECTURE.md — Monster Idle

## Princípios Fundamentais

1. **Simulação independente do React** — todo cálculo de jogo fica em `src/simulation/`. Nenhum arquivo dessa pasta pode importar React, hooks ou componentes.

2. **Dados separados do estado** — espécies, habilidades, regiões e itens vivem em `src/game-data/` como TypeScript puro (objetos exportados). O estado do jogador fica no save/Zustand.

3. **Species ≠ Instance** — `MonsterSpecies` é o template; `OwnedMonster` é a instância. Nunca duplicar dados da espécie dentro da instância.

4. **Save versionado desde o início** — toda mudança de schema exige migration. Nunca resetar silenciosamente.

5. **Validação na fronteira** — dados carregados do disco ou de arquivos externos são sempre validados com Zod antes de entrar no estado.

---

## Interfaces de Domínio

```ts
// Tipos elementais
type MonsterType = 'chama' | 'natureza' | 'aquatico';

// Função no combate
type MonsterRole = 'tank' | 'damage' | 'support';

// Template da espécie — imutável, vive em game-data/
interface MonsterSpecies {
  id: string;
  name: string;
  description: string;
  types: MonsterType[];
  role: MonsterRole;
  baseStats: {
    health: number;
    attack: number;
    defense: number;
    speed: number;
  };
  abilityIds: string[];
  passiveId?: string;
  portraitPath: string;
}

// Instância do jogador — mutável, vive no save
interface OwnedMonster {
  instanceId: string;   // UUID único por instância
  speciesId: string;    // referência à MonsterSpecies
  nickname?: string;
  level: number;
  experience: number;
  unlockedAbilityIds: string[];
  equippedAccessoryIds: string[];
  obtainedAt: string;   // ISO 8601
}

// Time do jogador
interface MonsterTeam {
  id: string;
  name: string;
  monsterInstanceIds: string[];  // máx. 3
}

// Habilidade
interface MonsterAbility {
  id: string;
  name: string;
  description: string;
  power: number;        // multiplicador de dano
  type: MonsterType;
  unlockLevel: number;
  effect?: AbilityEffect;
}

// Atividade idle
interface ActivityDefinition {
  id: string;
  name: string;
  durationMs: number;
  rewardTableId: string;
  requiredTrainerLevel: number;
  compatibleTypes?: MonsterType[];
  experienceReward: number;
}

// Região / Expedição
interface RegionDefinition {
  id: string;
  name: string;
  description: string;
  requiredTrainerLevel: number;
  enemyIds: string[];
  bossId: string;
  rewardTableId: string;
}
```

---

## Camadas da Aplicação

```
┌─────────────────────────────────────────────────────┐
│                   React / UI Layer                   │
│         features/, components/, app/                 │
│   Consome estado; não contém lógica de gameplay     │
└──────────────────────┬──────────────────────────────┘
                       │ lê / escreve
┌──────────────────────▼──────────────────────────────┐
│              Zustand Store (game-store.ts)           │
│         Estado em memória; sincronizado com save    │
└──────────────────────┬──────────────────────────────┘
                       │ chama
┌──────────────────────▼──────────────────────────────┐
│            Simulation Layer (simulation/)            │
│   battle/, experience/, offline-progress/,          │
│   rewards/, timers/                                 │
│   Input: dados puros → Output: dados puros          │
│   PROIBIDO importar React                           │
└──────────────────────┬──────────────────────────────┘
                       │ lê
┌──────────────────────▼──────────────────────────────┐
│             Game Data (game-data/)                  │
│   monsters/, abilities/, regions/, enemies/,        │
│   items/, rewards/                                  │
│   Objetos TypeScript exportados — imutáveis         │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│              Save Layer (save/)                     │
│   database.ts (Dexie), migrations.ts,               │
│   save-service.ts                                   │
│   Validação Zod obrigatória ao carregar             │
└─────────────────────────────────────────────────────┘
```

---

## Motor de Combate

Localização: `src/simulation/battle/`

### Interface pública

```ts
interface BattleInput {
  playerTeam: CombatUnit[];
  enemyTeam: CombatUnit[];
  seed: number;
}

interface BattleResult {
  winner: 'player' | 'enemy' | 'draw';
  rounds: BattleRound[];
  log: string[];
  rewards?: RewardResult;
}

function simulateBattle(input: BattleInput): BattleResult
```

### Regras obrigatórias

- Monstros ordenados por `speed` decrescente a cada rodada
- Dano: `Math.max(1, attack × power − defense × 0.5)`
- Monstro com HP ≤ 0 é removido imediatamente
- Após remoção, a ordem da rodada prossegue normalmente
- Limite fixo de **100 rodadas** (retorna `draw` se excedido)
- Mesmo `seed` → mesmo `BattleResult` sempre
- Recompensas geradas apenas quando `winner === 'player'`

---

## Progressão Offline

Localização: `src/simulation/offline-progress/`

```ts
interface OfflineProgressInput {
  lastSavedAt: string;       // ISO 8601
  now: string;               // ISO 8601
  activeActivities: ActiveActivity[];
  maxOfflineMs: number;      // padrão: 8 * 60 * 60 * 1000
}

interface OfflineProgressResult {
  elapsedMs: number;
  cappedMs: number;          // min(elapsed, maxOffline)
  rewards: RewardResult[];
  summary: string[];
}

function calculateOfflineProgress(input: OfflineProgressInput): OfflineProgressResult
```

Nunca executar loop ciclo-a-ciclo: calcular resultado agregado matematicamente.

---

## Persistência (Dexie / IndexedDB)

### Schema v1

```ts
db.version(1).stores({
  player:       '++id',          // único registro
  ownedMonsters: 'instanceId',
  teams:        'id',
  eggs:         'id',
  activityLog:  '++id, activityId, startedAt',
});
```

### Regras de migração

- Toda alteração de schema incrementa a versão
- Migrations documentadas em `save/migrations.ts`
- Nunca deletar campo sem migration explícita
- Ao carregar: validar com Zod; em erro → mostrar mensagem ao usuário, **não** resetar silenciosamente

---

## Roteamento

Rotas React sem backend:

```
/             → Home (resumo + ganhos offline)
/collection   → Coleção de monstros
/team         → Montagem do time
/activities   → Atividades idle
/expeditions  → Regiões e expedições
/eggs         → Ovos e incubação
/battle/:id   → Tela de batalha (resultado de expedição)
```

---

## Testes

### Unitários (Vitest)

- Todo sistema matemático tem testes antes da interface
- Localização: `src/tests/` ou arquivos `*.test.ts` ao lado do código
- Cobertura obrigatória: simulação de batalha, cálculo de XP, progressão offline, drop tables, bônus de atividade

### E2E (Playwright)

- Fluxo completo de batalha
- Navegação entre todas as telas
- Persistência: salvar → recarregar página → estado preservado
- Layout responsivo: desktop (1280×800) e mobile (390×844)

---

## Convenções de Código

- `instanceId`: UUID v4 para OwnedMonster
- `speciesId`: string kebab-case (`"embercub"`, `"mossling"`)
- Datas: sempre ISO 8601 string no save (não `Date` objects)
- Números no save: inteiros onde possível (XP, HP); floats apenas onde necessário (bônus)
- Sem `any` — usar `unknown` + Zod quando o tipo não for conhecido
- Imports de `game-data/` são somente-leitura; nunca mutar os objetos

---

## Proibições Explícitas

| O quê                                    | Motivo                                      |
|------------------------------------------|---------------------------------------------|
| React em `simulation/`                   | Simulação deve ser testável sem DOM         |
| Lógica de gameplay em componentes React  | Separa responsabilidades                    |
| Mutação direta de objetos de `game-data` | Dados são imutáveis por design              |
| Reset silencioso de save                 | Perda de dados é inaceitável                |
| Duas fórmulas de dano diferentes         | Uma única fonte de verdade                  |
| Backend, auth, cloud                     | Projeto é offline-first single-player       |
| Novos pacotes sem justificativa em PLAN  | Controle de dependências                    |
