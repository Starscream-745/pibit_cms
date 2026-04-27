# PIBIT.AI CMS - Claude Code Guidelines

## Project Overview
A lightweight Content Management System for managing digital assets using manually provided URLs and file uploads. Built for PIBIT.AI.

## Technology Stack
- **Frontend:** React 18, TypeScript, Vite, React Router, Framer Motion, Lucide React
- **Backend:** Node.js, Express, TypeScript, MongoDB (Native Driver), GridFS, JSON Web Tokens (JWT)
- **Testing:** Vitest (Frontend & Backend)

## Commands
### Frontend
- **Install dependencies:** `cd frontend && npm install`
- **Start dev server:** `cd frontend && npm run dev`
- **Build production bundle:** `cd frontend && npm run build`
- **Run tests:** `cd frontend && npm run test`
- **Run linter:** `cd frontend && npm run lint`

### Backend
- **Install dependencies:** `cd backend && npm install`
- **Start dev server:** `cd backend && npm run dev`
- **Build production server:** `cd backend && npm run build`
- **Run tests:** `cd backend && npm run test`
- **Run linter:** `cd backend && npm run lint`
- **Generate dummy data:** `cd backend && npm run generate-dummy`

## Architectural Guidelines
### Frontend
- **Components:** Use functional components and hooks. Keep them modular and focused.
- **Styling:** Adhere to the PIBIT.AI brand guidelines.
  - Primary colors: Tech Blue (`#0684F0`), Celestial Blue (`#29A0F3`), Jet Black (`#383838`), Cloud White (`#FFFFFF`).
  - Typography: Space Grotesk (Headings), Inter (Body Text).
  - Prioritize modern, high-contrast, premium UI aesthetics.
- **Animations:** Use `framer-motion` for micro-interactions and smooth transitions.

### Backend
- **Pattern:** Follow the Controller -> Service -> Repository pattern.
  - *Controllers:* Handle HTTP requests/responses and input validation.
  - *Services:* Contain core business logic.
  - *Repositories:* Handle data persistence and MongoDB operations.
- **Database:** Uses native MongoDB driver. Avoid using Mongoose or other ORMs. Use GridFS for file storage.
- **Error Handling:** Use standardized Express error handling middleware. Always return structured JSON responses for API errors.

## Code Standards
- **TypeScript:** Enforce strict typing. Avoid using `any` type.
- **Linting:** Keep code clean according to existing ESLint configurations. Always fix lint warnings before committing.
- **Documentation:** Provide clear docstrings or comments for complex functions and business logic.
