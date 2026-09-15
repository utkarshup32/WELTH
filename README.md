# WELTH — Full-Stack AI Wealth & Financial Intelligence Platform

A modern, full-stack personal finance and wealth management platform powered by **Next.js 15, Supabase PostgreSQL, Prisma ORM, Google Gemini AI, pgvector, Clerk, and Inngest**.

---

## ✨ Features

### 1. 🤖 WELTH AI Copilot

- **Live Financial Context Grounding**: Conversational assistant with direct access to user accounts, monthly budgets, and 30-day transaction history.
- **RAG-Powered Answering**: Accurately queries both structured financial data (balances, category aggregations) and unstructured documents.
- **Proactive Insights**: Recommends budget allocations, alerts users of account strain or negative balances, and answers "Can I afford this?" queries.
- **Interactive Floating Launcher**: Persistent, responsive assistant drawer available across all dashboard pages.

### 2. 📄 Document Vault & AI Insights (pgvector RAG)

- **Document Ingestion**: Upload bank statements, invoices, tax forms, and receipts (PDF, text, CSV, images).
- **Multimodal OCR**: Powered by Gemini 3.6 Flash to accurately extract tabular statements and transaction line items.
- **Semantic Vector Search**: Chunks text and generates 3072-dimensional embeddings via `gemini-embedding-001` stored in Supabase `pgvector`.
- **Direct Document Querying**: Search across all uploaded financial documents using cosine similarity (`<=>`) to find specific deductions, interest rates, or fees.

### 3. ⚡ Conversational Quick-Log

- **Natural Language Transaction Entry**: Type freeform text on your dashboard (e.g. _"Spent $35 on groceries with Personal card"_ or _"Earned $500 freelancing"_).
- **Entity Extraction**: Automatically extracts amount, transaction type (`EXPENSE`/`INCOME`), category, relative dates (_"yesterday"_, _"last Friday"_), and matches the user's specific account.
- **Instant Preview & Confirmation**: Review parsed details before one-click logging to the database.

### 4. 🧾 AI Receipt Scanner

- Upload receipt photos or scans to automatically extract the vendor, total amount, category, and date directly into the transaction form.

### 5. 📊 Comprehensive Financial Management

- **Multi-Account Tracking**: Manage Checking, Savings, and Investment accounts with real-time balance calculations.
- **Budget Monitoring**: Set monthly spending limits with visual progress bars and alert thresholds.
- **Visual Analytics**: Interactive Recharts breakdown of income vs. expenses and category spending trends.
- **Background Cron Jobs (Inngest)**:
  - Daily recurring transaction processing.
  - Automated budget threshold alert checks.
  - Monthly AI financial performance summary emails via Resend.
- **Security & Rate Limiting**: Protected with ArcJet rate limiting and Clerk authentication.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/) + [React 19](https://react.dev/)
- **Database & Vectors**: [Supabase PostgreSQL](https://supabase.com/) with [`pgvector`](https://github.com/pgvector/pgvector)
- **ORM**: [Prisma 6](https://www.prisma.io/)
- **AI & Embeddings**: [Google Gemini API](https://ai.google.dev/) (`gemini-3.6-flash` + `gemini-embedding-001`)
- **Authentication**: [Clerk](https://clerk.com/)
- **Background Workflows & Crons**: [Inngest](https://www.inngest.com/)
- **Security & Shielding**: [ArcJet](https://arcjet.com/)
- **Styling & UI Components**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Email Delivery**: [Resend](https://resend.com/) + [React Email](https://react.email/)

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/utkarshup32/WELTH.git
cd welth
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase PostgreSQL (Transaction Pooler & Direct URL)
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Google Gemini AI (Powers WELTH AI, Embeddings & OCR)
GEMINI_API_KEY=AIzaSy...

# ArcJet Security
ARCJET_KEY=ajkey_...

# Resend (Email Reports)
RESEND_API_KEY=re_...
```

### 3. Database & pgvector Setup

Enable the `vector` extension in your Supabase SQL Editor:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

Generate Prisma Client and synchronize schema:

```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development Server

```bash
npm run dev
```

The application will be accessible at [http://localhost:3000](http://localhost:3000).

---

## 📁 Project Structure

```
WELTH/
├── actions/             # Server actions (transactions, documents, quick-log, budget)
├── app/
│   ├── (auth)/          # Clerk sign-in and sign-up pages
│   ├── (main)/
│   │   ├── dashboard/   # Main dashboard overview & Quick-Log bar
│   │   ├── documents/   # Document Vault & Semantic Search
│   │   └── transaction/ # Manual & AI receipt scan entry
│   └── api/
│       ├── chat/        # WELTH AI Copilot API route (grounded RAG + context)
│       └── inngest/     # Inngest background functions & crons
├── components/          # Reusable UI widgets (WELTH AI drawer, Quick-Log bar, header)
├── lib/
│   ├── inngest/         # Inngest clients and scheduled functions
│   ├── prisma.js        # Global Prisma client instance
│   └── vector.js        # Gemini embeddings & pgvector search helpers
└── prisma/
    └── schema.prisma    # PostgreSQL database schema (Users, Accounts, Transactions, Documents, Vectors)
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
