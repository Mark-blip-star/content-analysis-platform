⸻

Content Analysis Platform

An AI-powered full-stack application that allows users to submit textual content (via text or URL) and receive AI-generated insights, including summaries and keyword extractions. Processing is handled asynchronously via queue workers.

⸻

Tech Stack
• Backend: NestJS, PostgreSQL, TypeORM, BullMQ, Redis
• Frontend: React
• AI: OpenAI GPT-3.5 Turbo

⸻

Project Structure

/
├── backend/ # NestJS API
├── frontend/ # React client
├── docker-compose.yml
├── package.json # Root-level scripts

⸻

Setup Instructions

1. Clone the Repository

git clone https://github.com/your-username/content-insight-platform.git
cd content-insight-platform

2. Prepare Environment Files
   BACKEND:
   cd backend
   cp .env.example .env

Note:
Ensure your backend/.env contains a valid OPENAI_API_KEY

FRONTEND:
cd frontend
cp .env.example .env

3. Start Infrastructure (PostgreSQL, Redis)

docker-compose up -d

4. Install Dependencies

npm install
npm run install:all

5. Run Application

npm run dev

    •	Frontend: http://localhost:3000
    •	Backend: http://localhost:3001 (or as configured)

⸻

Features
• User authentication (JWT-based)
• Content submission (text or URL)
• Heuristic-based URL content extraction (no third-party readability libraries)
• Asynchronous AI processing via BullMQ
• AI-generated insights:
• Summaries
• Keywords

⸻

Important Notes
• OPENAI_API_KEY is required for AI functionality.
• TypeORM auto-sync is enabled for development only. Disable it in production.
• All AI processing is handled asynchronously via background workers. Requests are not blocked.

⸻

Author

Mark Solomchak

⸻
