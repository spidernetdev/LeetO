# AI Coding Agent Guidance — LeetO Frontend

This repository contains the **Next.js 15 App Router** frontend for **LeetO**, an AI-powered DSA progress tracking platform.

## Crucial Architecture Boundaries

1. **Frontend-Only Scope**:
   * Make changes ONLY within this repository.
   * Do NOT invent or replicate backend FastAPI routes, PostgreSQL schemas, or LLM generation pipelines inside Next.js.
2. **Backend Communication**:
   * The backend runs separately at `NEXT_PUBLIC_API_BASE_URL` (default: `http://localhost:8000`).
   * Read `API_CONTRACT.md` and `docs/frontend/API_CONTRACT_AUDIT.md` before making any API modifications.
3. **No Fabricated Secrets or Data**:
   * Never store mock OAuth tokens or fabricate successful authentication when backend auth endpoints are offline.
   * Unsupported database fields (`runtimeMs`, `memoryMb`, `notes`) must remain pruned from display.
4. **Preserve Working Integration**:
   * Do NOT break existing client timeout diagnostics, deduplication (`groupProblems`), or page transitions.

## Complete Documentation Index

Before writing or editing code, read the technical documentation in `docs/frontend/`:

* **Entry Point & Onboarding**: [`docs/frontend/README.md`](./docs/frontend/README.md)
* **Architecture & Boundaries**: [`docs/frontend/ARCHITECTURE.md`](./docs/frontend/ARCHITECTURE.md)
* **File Inventory**: [`docs/frontend/DIRECTORY_STRUCTURE.md`](./docs/frontend/DIRECTORY_STRUCTURE.md)
* **Routing & Guards**: [`docs/frontend/ROUTING_AND_NAVIGATION.md`](./docs/frontend/ROUTING_AND_NAVIGATION.md)
* **Component Dictionary**: [`docs/frontend/COMPONENTS.md`](./docs/frontend/COMPONENTS.md)
* **Pages & Features**: [`docs/frontend/PAGES_AND_FEATURES.md`](./docs/frontend/PAGES_AND_FEATURES.md)
* **State Management**: [`docs/frontend/STATE_MANAGEMENT.md`](./docs/frontend/STATE_MANAGEMENT.md)
* **API Integration**: [`docs/frontend/API_INTEGRATION.md`](./docs/frontend/API_INTEGRATION.md)
* **API Contract Audit**: [`docs/frontend/API_CONTRACT_AUDIT.md`](./docs/frontend/API_CONTRACT_AUDIT.md)
* **Domain Data Models**: [`docs/frontend/DATA_MODELS.md`](./docs/frontend/DATA_MODELS.md)
* **Design System**: [`docs/frontend/DESIGN_SYSTEM.md`](./docs/frontend/DESIGN_SYSTEM.md)
* **Chrome Extension Contract**: [`docs/frontend/CHROME_EXTENSION_INTEGRATION.md`](./docs/frontend/CHROME_EXTENSION_INTEGRATION.md)
* **AI Pattern Detection**: [`docs/frontend/AI_PATTERN_DETECTION.md`](./docs/frontend/AI_PATTERN_DETECTION.md)
* **Technical Debt & Backlog**: [`docs/frontend/TECHNICAL_DEBT.md`](./docs/frontend/TECHNICAL_DEBT.md)
* **Architecture Diagrams**: [`docs/frontend/diagrams/`](./docs/frontend/diagrams/)
