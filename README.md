<div align="center">
<h1>💰 Welth</h1>
<p><strong>Your personal AI-powered finance platform</strong></p>
</div>

<p align="center">
<a href="https://your-wealth-live-website.com/"><strong>🌐 Visit Live Website</strong></a> <!-- Placeholder for your live website link -->
</p>

<p align="center">
<img src="https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js" alt="Next.js Badge" />
<img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase Badge" />
<img src="https://img.shields.io/badge/Clerk-3C3C3C?style=for-the-badge&logo=clerk&logoColor=white" alt="Clerk Badge" />
<img src="https://img.shields.io/badge/Gemini_AI-blueviolet?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI Badge" />
<img src="https://img.shields.io/badge/Deployed-Vercel-000?style=for-the-badge&logo=vercel" alt="Vercel Badge" />
</p>

📖 Description
Wealth is a comprehensive, AI-powered finance platform designed to simplify personal financial management. It empowers users to efficiently track income and expenses, manage budgets, and gain deep insights into their financial health through intelligent automation and intuitive visualizations.

Key highlights:

AI-powered transaction categorization and receipt scanning

Real-time financial tracking across multiple accounts

Secure authentication and user management

Interactive charts and personalized monthly reports

Responsive and user-friendly interface

Reimagine your financial management with cutting-edge AI, moving beyond traditional tools to optimize your wealth.

🔧 Tech Stack
⚛️ Next.js – Full-stack framework for modern web applications

💾 Supabase – Scalable PostgreSQL database and backend services

🔐 Clerk – Robust authentication and user management

🤖 Google Gemini AI – Intelligent features like receipt scanning and report generation

🎨 Shadcn UI – Beautiful and accessible UI components

💨 Tailwind CSS – Utility-first CSS framework for rapid styling

📊 Recharts – Declarative charting library for React

📝 React Hook Form & Zod – Efficient form management and schema validation

📧 React Email & Resend – Building and sending transactional emails

🛡️ Arcjet – Security for bot detection and rate limiting

⚙️ Ingest – Powerful background job processing and scheduling

🚀 Installation
To set up the "Wealth" project locally:

# 1. Clone the repository
git clone https://github.com/your-username/wealth-finance-platform.git
cd wealth-finance-platform

# 2. Install dependencies
npm install
# or
yarn install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in the required environment variables:
# - DATABASE_URL
# - DIRECT_URL
# - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
# - CLERK_SECRET_KEY
# - GEMINI_API_KEY
# - ARCJET_KEY
# - INGEST_API_KEY
# - INGEST_SECRET
# - RESEND_API_KEY
# - NEXTAUTH_SECRET (if applicable)
# - NEXTAUTH_URL (if applicable)

# 4. Database Setup (Supabase & Prisma)
# Ensure your Supabase project is set up and DATABASE_URL is configured.
npx prisma generate
npx prisma db push
# or for full migrations:
# npx prisma migrate dev --name init

# 5. Run the development server
npm run dev

The application will be available at http://localhost:3000.

📦 Usage
Once the application is running, you can:

Sign Up / Log In
Create a new account or log in securely using Clerk-powered authentication.

Add Accounts
Set up and manage your various financial accounts (e.g., savings, checking, credit cards).

Record Transactions
Manually add income and expenses, or leverage the AI-powered receipt scanning feature to auto-fill details.

Manage Budgets
Create personalized budgets for different spending categories and receive alerts as you approach limits.

View Reports
Explore interactive charts and receive AI-generated monthly reports to gain insights into your financial patterns and health.

🤝 Contributing
We welcome contributions to make "Wealth" even better! To contribute:

Fork the repository.

Create a new branch: git checkout -b feature/your-feature-name.

Make your changes.

Commit and push: git commit -m "Add your feature" and git push origin feature/your-feature-name.

Submit a pull request.

Please ensure your code adheres to existing styles and includes relevant tests if applicable.

📄 License
Distributed under the MIT License. See the LICENSE file in the repository for more information.
