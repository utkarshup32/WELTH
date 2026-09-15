<div align="center">

  <img src="public/logo.png" alt="WELTH Logo" width="240" />

  # WELTH — AI Wealth & Financial Intelligence Platform

  **An intelligent, full-stack personal finance platform and wealth copilot.**  
  Powered by **Next.js 15, Supabase PostgreSQL, pgvector RAG, Google Gemini 3.6, Prisma ORM, Clerk, and Inngest**.

  <br />

  [![Live Demo](https://img.shields.io/badge/Live%20Demo-welth--lemon.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://welth-lemon.vercel.app)
  [![Next.js 15](https://img.shields.io/badge/Next.js-15.4.10-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
  [![React 19](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
  [![Google Gemini](https://img.shields.io/badge/Google%20Gemini-3.6%20Flash%20%2B%20Embeddings-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
  [![Supabase pgvector](https://img.shields.io/badge/Supabase-PostgreSQL%20%2B%20pgvector-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
  [![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.com/)
  [![Inngest](https://img.shields.io/badge/Inngest-Background%20Crons-FF5A54?style=for-the-badge&logo=inngest&logoColor=white)](https://www.inngest.com/)

  <br />

  [🌐 **Explore Live Application**](https://welth-lemon.vercel.app) • [✨ **Key Features**](#-key-features) • [🏛️ **Architecture**](#️-system-architecture) • [🚀 **Getting Started**](#-getting-started) • [📁 **Directory Layout**](#-project-structure)

  <br />

  <a href="https://welth-lemon.vercel.app">
    <img src="public/banner.jpeg" alt="WELTH Finance Dashboard Preview" width="100%" style="border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.15);" />
  </a>

</div>

---

## 🌟 Overview

**WELTH** transforms personal money management from reactive bookkeeping into proactive, AI-driven financial intelligence. By combining relational ledger tracking with **multimodal OCR, pgvector semantic retrieval (RAG), conversational natural-language quick logging, and Google Gemini**, users can interact with their finances as naturally as chatting with a personal financial advisor.

🔗 **Production Deployment:** [https://welth-lemon.vercel.app](https://welth-lemon.vercel.app)

---

## ✨ Key Features

### 1. 🤖 WELTH AI Copilot (Context-Grounded Financial LLM)
- **Live Context Grounding**: Conversational assistant with direct, secure access to your accounts, monthly category budgets, and 30-day transaction history.
- **RAG Citations**: Combines structured database metrics with unstructured bank statements and receipts stored in the Document Vault.
- **Proactive Advisory**: Provides personalized budget allocations, spending warnings, negative balance alerts, and answers complex questions like *"Can I afford a $150 dinner tonight?"*
- **Persistent Slide-Out Drawer**: Always-available launcher accessible on all dashboard routes.

### 2. 📄 Document Vault & AI Insights (pgvector RAG)
- **Document Ingestion**: Upload bank statements, invoices, tax documents, and receipts (PDF, PNG, JPG, CSV).
- **Multimodal OCR**: Powered by Google Gemini 3.6 Flash for high-accuracy extraction of tabular bank statements and transaction items.
- **Semantic Vector Search**: Chunks text and computes **3072-dimensional embeddings** via `gemini-embedding-001`, indexed in Supabase `pgvector`.
- **Cosine Similarity Retrieval**: Search across your entire financial paper trail with cosine similarity (`<=>`) to instantly surface deductible expenses, account numbers, or fee policies.

### 3. ⚡ Conversational Quick-Log
- **Natural Language Expense Tracking**: Log transactions in seconds using conversational English (e.g., _"Spent $45 on groceries with my Personal card yesterday"_ or _"Earned $1,200 freelance consulting"_).
- **Automated Entity Extraction**: Gemini parses the amount, transaction type (`EXPENSE`/`INCOME`), category, relative dates (_"yesterday"_, _"last Friday"_), and intelligently matches the user's account name.
- **Interactive Review & 1-Click Confirmation**: Review parsed details before committal to the Prisma ledger.

### 4. 🧾 AI Smart Receipt Scanner
- Upload receipt photos or physical invoices to auto-populate merchant name, amount, date, and category right into the transaction ledger without manual typing.

### 5. 📊 Comprehensive Wealth Management & Analytics
- **Multi-Account Tracking**: Manage Checking, Savings, and Investment accounts with real-time balance calculations.
- **Budget Monitoring**: Visual progress bars and proactive alerts when spending nears 80% or 100% of limits.
- **Visual Analytics**: Interactive Recharts graphs tracking monthly cashflow, spending breakdowns, and category allocations.

### 6. ⚙️ Automated Background Workflows (Inngest)
- **Daily Recurring Processing**: Automatically executes recurring subscriptions and bills.
- **Budget Alerts**: Checks monthly budget thresholds and notifies users before overspending.
- **Monthly Financial Reports**: Generates AI financial summaries sent straight to your inbox via Resend.

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    Client["Client / Browser\n(Next.js 15 + React 19)"]
    Auth["Clerk Authentication\n(Session & Route Shield)"]
    API["App Router & Server Actions\n(actions/ & app/api/)"]
    Prisma["Prisma ORM 6\n(Transactions, Accounts, Budgets)"]
    DB[("Supabase PostgreSQL\n+ pgvector Extension")]
    Gemini["Google Gemini AI\n(gemini-3.6-flash & gemini-embedding-001)"]
    Inngest["Inngest Engine\n(Daily Crons & Async Tasks)"]
    Resend["Resend Email Service\n(Monthly AI Summaries)"]

    Client -->|User Interactions| Auth
    Auth -->|Protected Session| API
    API -->|Ledger Queries| Prisma
    Prisma -->|SQL / Relations| DB
    API -->|OCR, Quick-Log, Chat & Vector Search| Gemini
    Gemini -->|3072-dim Embeddings| DB
    Inngest -->|Scheduled Triggers| API
    Inngest -->|Send Email Reports| Resend
```

---

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | [Next.js 15 (App Router)](https://nextjs.org/) + [React 19](https://react.dev/) |
| **Database & Vector** | [Supabase PostgreSQL](https://supabase.com/) with [`pgvector`](https://github.com/pgvector/pgvector) |
| **ORM** | [Prisma 6.0](https://www.prisma.io/) |
| **AI Models** | [Google Gemini 3.6 Flash](https://ai.google.dev/) + `gemini-embedding-001` (3072 dimensions) |
| **Authentication** | [Clerk](https://clerk.com/) |
| **Workflows & Crons** | [Inngest 3.54](https://www.inngest.com/) |
| **Security & Firewall** | [ArcJet](https://arcjet.com/) |
| **Component Library** | [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) |
| **Charts** | [Recharts](https://recharts.org/) |
| **Email Service** | [Resend](https://resend.com/) + [React Email](https://react.email/) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/utkarshup32/WELTH.git
cd WELTH
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:

```env
# Supabase PostgreSQL Database (Transaction Pooler & Direct URL)
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Google Gemini AI (Powers WELTH AI Copilot, OCR & Embeddings)
GEMINI_API_KEY=AIzaSy...

# ArcJet Security
ARCJET_KEY=ajkey_...

# Resend (Monthly Financial Summaries)
RESEND_API_KEY=re_...
```

### 3. Database & pgvector Setup
Enable the `vector` extension in your Supabase SQL Editor:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

Synchronize the Prisma schema and generate client:
```bash
npx prisma generate
npx prisma db push
```

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
WELTH/
├── actions/                  # Next.js Server Actions
│   ├── budget.js             # Monthly budget updates & alerts
│   ├── dashboard.js          # Dashboard aggregation & balance totals
│   ├── documents.js          # Document Vault OCR, chunking & vector indexing
│   ├── quick-log.js          # NLP entity parser & quick transaction committal
│   └── transaction.js        # Transaction creation & AI receipt scanning
├── app/
│   ├── (auth)/               # Clerk sign-in and sign-up routes
│   ├── (main)/
│   │   ├── account/[id]/     # Individual account breakdown
│   │   ├── dashboard/        # Main overview & Conversational Quick-Log bar
│   │   ├── documents/        # Document Vault & Semantic Search UI
│   │   └── transaction/      # Transaction creation & receipt uploader
│   └── api/
│       ├── chat/             # WELTH AI Copilot API (Context Grounding + RAG)
│       ├── inngest/          # Inngest webhook route
│       └── seed/             # Database seeder
├── components/               # UI components
│   ├── ai-copilot-drawer.jsx # Floating WELTH AI assistant drawer
│   ├── quick-log-bar.jsx     # Conversational NLP Quick-Log input widget
│   ├── hero.jsx              # Landing page hero banner
│   └── header.jsx            # Top navigation bar with Clerk UserButton
├── lib/
│   ├── inngest/              # Scheduled cron jobs and background tasks
│   ├── prisma.js             # Singleton Prisma client
│   └── vector.js             # Gemini 3072-dim embeddings & pgvector search
└── prisma/
    └── schema.prisma         # PostgreSQL schema (Users, Accounts, Transactions, Documents, Vectors)
```

---

## 🔒 Security & Performance

- **React2Shell Immune**: Upgraded to **Next.js 15.4.10** and **React 19.0.0**, hardened against CVE-2025-66478 and CVE-2025-55184.
- **Inngest Hardened**: Using **Inngest 3.54.2** to meet strict production security advisories.
- **Rate-Limiting**: Shielded by **ArcJet** against bot scraping, brute force, and abuse.
- **Credential Protection**: Strict `.gitignore` policy ensures zero `.env` or API credentials leak to source control.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for details.

Developed with ❤️ by **Utkarsh Dwivedi**.  
Live Demo: [https://welth-lemon.vercel.app](https://welth-lemon.vercel.app)
