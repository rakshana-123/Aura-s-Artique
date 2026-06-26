# Repository Guidelines

## Project Structure & Module Organization

This repository contains a full-stack marketplace app split into `backend/` and `frontend/`. The backend is a Spring Boot 3.5 Java 17 service with source under `backend/src/main/java/com/snapframe/marketplace/`, organized by `controller`, `model`, `repository`, `security`, and `config`. Backend configuration lives in `backend/src/main/resources/application.yml`; tests live in `backend/src/test/java/`. The frontend is a Next.js 16 app under `frontend/src/`, with route pages in `frontend/src/app/`, shared UI in `frontend/src/components/`, context providers in `frontend/src/context/`, and static assets in `frontend/public/`. Read `frontend/AGENTS.md` before frontend edits.

## Build, Test, and Development Commands

- `cd backend && .\mvnw.cmd spring-boot:run`: run the API.
- `cd backend && .\mvnw.cmd test`: run Spring Boot and JUnit tests.
- `cd backend && .\mvnw.cmd package`: compile, test, and build the backend artifact.
- `cd frontend && npm install`: install frontend dependencies from `package-lock.json`.
- `cd frontend && npm run dev`: start the Next.js dev server on port 3000.
- `cd frontend && npm run build`: create a production frontend build.
- `cd frontend && npm run lint`: run ESLint.

## Coding Style & Naming Conventions

Use Java package names under `com.snapframe.marketplace` and keep Spring stereotypes in their current folders: controllers end with `Controller`, repositories end with `Repository`, and entities use singular nouns such as `Order` or `InventoryItem`. Prefer 4-space Java indentation. Frontend code uses TypeScript, React components in `PascalCase`, hooks/context names in `camelCase` or `PascalCase`, and route folders that match URL segments. Keep styling in `globals.css` or component-local class names using the existing Tailwind setup.

## Testing Guidelines

Backend tests use Spring Boot Test and JUnit via Maven. Place new tests in the matching package under `backend/src/test/java/`, and name integration smoke tests with the `*Tests` suffix. The frontend currently has linting but no dedicated test runner; for UI changes, run `npm run lint` and `npm run build`, then manually verify the affected route.

## Commit & Pull Request Guidelines

The current Git history only contains `first commit`, so use clear, imperative commit subjects such as `Add cart checkout validation` or `Fix JWT filter error handling`. Keep commits focused by backend/frontend concern. Pull requests should include a summary, testing performed, linked issue or task when available, and screenshots for visible frontend changes.

## Security & Configuration Tips

Do not commit secrets or local database credentials. Keep environment-specific settings out of source when possible, and review changes to `application.yml`, authentication, JWT handling, and Spring Security configuration carefully.
