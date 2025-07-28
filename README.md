# 💰 Welth – Full Stack AI Finance Platform

A modern, AI-powered finance platform built with Next.js, Supabase, Tailwind CSS, Prisma, Inngest, ArcJet, and Shadcn UI.

[![YouTube Tutorial](https://img.shields.io/badge/YouTube-Tutorial-red?logo=youtube)](https://youtu.be/egS6fnZAdzk)

<img width="100%" alt="Welth Screenshot" src="https://github.com/user-attachments/assets/1bc50b85-b421-4122-8ba4-ae68b2b61432">

---

## Features

- **AI-powered transaction categorization and receipt scanning**
- Real-time financial tracking across multiple accounts
- Secure authentication and user management (Clerk)
- Interactive charts and personalized monthly reports
- Responsive, accessible UI with Shadcn UI and Tailwind CSS

---

## Getting Started

### 1. Clone the Repository

```sh
git clone https://github.com/your-username/wealth-finance-platform.git
cd wealth-finance-platform
```

### 2. Install Dependencies

```sh
npm install
# or
yarn install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and add the following variables:

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

The application will be available at [http://localhost:3000](http://localhost:3000).

---

## License

Distributed under the MIT License. See the [LICENSE](LICENSE) file for details.