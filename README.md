# 🇮🇳 ElectionGuide AI

An AI-powered civic platform that helps Indian citizens understand the election process, check eligibility, and navigate voting with ease.

Built for accessibility, simplicity, and real-world impact.

---

## 🌟 Features

- 🧠 **AI Chat Assistant**
  - Explains voting process in simple steps
  - Context-aware and multilingual (English, हिंदी, తెలుగు)
  - Non-partisan and fact-based responses

- 📚 **RAG-powered Knowledge System**
  - Uses Supabase pgvector (384-dim, gte-small)
  - Retrieves relevant election knowledge
  - Provides structured answers with sources

- 🗳️ **Voter Journey**
  - Step-by-step guide:
    - Eligibility → Registration → Verification → Booth → Voting → Results

  - Progress tracking per user

- 📅 **Election Timeline**
  - Visual timeline of election phases
  - State-based filtering
  - Highlights current phase

- 📍 **Polling Booth Finder**
  - Search by location/pincode
  - Interactive UI (map-ready architecture)

- 🌐 **Multilingual Support**
  - English, Hindi, Telugu
  - Auto-detection + manual switch

- 🎨 **Civic UI Design**
  - Minimal tricolor-inspired theme
  - Clean, modern, and accessible

---

## 🏗️ Tech Stack

### Frontend

- Next.js (App Router)
- Tailwind CSS
- Framer Motion

### Backend

- Supabase (PostgreSQL + Auth + RLS)
- Edge Functions (API + AI integration)

### AI & RAG

- Gemini (via Lovable AI Gateway)
- Supabase AI (gte-small embeddings)
- pgvector (384-dim embeddings)
- HNSW cosine index for fast retrieval

---

## ⚙️ Architecture

User Query → Chat Edge Function
→ Query Embedding (gte-small)
→ Vector Search (pgvector)
→ Retrieve Top-K Chunks
→ Inject Context into LLM
→ Structured Response with Sources

---

## 🧠 Key Highlights

- Hybrid AI system (LLM + Retrieval)
- Fully serverless architecture
- Secure with Row-Level Security (RLS)
- Scalable and modular design

---

## 🔐 Database Schema (Core Tables)

- profiles
- conversations
- messages
- kb_documents
- kb_chunks (vector embeddings)
- elections
- polling_booths
- notifications
- quiz_attempts

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/electionguide-ai.git
cd electionguide-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

---

### 4. Run the app

```bash
npm run dev
```

---

## 🧪 Demo

👉 Live Demo: [Add your deployed link]
👉 Video Demo: [Add demo video link]

---

## 🎯 Use Cases

- First-time voters
- Students learning civic processes
- Citizens needing election guidance

---

## ⚠️ Disclaimer

This application provides general informational guidance based on publicly available data.
Users are encouraged to verify details with official sources such as the Election Commission of India.

---

## 👨‍💻 Author

**Vinay A**

- Final Year CSE Student
- AI & Data Analytics Enthusiast

---

## 🏆 Hackathon Submission

Built for **Hack2Skill Challenge 2 (2026)**

---

## 💡 Future Improvements

- Real-time ECI API integration
- Push notifications & reminders
- WhatsApp bot integration
- Advanced analytics dashboard

---

## 📜 License

MIT License
