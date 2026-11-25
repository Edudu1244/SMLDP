# SMLDP — Simulador de Mudança de País

Aplicação web full-stack que ajuda o usuário a planejar uma mudança para outro país: simula custo de vida e qualidade de vida com dados reais do banco, compara países lado a lado, recomenda o "país ideal" com base nas preferências do usuário e acompanha o progresso da mudança (checklist, conquistas, meta financeira) num painel de perfil pessoal.

## Funcionalidades

- **Autenticação** — cadastro e login com senha criptografada (bcrypt) e sessão via JWT.
- **Simulador** — calcula um índice de recomendação por país (custo de vida, qualidade de vida, dificuldade de migração) e salva o histórico real de cada simulação no banco.
- **Comparação de países** — compara dois países lado a lado por diversos indicadores e aponta um vencedor.
- **País Ideal** — questionário com pesos ajustáveis (custo, clima, segurança, idioma, trabalho, educação, saúde, facilidade de imigração) que recomenda o país mais compatível em tempo real.
- **Perfil / Dashboard** — dados pessoais editáveis, favoritos, progresso da mudança com conquistas gamificadas, meta financeira (com conversão de moeda) e gráficos (Chart.js) alimentados por dados reais do usuário.
- **Tema claro/escuro** persistente em todas as páginas.

## Stack

**Backend:** Node.js, Express, SQLite3, JWT (`jsonwebtoken`), `bcrypt`, `multer` (upload de foto de perfil), `cors`.

**Frontend:** HTML, CSS e JavaScript puros (sem framework/build step), Chart.js para os gráficos, Font Awesome para os ícones.

## Como rodar localmente

### 1. Backend

```bash
cd backend
npm install
node server.js
```

O servidor sobe em `http://localhost:3000` e cria/atualiza o banco SQLite (`backend/database/database.db`) automaticamente na primeira execução.

### 2. Frontend

O frontend não precisa de build nem de servidor próprio — basta abrir os arquivos em `frontend/` diretamente no navegador (comece por `frontend/inicial.html`), com o backend já rodando na porta 3000.

## Estrutura do projeto

```
backend/
  config/         # conexão com o banco SQLite
  controllers/    # lógica de autenticação e simulação
  middleware/     # verificação de token JWT
  models/         # modelos de usuário e simulação
  routes/         # rotas HTTP (auth e API)
  server.js       # ponto de entrada, define as rotas e cria as tabelas

frontend/
  inicial.html    # landing page
  login.html / cadastro.html / redefinir-senha.html
  simulacao.html  # simulador
  comparacao.html # comparação de países
  ideal.html      # país ideal
  perfil.html     # dashboard do usuário
  theme.css/js    # design system e tema compartilhados entre páginas
```

## Licença

Projeto acadêmico (TCC) sem fins comerciais.
