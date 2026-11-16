# Resume Analyzer

Resume Analyzer reviews a PDF resume against a job description and returns an estimated ATS score, an overall score, and suggestions for improving the resume. The dashboard lets you reopen previous reviews or delete them individually.

[Try the live Resume Analyzer](https://www.ameya-warade.com/projects/resume-analyzer/)

## Features

- Upload a PDF resume up to 20 MB and provide the target company, job title, and job description.
- Get feedback on ATS compatibility, tone and style, content, structure, and skills.
- Preview the resume, open the original PDF, and revisit or delete saved reviews.

## Prerequisites

- **Node.js 24 LTS** with npm. The project's Dockerfile also uses Node 24.
- **Git** to clone the repository.
- An internet connection and a **Puter account** to sign in and run analyses.

Puter.js handles sign-in, file storage, saved reviews, and AI analysis. The app loads Puter.js in the browser and uses Claude Sonnet 4.6 for feedback. You can run the app without creating a `.env` file or entering an AI API key. Uploaded resumes and their preview images are stored in Puter, and the resume is sent to the AI service for analysis.

## Run locally

```bash
git clone https://github.com/Ameya1301/AI-Resume-Analyzer.git
cd AI-Resume-Analyzer
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). If Vite picks a different port, use the URL printed in your terminal.

1. Sign in with Puter.
2. Click **Upload Resume**, select or drop a PDF, and enter the target job details.
3. Click **Analyze Resume**. The analysis may take a moment before the review opens.
4. Return to the homepage to see your saved reviews. Use the **×** on a card to delete that resume and its feedback.

## npm scripts

| Command             | What it does                                              |
| ------------------- | --------------------------------------------------------- |
| `npm run dev`       | Starts the development server with hot reload.            |
| `npm run typecheck` | Generates React Router route types and checks TypeScript. |
| `npm run build`     | Creates a production build in `build/`.                   |
| `npm start`         | Serves the production build. Run `npm run build` first.   |

For a clean install that uses the committed lockfile, run `npm ci` in place of `npm install`.

## Tech stack

React, React Router, TypeScript, Vite, Tailwind CSS, Zustand, PDF.js, and Puter.js.

| Path               | Purpose                                       |
| ------------------ | --------------------------------------------- |
| `app/routes/`      | Dashboard, sign-in, upload, and review pages. |
| `app/components/`  | Resume cards, file uploader, and feedback UI. |
| `app/lib/puter.ts` | Puter sign-in, storage, and AI integration.   |
| `public/`          | Icons and other static assets.                |
