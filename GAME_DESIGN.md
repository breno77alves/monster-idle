# GAME_DESIGN.md — Monster Idle

## Conceito Central

Um RPG idle single-player de coleção de monstros com identidade própria.
O jogador é um **Treinador** que coleta, choca e treina criaturas originais.
Um time de até 3 monstros combate automaticamente e também potencializa atividades idle.
A progressão avança pela obtenção de novos monstros, não pela evolução de um personagem fixo.

---

## Loop Principal

```
Atividade idle
    ↓
Recursos + Ovos
    ↓
Chocar Ovos → Novo Monstro
    ↓
Montar / Ajustar Time
    ↓
Enviar para Expedição
    ↓
Batalha Automática → Experiência + Loot
    ↓
Level Up dos Monstros
    ↓
Desbloquear Regiões mais difíceis
```

---

## Monstros

### Separação de dados

| Conceito        | O que representa                                   | Onde fica           |
|-----------------|----------------------------------------------------|---------------------|
| MonsterSpecies  | Template compartilhado por todos da espécie        | `src/game-data/`    |
| OwnedMonster    | Instância individual na coleção do jogador         | save do jogador     |

### Tipos Elementais (MVP: 3)

| Tipo     | Cor de referência | Bônus idle              |
|----------|-------------------|-------------------------|
| Chama    | Vermelho-laranja  | Mineração / Forja       |
| Natureza | Verde             | Coleta / Jardinagem     |
| Aquático | Azul              | Pesca / Destilação      |

### Stats base por monstro

- `health` — vida total na batalha
- `attack` — dano base
- `defense` — redução de dano recebido
- `speed` — ordem de ação no turno

### Funções (roles)

- **tank** — alta defesa/vida; protege o time
- **damage** — alto ataque; elimina inimigos rápido
- **support** — passivas de buff; melhora o time ou a atividade

### Habilidades

Cada espécie tem exatamente 2 habilidades ativas + 1 passiva opcional.
Habilidades desbloqueiam conforme o monstro sobe de nível.

---

## Time

- Máximo de **3 monstros simultâneos**
- O tipo dos monstros no time define bônus sobre atividades idle em andamento
- O jogador pode salvar times nomeados e trocar entre eles

### Bônus de tipo no time (MVP)

```
produção_final = base × (1 + nivel_monstro × 0.01 + bonus_tipo + bonus_passiva)
```

Exemplo:
- "Coleta de Frutas" + monstro Natureza nível 10: +10% (nível) + 20% (tipo) = +30%

---

## Atividades Idle (MVP: 1)

### Coleta

- Duração por ciclo: configurável por dados (`durationMs`)
- Recompensa: recurso(s) definido(s) na `rewardTable`
- Requisito: nível de treinador ≥ X
- Monstros compatíveis: tipos que concedem bônus
- Progressão offline: calculada de forma agregada, não ciclo-a-ciclo

### Limite offline

- Máximo inicial: **8 horas**
- Cálculo: `ciclos = Math.floor(elapsed / durationMs)` × recompensa por ciclo
- Ao retornar, o jogador vê um resumo do que ganhou

---

## Combate

### Sistema: Turno Automático por Velocidade

1. Todos os combatentes são ordenados por `speed` (decrescente)
2. Cada monstro usa uma habilidade (seleção automática ou por prioridade)
3. Dano calculado, efeitos aplicados
4. Monstros derrotados são removidos imediatamente
5. Próxima rodada começa; repete até um time ser eliminado
6. Limite de segurança: máximo de **100 rodadas** (evita loops infinitos)

### Fórmula de dano base

```ts
damage = Math.max(1, attacker.attack * ability.power - defender.defense * 0.5)
```

### Requisitos do motor de combate

- Seed determinística → mesmo input = mesmo resultado (testável)
- Resultado sempre termina (sem loops infinitos)
- Nenhum valor negativo ou NaN
- Monstros eliminados não agem
- Recompensas entregues apenas uma vez por batalha

---

## Expedições

- O time é enviado para uma região com inimigos definidos
- Batalhas ocorrem automaticamente em sequência
- Ao fim: experiência, materiais, chance de ovo
- Chefe da região: batalha especial com recompensa garantida

### MVP: 1 região

- 5 inimigos comuns + 1 chefe
- Recompensas escalonadas por dificuldade

---

## Ovos e Incubação

- Ovos obtidos em expedições ou atividades idle
- Cada ovo tem tipo(s) e raridade possível definidos nos dados
- Incubação tem tempo base (ex: 10 minutos) reduzível por monstros de suporte
- Ao eclodir: novo OwnedMonster é adicionado à coleção

---

## Progressão do Treinador

- Nível de treinador sobe com atividades realizadas e batalhas vencidas
- Desbloqueia novas regiões, novos slots de atividade, incubadoras extras
- Não substitui o poder dos monstros; é um unlock gate

---

## MVP — Escopo do Primeiro Vertical Slice

### O que está DENTRO do MVP

- 6 espécies de monstros originais
- 3 tipos elementais
- 2 habilidades por monstro + 1 passiva opcional
- Time com até 3 slots
- 1 atividade idle (Coleta)
- 1 região com 5 inimigos + 1 chefe
- Sistema de ovos e incubação
- Progressão offline (máx. 8 h)
- Save local (IndexedDB / Dexie)
- Interface responsiva (desktop + mobile)
- Nível de monstro e de treinador

### O que está FORA do MVP (adicionar depois)

- Breeding / genética
- PvP / multiplayer
- Guildas ou trocas
- IVs / EVs
- Shinies
- Evoluções ramificadas
- Equipamentos por parte do corpo
- Marketplace
- Cloud save / login
- Backend de qualquer tipo
- Monetização

---

## Interface — Abas Principais

| Aba          | Conteúdo principal                                                    |
|--------------|-----------------------------------------------------------------------|
| **Home**     | Atividade atual, expedição ativa, ovos incubando, ganhos offline      |
| **Coleção**  | Monstros obtidos, filtros, nível, habilidades, espécies não coletadas |
| **Time**     | 3 slots, poder estimado, tipos, roles, trocar monstros                |
| **Atividades** | Coleta e atividades futuras; monstros atribuídos; progresso        |
| **Expedições** | Regiões disponíveis, inimigos, recompensas, chance de ovo          |
| **Ovos**     | Incubadoras, timers, raridades, histórico                             |

---

## Critério de "Jogo Completo" (MVP)

O jogador consegue:

1. Escolher um monstro inicial
2. Realizar uma atividade idle e ganhar recursos
3. Montar um time de até 3 monstros
4. Iniciar uma expedição
5. Vencer batalhas automáticas
6. Obter um ovo como recompensa
7. Chocar o ovo e ganhar um novo monstro
8. Ajustar o time com o novo monstro
9. Derrotar o chefe da primeira região

Quando isso funciona do início ao fim com placeholders, o MVP está entregue.
