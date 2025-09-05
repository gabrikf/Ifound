# iFound - Medicine Management System

Sistema completo para gerenciamento de medicamentos domiciliares, composto por uma API robusta (back-end) e uma aplicação web moderna (front-end) que permite aos usuários catalogar, organizar e acompanhar medicamentos em suas residências.

## 🏗️ Arquitetura do Projeto

Este é um monorepo com duas aplicações principais:

- **`/api`** - API REST em Node.js + TypeScript (back-end)
- **`/web`** - Aplicação React + TypeScript (front-end)

## 🚀 Funcionalidades

- **Autenticação de usuários** (registro e login com JWT)
- **Gerenciamento de medicamentos** (CRUD completo)
- **Categorização por tipo** (analgésicos, antibióticos, vitaminas, etc.)
- **Controle de localização** (onde está armazenado cada medicamento)
- **Acompanhamento de validade**
- **Controle de quantidade**
- **Notas e observações**
- **Documentação interativa** com Swagger UI

## 🛠️ Tecnologias

### Back-end (API)

- **Node.js** com **TypeScript**
- **Fastify** (framework web)
- **Drizzle ORM** (Object-Relational Mapping)
- **SQLite** (banco de dados)
- **JWT** (autenticação)
- **Bcrypt** (hash de senhas)
- **Zod** (validação de esquemas)
- **Swagger/OpenAPI** (documentação)

### Front-end (Web)

- **React 18** com **TypeScript**
- **Vite** (build tool e dev server)
- **TanStack Router** (roteamento type-safe)
- **TanStack Query** (gerenciamento de estado do servidor)
- **React Hook Form** (formulários)
- **Zod** (validação de esquemas)
- **TailwindCSS** (estilização)
- **Axios** (cliente HTTP)
- **Lucide React** (ícones)

## � Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- **Node.js** versão 18 ou superior ([baixar aqui](https://nodejs.org/))
- **npm** (vem junto com o Node.js) ou **yarn**
- **Git** ([baixar aqui](https://git-scm.com/))

Para verificar se tudo está instalado corretamente:

```bash
node --version  # Deve mostrar v18.x.x ou superior
npm --version   # Deve mostrar a versão do npm
git --version   # Deve mostrar a versão do git
```

## 🚀 Guia de Instalação Completo

### 1. Clonando o Repositório

```bash
git clone <repository-url>
cd ifounds
```

### 2. Configurando o Back-end (API)

#### 2.1. Navegue até a pasta da API

```bash
cd api
```

#### 2.2. Instale as dependências

```bash
npm install
```

#### 2.3. Configure as variáveis de ambiente

Crie um arquivo `.env` na pasta `/api`:

```bash
# No Linux/macOS
touch .env

# No Windows (cmd)
type nul > .env

# No Windows (PowerShell)
New-Item .env -type file
```

Adicione o seguinte conteúdo ao arquivo `.env`:

```env
JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production
JWT_EXPIRES_IN=7d
DATABASE_URL=./data/database.sqlite
```

#### 2.4. Configure o banco de dados

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

#### 2.5. Popule o banco com dados de exemplo (opcional)

```bash
npm run seed
```

#### 2.6. Inicie o servidor da API

```bash
npm run dev
```

✅ **API rodando em:** http://localhost:3000  
✅ **Documentação Swagger:** http://localhost:3000/docs

### 3. Configurando o Front-end (Web)

**Importante:** Mantenha a API rodando e abra um novo terminal!

#### 3.1. Navegue até a pasta web (em um novo terminal)

```bash
# A partir da pasta raiz do projeto
cd web
```

#### 3.2. Instale as dependências

```bash
npm install
```

#### 3.3. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

✅ **Aplicação Web rodando em:** http://localhost:3001

## 🎯 Testando o Sistema Completo

### Credenciais de Teste

Se você executou o seed (passo 2.5), use estas credenciais:

```
Email: test@test.com
Senha: Test123!!!
```

### Fluxo de Teste Completo

1. **Acesse a aplicação web:** http://localhost:3001
2. **Faça login** com as credenciais acima
3. **Explore os medicamentos** já cadastrados
4. **Adicione um novo medicamento**
5. **Edite ou remova** medicamentos existentes
6. **Teste a documentação da API:** http://localhost:3000/docs

## 🔧 Scripts Disponíveis

### Back-end (pasta `/api`)

```bash
npm run dev   # Inicia servidor em modo desenvolvimento
npm run seed  # Popula banco com dados de exemplo
```

### Front-end (pasta `/web`)

```bash
npm run dev     # Inicia servidor de desenvolvimento
npm run build   # Cria build de produção
npm run preview # Visualiza build de produção
npm run lint    # Executa análise de código
```

## 📱 Acessando as Aplicações

Após seguir todos os passos:

| Aplicação      | URL                        | Descrição                      |
| -------------- | -------------------------- | ------------------------------ |
| **Web App**    | http://localhost:3001      | Interface principal do usuário |
| **API**        | http://localhost:3000      | Servidor da API                |
| **Swagger UI** | http://localhost:3000/docs | Documentação interativa da API |

## 🛑 Solução de Problemas Comuns

### Erro: "porta já está em uso"

Se você receber erro de porta em uso:

```bash
# Mata processos nas portas 3000 e 3001
npx kill-port 3000
npx kill-port 3001
```

### Erro: "comando não encontrado"

Certifique-se de que você está na pasta correta:

- Para comandos da API: você deve estar em `/ifounds/api`
- Para comandos do Web: você deve estar em `/ifounds/web`

### Erro: "ENOENT: no such file or directory"

Certifique-se de ter executado `npm install` em ambas as pastas:

```bash
# Na pasta raiz do projeto
cd api && npm install
cd ../web && npm install
```

### Problemas de autenticação

Se tiver problemas de login:

1. Certifique-se de que a API está rodando
2. Verifique se executou o seed: `npm run seed` na pasta `/api`
3. Use as credenciais exatas: `test@test.com` / `Test123!!!`

## 🧪 Testando a API Diretamente

### Via Swagger UI (Recomendado)

1. **Certifique-se de que a API está rodando:** http://localhost:3000
2. **Acesse a documentação:** http://localhost:3000/docs
3. **Na seção Authentication, clique em POST /auth/login**
4. **Clique em "Try it out"**
5. **Use as credenciais de teste** (campos pré-preenchidos):
   ```json
   {
     "email": "test@test.com",
     "password": "Test123!!!"
   }
   ```
6. **Execute e copie o token retornado**
7. **Clique no botão "Authorize" no topo da página**
8. **Cole o token no formato:** `Bearer <seu-token-aqui>`
9. **Agora você pode testar todas as rotas de medicamentos!**

### Via cURL (Para desenvolvedores avançados)

**Login:**

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!!!"}'
```

**Listar medicamentos (com token):**

```bash
curl -X GET http://localhost:3000/medicines \
  -H "Authorization: Bearer <seu-token-aqui>"
```

## 🔐 Credenciais de Teste (Seed)

Após executar o seed (`npm run seed` na pasta `/api`), você terá:

```json
{
  "email": "test@test.com",
  "password": "Test123!!!",
  "name": "Test Silva"
}
```

## 💻 Interface da Aplicação Web

A aplicação web fornece uma interface amigável para:

- ✅ **Dashboard** com visão geral dos medicamentos
- ✅ **Login/Cadastro** de usuários
- ✅ **Lista de medicamentos** com filtros e busca
- ✅ **Adicionar novos medicamentos** com formulário completo
- ✅ **Editar medicamentos** existentes
- ✅ **Excluir medicamentos**
- ✅ **Design responsivo** (funciona em mobile e desktop)
- ✅ **Validação de formulários** com mensagens de erro claras
- ✅ **Notificações** de sucesso e erro
- ✅ **Autenticação automática** com JWT

### Funcionalidades da Interface Web

1. **Página Inicial** (`/`)

   - Dashboard com resumo dos medicamentos
   - Links rápidos para principais funcões

2. **Autenticação** (`/login`, `/register`)

   - Login com email e senha
   - Cadastro de novos usuários
   - Redirecionamento automático após login

3. **Gerenciamento de Medicamentos** (`/medicines`)

   - Lista todos os medicamentos do usuário
   - Busca e filtros
   - Ações de editar e excluir

4. **Adicionar Medicamento** (`/medicines/new`)
   - Formulário completo com validação
   - Campos: nome, categoria, localização, quantidade, validade, notas
   - Feedback imediato de erros

## 🏃‍♂️ Início Rápido (Para Pressa)

Se você quer testar rapidamente:

```bash
# 1. Clone e entre no projeto
git clone <repository-url> && cd ifounds

# 2. Configure e inicie a API
cd api && npm install && npm run seed && npm run dev

# 3. Em outro terminal, configure e inicie o Web
cd ../web && npm install && npm run dev

# 4. Acesse http://localhost:3001
# 5. Login: test@test.com / Test123!!!
```

## 📚 Documentação da API

### Autenticação

#### POST /auth/register

Registra um novo usuário.

**Body:**

```json
{
  "email": "test@test.com",
  "name": "Test Silva",
  "password": "Test123!!!"
}
```

#### POST /auth/login

Autentica um usuário existente.

**Body:**

```json
{
  "email": "test@test.com",
  "password": "Test123!!!"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "test@test.com",
      "name": "Test Silva"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "Login successful"
}
```

### Medicamentos

Todas as rotas de medicamentos requerem autenticação via Bearer Token.

#### GET /medicines

Lista todos os medicamentos do usuário autenticado.

#### POST /medicines

Cria um novo medicamento.

#### GET /medicines/:id

Busca um medicamento específico.

#### PUT /medicines/:id

Atualiza um medicamento existente.

#### DELETE /medicines/:id

Remove um medicamento.

## 🗂️ Estrutura Completa do Projeto

```
ifounds/
├── api/                      # Back-end API
│   ├── src/
│   │   ├── db/
│   │   │   ├── index.ts      # Configuração do banco
│   │   │   └── schema.ts     # Esquemas das tabelas
│   │   ├── middleware/
│   │   │   └── auth.ts       # Middleware de autenticação
│   │   ├── routes/
│   │   │   ├── auth/
│   │   │   │   ├── index.ts  # Rotas de autenticação
│   │   │   │   └── schema.ts # Validações auth
│   │   │   └── medicines/
│   │   │       ├── index.ts  # Rotas de medicamentos
│   │   │       └── schema.ts # Validações medicamentos
│   │   ├── scripts/
│   │   │   └── seed.ts       # Script de seed
│   │   ├── services/
│   │   │   ├── authService.ts
│   │   │   ├── medicinesService.ts
│   │   │   └── aiService.ts
│   │   ├── types/
│   │   │   └── index.ts      # Tipos TypeScript
│   │   └── index.ts          # Entrada principal da API
│   ├── data/
│   │   └── database.sqlite   # Banco SQLite
│   ├── .env                  # Variáveis de ambiente (você cria)
│   ├── drizzle.config.ts     # Config Drizzle ORM
│   ├── package.json          # Dependências da API
│   └── tsconfig.json
│
└── web/                      # Front-end React
    ├── src/
    │   ├── components/       # Componentes reutilizáveis
    │   │   ├── Layout.tsx    # Layout principal
    │   │   ├── MedicineCard.tsx
    │   │   └── MedicineForm.tsx
    │   ├── hooks/            # Custom React hooks
    │   │   ├── useAuth.tsx   # Hook de autenticação
    │   │   └── useMedicines.ts
    │   ├── lib/              # Utilitários
    │   │   ├── api.ts        # Cliente da API
    │   │   └── auth.tsx      # Contexto de auth
    │   ├── routes/           # Páginas da aplicação
    │   │   ├── __root.tsx    # Layout raiz
    │   │   ├── index.tsx     # Dashboard
    │   │   ├── login.tsx     # Página de login
    │   │   ├── register.tsx  # Página de cadastro
    │   │   └── medicines/
    │   │       ├── index.tsx # Lista de medicamentos
    │   │       └── new.tsx   # Adicionar medicamento
    │   ├── types/
    │   │   └── index.ts      # Tipos TypeScript
    │   └── main.tsx          # Entrada principal do React
    ├── public/               # Arquivos estáticos
    ├── package.json          # Dependências do React
    ├── vite.config.ts        # Configuração do Vite
    ├── tailwind.config.js    # Configuração do Tailwind
    └── tsconfig.json
```

## 🏥 Dados de Exemplo (Seed)

Após executar `npm run seed` na pasta `/api`, o sistema será populado com:

- **Analgésicos:** Dipirona, Paracetamol, Ibuprofeno, Aspirina
- **Antibióticos:** Amoxicilina, Azitromicina, Cefalexina
- **Antigripe:** Benegrip, Coristina D, Xarope Vick
- **Digestivos:** Omeprazol, Pantoprazol, Buscopan
- **Cardiovasculares:** Losartana, Atenolol, Sinvastatina
- **Vitaminas:** Vitamina D3, Complexo B, Vitamina C
- **Dermatológicos:** Bepantol, Cetoconazol
- **Controlados:** Rivotril, Fluoxetina (com anotações especiais)
- **Pediátricos:** Medicamentos para crianças
- **Homeopáticos & Fitoterápicos:** Alternativas naturais
- **Primeiros Socorros:** Antissépticos e curativos

Cada medicamento inclui:

- Nome e descrição realistas
- Localização específica na casa ("Armário do quarto", "Geladeira", etc.)
- Categoria apropriada
- Quantidade disponível (1-100 unidades)
- Data de validade (distribuída nos próximos 2 anos)
- Notas de uso e posologia

## 🤝 Para Desenvolvedores

### Contribuindo

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: nova funcionalidade'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Estrutura de Desenvolvimento

- **API**: Desenvolvida com Fastify + Drizzle + SQLite
- **Web**: Desenvolvida com React + TanStack + Tailwind
- **Validação**: Zod em ambos front e back-end
- **Tipagem**: TypeScript strict em todo o projeto
- **Autenticação**: JWT com refresh automático
- **Estado**: TanStack Query para cache e sincronização

### Extensões VS Code Recomendadas

Para melhor experiência de desenvolvimento:

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

## 🔍 Recursos e Documentação

### Swagger UI - Documentação Interativa da API

Acesse http://localhost:3000/docs para:

- ✅ **Exemplos pré-preenchidos** com dados reais
- ✅ **Esquemas de validação** completos
- ✅ **Teste direto das rotas** sem sair do navegador
- ✅ **Autenticação Bearer Token** integrada
- ✅ **Respostas de exemplo** para cada endpoint

### Status Codes da API

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Dados inválidos (erro de validação)
- `401` - Não autorizado (token inválido/ausente)
- `403` - Proibido (sem permissão)
- `404` - Não encontrado
- `409` - Conflito (ex: email já existe)
- `500` - Erro interno do servidor

## 🔧 Scripts de Desenvolvimento

### Scripts da API (`/api`)

```bash
npm run dev   # Servidor de desenvolvimento com hot-reload
npm run seed  # Popula banco com dados de exemplo
```

### Scripts do Web (`/web`)

```bash
npm run dev     # Servidor de desenvolvimento (porta 3001)
npm run build   # Build de produção
npm run preview # Preview do build de produção
npm run lint    # Análise de código (ESLint)
```

## 📝 Notas Técnicas Importantes

### Segurança

- ✅ Senhas hasheadas com **bcrypt** (12 rounds)
- ✅ Tokens JWT com **expiração em 7 dias**
- ✅ Middleware de autenticação em todas as rotas protegidas
- ✅ Validação rigorosa com **Zod** no front e back-end
- ✅ Headers de segurança configurados

### Banco de Dados

- ✅ **SQLite** para desenvolvimento (fácil setup)
- ✅ **Drizzle ORM** com TypeScript type-safety
- ✅ Migrações automáticas
- ✅ Seed script com dados brasileiros realistas
- 🔄 Pode ser migrado para **PostgreSQL** em produção

### CORS & Conectividade

- ✅ CORS habilitado para desenvolvimento
- ✅ API configurada para aceitar requisições do front-end
- ⚠️ **Importante:** Configurar CORS adequadamente para produção

### Performance & Experiência

- ✅ **Hot-reload** em desenvolvimento (API e Web)
- ✅ **TanStack Query** para cache inteligente
- ✅ **Lazy loading** de componentes
- ✅ **Responsive design** mobile-first
- ✅ **Error boundaries** e tratamento de erros

## 📄 Licença

Este projeto está sob a licença ISC.

---

## 🎉 Resumo do que você terá após a instalação

### ✅ **Back-end (API) funcionando com:**

- Servidor rodando em http://localhost:3000
- Documentação Swagger em http://localhost:3000/docs
- 1 usuário de teste: `test@test.com` / `Test123!!!`
- 75+ medicamentos brasileiros categorizados
- Banco SQLite populado e funcional
- Autenticação JWT configurada

### ✅ **Front-end (Web) funcionando com:**

- Aplicação React em http://localhost:3001
- Interface moderna e responsiva
- Login automático com as credenciais de teste
- Dashboard com listagem de medicamentos
- Formulários para adicionar/editar medicamentos
- Navegação intuitiva e feedbacks visuais

### ✅ **Sistema integrado oferecendo:**

- Experiência completa de usuário
- Sincronização automática entre front e back-end
- Validações em tempo real
- Cache inteligente de dados
- Tratamento de erros amigável
- Design responsivo (mobile + desktop)

**Total de funcionalidades:** Sistema completo de gerenciamento de medicamentos pronto para uso! 🚀

---

## ❓ Precisa de Ajuda?

### Problemas Comuns e Soluções

**❌ Erro de porta em uso?**

```bash
npx kill-port 3000 3001
```

**❌ Comando não encontrado?**

- Certifique-se de estar na pasta correta (`/api` ou `/web`)
- Verifique se executou `npm install`

**❌ Erro de autenticação?**

- Confirme que executou `npm run seed` na pasta `/api`
- Use exatamente: `test@test.com` / `Test123!!!`

**❌ API não conecta com o front-end?**

- Confirme que a API está rodando em http://localhost:3000
- Verifique se não há firewall bloqueando

### Suporte

Se ainda tiver problemas:

1. Verifique se seguiu todos os pré-requisitos
2. Confirme que as duas aplicações estão rodando
3. Teste primeiro a API via Swagger UI
4. Depois teste a aplicação web

Lembre-se: mantenha **ambos** os servidores rodando simultaneamente! 🔄
