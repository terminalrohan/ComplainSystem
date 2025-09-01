Complaint Management System 🚀
About the Project

This is a full-stack complaint management system that I built using React, Express, and PostgreSQL.

The idea is simple:

Users can submit complaints (with images).

Admins can log in, review, and manage those complaints.

I used modern web tools and also got help from AI models while building this project (for structuring the code, debugging, and writing documentation).

Tech Stack
Frontend 🖥️

React 18 + TypeScript → Fast, type-safe UI

Vite → Super quick builds

Wouter → Lightweight routing

TanStack Query (React Query) → Smooth server state management

shadcn/ui + Radix UI + Tailwind CSS → Clean, modern UI with reusable components

React Hook Form + Zod → Easy forms with validation

Backend ⚙️

Express.js + TypeScript → REST API with proper error handling

Drizzle ORM → Type-safe queries and schema migrations

bcrypt → Secure password hashing for admins

express-session + connect-pg-simple → Session-based authentication

Multer → Image uploads with size/type validation

Database 🗄️

PostgreSQL (Neon serverless) → Reliable and scalable

Drizzle Kit → Easy schema management and migrations

Features

✅ Submit complaints with an image (max 5MB)
✅ Admin login and session-based authentication
✅ Secure password hashing
✅ Modern UI (with dark/light theming support)
✅ Image upload and validation
✅ Proper error handling and logging
✅ Fully typed with TypeScript (frontend + backend)

System Flow

User submits complaint → goes into complaints table.

Admin logs in → verified via session + bcrypt.

Admin can view, review, and manage complaints.

Images are stored locally in an uploads folder.

Development Experience

I relied heavily on AI tools (like ChatGPT) for:

Debugging tricky TypeScript/Express issues

Writing clean Drizzle ORM queries

Getting boilerplate for authentication

Drafting parts of this README 😅

But I also made sure I understood and customized everything myself.

This project was a great hands-on learning experience for React Query, Drizzle ORM, and shadcn/ui.

How to Run Locally

Clone the repo

git clone https://github.com/your-username/complaint-management-system.git
cd complaint-management-system


Install dependencies

npm install


Setup .env file (example below):

DATABASE_URL=your_neon_postgres_url
SESSION_SECRET=your_secret


Run database migrations

npm run db:push


Start backend

npm run dev:server


Start frontend

npm run dev:client

Future Improvements

Cloud storage for images (AWS S3, Cloudinary)

Role-based access (multiple admins, super-admin)

Email notifications on complaint updates

Deployment on Vercel + Render

Credits

👨‍💻 Built by Rohan Nawriya
🤖 With help from AI models for debugging, structuring, and documentation
