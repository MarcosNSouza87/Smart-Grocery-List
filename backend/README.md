# 🛒 Smart Grocery List — Backend API

Backend API for the Smart Grocery List app — built with NestJS, Prisma (SQLite), and the Claude API for AI-powered features like free-text parsing, categorization, and purchase suggestions.

## 🛠 Tech Stack

- **Framework:** NestJS
- **Database:** SQLite (via Prisma ORM)
- **Auth:** JWT (Passport)
- **Real-time:** Socket.io (shared lists)
- **AI:** Claude API (`@anthropic-ai/sdk`)
- **API Docs:** Swagger

## 📁 Project Structure
src/
├── auth/        # JWT authentication
├── users/       # User management
├── lists/       # Shopping lists
├── items/       # List items (CRUD)
├── ai/          # Claude API integration (parsing, suggestions)
└── prisma/      # Prisma service/module

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Claude API key

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
PORT=3000
```

### Database setup

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### Running the app

```bash
# development (watch mode)
npm run start:dev

# production
npm run start:prod
```

## 📖 API Documentation

Once running, Swagger docs are available at:
http://localhost:3000/api-docs

## 🧪 Tests

```bash
npm run test
```

## 📍 Roadmap

- [x] Project setup (NestJS + Prisma + SQLite)
- [x] Swagger integration
- [ ] Authentication (JWT)
- [ ] Lists & Items CRUD
- [ ] Purchase history tracking
- [ ] AI-powered quick add (free-text parsing)
- [ ] Predictive suggestions
- [ ] Real-time shared lists (Socket.io)
- [ ] Tests + CI

## 📄 License

MIT