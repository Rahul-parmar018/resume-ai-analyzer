# Candidex AI - Quality Assurance & Testing Suite

This document describes the testing setup, local execution guides, and philosophy.

---

## 🧪 Testing Infrastructure Architecture

We enforce high safety and stability through a 3-tier testing strategy:

1. **Frontend Unit & Component (Vitest + React Testing Library)**:
   - Evaluates pure business logic, helpers, and component render states in a simulated JSDOM environment.
2. **End-to-End System (Playwright)**:
   - Validates user-facing flows (Landing, Auth Login, Auth Register) inside a headless Chromium browser instance.
3. **Backend Integration (Django TestCase)**:
   - Confirms token authentication headers, role switching scopes, and database model schema updates.

---

## 🏃 Running Tests Locally

### 1. Frontend Unit / Component Tests
Navigate to the `frontend/` directory and execute:
```bash
cd frontend
npm run test
```

### 2. E2E Smoke Tests (Playwright)
To execute the smoke tests locally, make sure your dev server is running first, then trigger Playwright:
```bash
cd frontend
npm run test:e2e
```

### 3. Backend Django Integration Tests
Navigate to the workspace root and run the Django test suite runner:
```bash
python manage.py test
```

---

## 🛡️ Testing Philosophy & Goals
- **Maintainability Over Coverage**: We prioritize high-confidence tests for authentication redirects, API error utilities, and core data flows over checking 100% of static visual CSS components.
- **Independence**: All component and integration tests must run concurrently and clean up state/mocks automatically.
- **CI Enforcement**: The CI pipeline (`ci.yml`) executes frontend lints, Vitest runners, Vite builds, and Django test cases automatically on every pull request.
