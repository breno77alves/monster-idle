# SETUP.md — Como Preparar o Ambiente

Siga este guia do zero ao primeiro commit funcional.

---

## 1. Pré-requisitos

Certifique-se de ter instalado:

- **Node.js** ≥ 18 (recomendado: 20 LTS)
- **Git**
- **GitHub CLI** (`gh`) — opcional, mas facilita criar o repo
- **Codex CLI** ou **Claude Code** instalado

Verificar:
```bash
node -v
git --version
gh --version   # opcional
```

---

## 2. Criar o Repositório no GitHub

### Via GitHub CLI (recomendado)

```bash
# Criar repo público no GitHub e clonar localmente
gh repo create monster-idle --public --description "RPG idle de coleção de monstros" --clone
cd monster-idle
```

### Via interface web

1. Acesse https://github.com/new
2. Nome: `monster-idle`
3. Descrição: `RPG idle de coleção de monstros — offline-first, single-player`
4. Visibilidade: Public (ou Private, sua escolha)
5. Marque "Add a README file"
6. Clique em "Create repository"
7. Clone localmente:
   ```bash
   git clone https://github.com/SEU_USUARIO/monster-idle.git
   cd monster-idle
   ```

---

## 3. Criar o Projeto Vite

Dentro da pasta `monster-idle` (pode estar vazia ou ter só o README):

```bash
# Se a pasta já existe com README, crie o projeto nela mesma
npm create vite@latest . -- --template react-ts
# Quando perguntar sobre arquivos existentes, escolha "Ignore files and continue"

# Se preferir criar em nova pasta e mover depois:
# npm create vite@latest monster-idle -- --template react-ts
```

---

## 4. Instalar Dependências

```bash
# Dependências de produção
npm install zustand zod dexie

# Dependências de desenvolvimento
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D @playwright/test
npm install -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser

# Instalar browsers do Playwright
npx playwright install chromium
```

---

## 5. Copiar os Arquivos de Documentação

Coloque os seguintes arquivos na raiz do projeto:

```
monster-idle/
  AGENTS.md         ← instruções para o Codex
  GAME_DESIGN.md    ← design do jogo
  PLAN.md           ← milestones e tarefas
  ARCHITECTURE.md   ← decisões técnicas
  SETUP.md          ← este arquivo
```

---

## 6. Instalar o Superpowers

### No Codex CLI

```bash
# Dentro da pasta do projeto, abra o Codex CLI e execute:
/plugins
# Busque "superpowers" e instale
```

### No Claude Code

```
/plugin install superpowers@claude-plugins-official
```

### Verificar instalação

O Superpowers está ativo quando, ao iniciar uma sessão, o agente:
1. Pergunta o que você está tentando construir
2. Propõe um design antes de escrever código
3. Cria um plano de tarefas antes de implementar

---

## 7. Inicializar o Codex no Projeto

```bash
# Dentro da pasta do projeto, no Codex CLI:
/init
```

Isso gera um `AGENTS.md` base. **Substitua o conteúdo gerado** pelo arquivo `AGENTS.md` deste projeto (ou mescle as regras).

---

## 8. Primeiro Commit

```bash
git add .
git commit -m "chore: initial project setup

- Vite + React + TypeScript scaffolding
- Dependencies: zustand, zod, dexie
- Dev dependencies: vitest, playwright, eslint
- Project documentation: GAME_DESIGN, PLAN, ARCHITECTURE, AGENTS"

git push origin main
```

---

## 9. Verificar que Tudo Funciona

```bash
npm run dev        # deve abrir http://localhost:5173
npm run build      # deve criar pasta dist/ sem erros
npm run typecheck  # zero erros de tipo (pode ter erros do template inicial, ok)
```

---

## 10. Primeiro Prompt para o Codex

Com o projeto configurado e o Superpowers instalado, inicie uma sessão e use este prompt:

```
Quero desenvolver um RPG idle single-player de coleção de monstros.

Leia os seguintes arquivos antes de qualquer coisa:
- GAME_DESIGN.md
- PLAN.md
- ARCHITECTURE.md
- AGENTS.md

Depois, implemente apenas o Milestone 1 do PLAN.md:
estrutura de diretórios, configuração de tooling (Vitest, Playwright, ESLint),
roteamento entre as 6 telas principais, e interface placeholder sem gameplay.

Não implemente lógica de jogo ainda.
Execute todos os testes e revise o diff antes de concluir.
```

---

## Estrutura Esperada Após o Milestone 1

```
monster-idle/
  src/
    app/
      App.tsx
      routes.ts
    components/        (vazio por enquanto)
    features/
      collection/
      combat/
      eggs/
      expeditions/
      team/
      trainer/
    game-data/         (vazio por enquanto)
    simulation/        (vazio por enquanto)
    save/              (vazio por enquanto)
    state/
      game-store.ts    (store vazio)
    tests/
  AGENTS.md
  GAME_DESIGN.md
  PLAN.md
  ARCHITECTURE.md
  SETUP.md
  vite.config.ts
  vitest.config.ts
  playwright.config.ts
  tsconfig.json
  package.json
```

---

## Dicas para Trabalhar com o Codex

- **Uma tarefa por prompt**: nunca peça vários milestones ao mesmo tempo
- **Revise o diff**: o Codex pode tocar em arquivos não relacionados
- **Testes primeiro**: se pedir combate, peça o motor sem interface primeiro
- **Leia o PLAN.md antes de cada sessão**: manter o escopo é responsabilidade sua
- **Commits frequentes**: commit a cada milestone ou tarefa concluída

---

## Problemas Comuns

### `npm run build` falha com erros de tipo
```bash
# Verificar erros específicos
npm run typecheck
```

### Playwright não encontra o navegador
```bash
npx playwright install chromium
```

### Dexie não inicializa no teste
Dexie precisa de IndexedDB. Use `fake-indexeddb` nos testes unitários:
```bash
npm install -D fake-indexeddb
```

### O Superpowers não ativou
Verifique se o `AGENTS.md` está na raiz do projeto e se o plugin está instalado na versão correta do Codex.
