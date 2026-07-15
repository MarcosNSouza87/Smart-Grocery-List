# 🛒 Smart Grocery List

An AI-powered grocery list app that learns from your shopping habits — parsing free-text input, suggesting items based on purchase history, and recommending complementary products.

![Status](https://img.shields.io/badge/Status-In_Development-FFD60A?style=for-the-badge)

## 📋 Overview

Smart Grocery List helps users build shopping lists faster and smarter. Instead of manually adding items one by one, users can type everything at once in free text, and the app uses AI to parse, categorize, and organize the list automatically. Over time, it learns purchase patterns and suggests items before the user even thinks of them.

## ✨ Features

- **Quick Add (Free Text Parsing)** — Type items naturally (e.g. "rice, 2 milk, beans, oil") and the AI splits and categorizes them automatically
- **Smart Categorization** — Items are automatically sorted into categories (produce, dairy, cleaning supplies, etc.)
- **Purchase History** — Every completed shopping trip is saved, building a history of what you buy and how often
- **Predictive Suggestions** — Based on purchase frequency, the app suggests re-adding items you're likely running low on
- **Complementary Item Suggestions** — Buying pasta? The app suggests tomato sauce
- **Shared Lists (Real-Time)** — Multiple users (family, roommates, partners) can edit the same list simultaneously

## 🛠 Tech Stack

**Mobile**
- React Native (Expo)

**Backend**
- Node.js + Express
- PostgreSQL
- Socket.io (real-time shared lists)
- JWT Authentication

**AI**
- Claude API — used for free-text parsing, categorization, and complementary item suggestions

## 🏗 Architecture
Mobile (React Native)
↓
REST API (Node.js/Express)
↓
PostgreSQL  ←→  Claude API (parsing & suggestions)
↓
Socket.io (real-time sync for shared lists)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Expo CLI
- Claude API key

### Installation

```bash
# Clone the repository
git clone https://github.com/MarcosNSouza87/smart-grocery-list.git
cd smart-grocery-list

# Install backend dependencies
cd backend
npm install

# Install mobile dependencies
cd ../mobile
npm install
```

### Environment Variables

Create a `.env` file in the `backend` folder:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/grocery_list
CLAUDE_API_KEY=your_claude_api_key
JWT_SECRET=your_jwt_secret
```

### Running the project

```bash
# Backend
cd backend
npm run dev

# Mobile
cd mobile
npx expo start
```

## 🧪 Testing

```bash
npm run test
```

## 📸 Screenshots / Demo

*(Coming soon)*

## 📍 Roadmap

- [x] Project setup
- [ ] Basic CRUD for lists and items
- [ ] Authentication
- [ ] Purchase history tracking
- [ ] AI-powered quick add (free-text parsing)
- [ ] Predictive suggestions
- [ ] Real-time shared lists
- [ ] Tests + CI
- [ ] Deployment

## 📄 License

This project is licensed under the MIT License.
