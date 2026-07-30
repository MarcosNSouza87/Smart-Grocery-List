# 🛒 Smart Grocery List — Backend API

Backend API for the Smart Grocery List app — an AI-powered grocery list that learns from your shopping habits. Built with **Fastify**, **Prisma (SQLite)**, and the **Claude API** for smart features like free-text parsing, categorization, and purchase suggestions.

![Status](https://img.shields.io/badge/Status-In_Development-FFD60A?style=for-the-badge)

## 🛠 Tech Stack

- **Framework:** Fastify
- **Language:** TypeScript
- **Database:** SQLite (via Prisma ORM)
- **Auth:** JWT (`@fastify/jwt`) + Google OAuth *(implemented — not yet tested end-to-end)*
- **Testing:** Vitest (35 tests covering auth, users, lists, and items)
- **Real-time:** Socket.io *(planned — shared lists)*
- **AI:** Claude API (`@anthropic-ai/sdk`) *(planned)*
- **API Docs:** Swagger (`@fastify/swagger` + `@fastify/swagger-ui`)
- **Architecture:** MVC (Model → Prisma / Controller → business logic / Route → endpoint definitions)

## 📁 Project Structure

src/
├── controllers/     # Request handling and business logic
│   ├── users.controller.ts
│   └── auth.controller.ts
├── models/           # Data layer (Prisma client)
│   └── prisma.ts
├── routes/           # Endpoint definitions per resource
│   ├── users.routes.ts
│   ├── auth.routes.ts
│   ├── lists.routes.ts
│   └── items.routes.ts
├── middlewares/       # Auth guard, etc.
│   └── auth.middleware.ts
├── services/          # External integrations (Google, Claude API)
│   └── google-auth.service.ts
└── server.ts           # App entry point — Fastify, CORS, JWT, Swagger setup


## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A Claude API key (for upcoming AI features)
- A Google OAuth Client ID (for Google sign-in)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file:

```env
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="your_jwt_secret_here"
CLAUDE_API_KEY="your_claude_api_key_here"
GOOGLE_CLIENT_ID="your_google_client_id_here"
PORT=3000
```

### Database setup

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### Running the app

```bash
npm run dev
```

## 📖 API Documentation

Once running, Swagger docs are available at:

http://localhost:3000/api-docs

Routes are grouped by tag: **Auth**, **Users**, **Lists**, **Items**.

## 🔐 Authentication

Most routes require a Bearer token. To test in Swagger:

1. Log in via `POST /auth/login` (or `POST /auth/google`)
2. Copy the returned `access_token`
3. Click **Authorize** at the top of the Swagger page and paste the token
4. Protected routes will now work directly from the docs

## 🧪 Tests

```bash
npm run test
```

*(coming soon)*

## 📍 Roadmap

- [x] Project setup (Fastify + Prisma + SQLite)
- [x] Swagger integration, organized by tags
- [x] Authentication (email/password + JWT)
- [x] Google OAuth login *(implemented — not yet tested end-to-end)*
- [x] Lists & Items CRUD (authenticated)
- [x] User deletion with related data (cascade delete)
- [x] Automated tests (Vitest) — 35 tests covering auth, users, lists, and items
- [ ] AI-powered quick add (free-text parsing via Claude API)
- [ ] Smart categorization
- [ ] Purchase history tracking
- [ ] Predictive re-purchase suggestions
- [ ] Real-time shared lists (Socket.io)
- [ ] CI (GitHub Actions)
- [ ] Deployment (Railway/Render)

## 📄 License

MIT