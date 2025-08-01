# Full Stack AI Fianace Platform with Next JS, Supabase, Tailwind, Prisma, Inngest, ArcJet, Shadcn UI Tutorial 🔥🔥


<img width="1470" alt="Screenshot 2024-12-10 at 9 45 45 AM" src="https://github.com/user-attachments/assets/1bc50b85-b421-4122-8ba4-ae68b2b61432">
# 🚀 AI Finance Dashboard

**An AI-augmented personal finance platform** built with Next.js, Gemini AI, and a modern full-stack stack—tracking transactions, visualizing spending patterns, and generating insights via large‑language models.

---

## 🧠 Project Overview

This project offers secure, real‑time expense tracking with intuitive dashboards. Gemini‑based AI modules suggest budgets, summarize spending trends, and categorize expenses intelligently. Built to scale, it balances speed, accessibility, and type-safe data integrity.

---

## 🧩 Features

- 📌 **Expense logging**, budget setting, and category management  
- 📈 Interactive charts show trends over time  
- 💡 **Automated AI insights**, summaries, and recommendations  
- 🔄 **Real‑time updates** via Server Components, API routes, or Server Actions  
- 🔐 Authentication via **Next Auth** (Google, email/password, JWT)  
- 🚀 Hosted on Vercel or Netlify with CI/CD support  
- 🧪 Local development with **SQLite**—production-ready on **PostgreSQL**

---

## 🛠️ Tech Stack

| Layer               | Technology       | Rationale |
|---------------------|------------------|-----------|
| Framework           | **Next.js**      | Server‑side rendering boosts first‑load performance and **SEO** while reducing client‑side bundle size, enabling dynamic dashboards and personalized pages. :contentReference[oaicite:1]{index=1} |
| Styling             | **Tailwind CSS** | A **utility‑first** approach lets you compose styles directly in markup for fast, consistent, and responsive UI development. :contentReference[oaicite:2]{index=2} |
| UI Components       | **shadcn/ui**    | A curated, open‑code component set compatible with Tailwind and AI tooling—fully composable and easy to customize. :contentReference[oaicite:3]{index=3} |
| ORM & Database      | **Prisma Client**| Auto‑generated client based on schema provides **TypeScript‑safe, auto‑completion**, and migrations for evolving your DB smoothly. :contentReference[oaicite:4]{index=4} |
| AI Engine           | **Gemini AI**    | Google DeepMind’s multimodal, reasoning‑enabled model (2.5 Pro) that handles text, code, numeric data and generates finance‑specific insights. :contentReference[oaicite:5]{index=5} |
| Data Store          | SQLite / PostgreSQL | Easy dev setup + robust scale for transactional finance data |
| Auth Layer          | Next Auth        | OAuth, email verification, session handling with TypeScript support |
| Deployment          | Vercel / Netlify | Serverless previews with instant build + automatic Prisma migrations |

---

## 🏗️ Project Architecture


### Make sure to create a `.env` file with following variables -

```
DATABASE_URL=
DIRECT_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

GEMINI_API_KEY=

RESEND_API_KEY=

ARCJET_KEY=
```

### 4. Database Setup

Ensure your Supabase project is set up and `DATABASE_URL` is configured.

```sh
npx prisma generate
npx prisma db push
# or for full migrations:
# npx prisma migrate dev --name init
```

### 5. Run the Development Server

```sh
npm run dev
```

The application will be available at [HERE](https://welth-nowb.vercel.app/).

---

## License

Distributed under the MIT License. See the [LICENSE](LICENSE) file for details.
