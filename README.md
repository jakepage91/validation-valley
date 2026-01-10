<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Legacy's End - Developer Resume Game

A comprehensive RPG-style resume application built with Lit Web Components. It demonstrates modern web development practices including Clean Architecture, reactive state management, and component-driven design.

## 🏗️ Architecture

The project follows **SOLID principles** and **Clean Architecture**, with recent Phase 10 refactoring focused on code quality and maintainability.

### Key Concepts

*   **Event-Driven Architecture**: Controllers (`Quest`, `Interaction`, `GameZone`) are fully decoupled from consumers, emitting events via a global `EventBus` instead of direct callbacks.
*   **Dependency Injection**: Core services and controllers are injected via `IGameContext`, decoupling them from the main application shell.
*   **Command Pattern**: Game actions (Move, Interact, Pause) are encapsulated as Commands in a Command Bus, enabling replayability and macro recording.
*   **Use Cases**: Complex domain logic (e.g., `EvaluateChapterTransition`, `ProcessGameZoneInteraction`) is extracted into pure, testable Use Cases.
*   **State Management**: Uses **Lit Signals** (`@lit-labs/signals`) for fine-grained, reactive state management. `GameStateService` acts as the single source of truth.
*   **Web Components**: UI is built with Lit (lightweight, standard-based web components) following a strict 4-file architecture pattern.
*   **Encapsulation**: Private methods (#) and helper functions for better code organization and maintainability.

### Directory Structure

*   `src/use-cases/`: Pure business logic (e.g., Chapter Transitions, Zone Interactions).
*   `src/commands/`: Action objects for the Command Bus.
*   `src/controllers/`: Reactive controllers linking UI to logic.
*   `src/services/`: Core infrastructure (Progress, Storage, Audio).
*   `src/components/`: Lit components (Game View, HUD, Dialogs).
*   `src/managers/`: Session and game orchestration.
*   `src/setup/`: Dependency injection wiring and initialization.
*   `src/constants/`: Shared constants, including `EVENTS`.
*   `src/utils/`: Shared utilities and helpers.

## 🚀 Run Locally

**Prerequisites:** Node.js 18+

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Run the app:**
    ```bash
    npm run dev
    ```
    Currently running at http://localhost:8000 (default)

## 🧪 Testing

The project maintains a high standard of code quality with **585+ tests** passing.

*   **Run all tests:** `npm run test`
*   **Run with coverage:** `npm run test:coverage`
*   **Lint code:** `npm run lint`
*   **Type check:** `npm run lint:tsc`

## 🛠 Recent Refactors

### Phase 10: Code Quality & Encapsulation (January 2026)

Major refactoring focused on improving code quality, reducing duplication, and enhancing maintainability:

**Components Refactored:**
- ✅ **QuestHub** - Extracted `QuestCard` component, reduced from 304 to 187 lines (-38%)
- ✅ **LevelDialog** - Extracted utilities, privatized 8 methods, added extensibility hooks
- ✅ **GameView** - Privatized 5 event handlers, split `setupControllers` into 5 focused methods
- ✅ **QuestController** - Replaced console.logs with logger, extracted 2 helper methods, eliminated ~65 lines
- ✅ **GameSessionManager** - Privatized 8 event handlers, extracted 2 helpers, eliminated ~30 lines
- ✅ **LegacysEndApp** - Privatized 10 event handlers, extracted command execution helpers, eliminated ~25 lines

**Key Improvements:**
- 🔒 **23 event handlers** converted to private methods (#)
- 🧩 **8 helper methods** extracted for reusability
- 📉 **~245 lines** of duplicate code eliminated
- 🎯 **100% test coverage** maintained (585/585 tests passing)
- 🚀 **Performance optimizations** (theme application, state management)
- 📝 **Consistent logging** with logger service (no console.logs)

### Phase 9: Signal Migration (2025)
*   Refactored `GameStateService` from Observable pattern to `@lit-labs/signals`
*   Improved performance and reduced boilerplate

### Phases 6-8: Event-Driven Architecture (2025)
*   Complete migration to event-driven controllers
*   Decoupled `GameView` from `LegacysEndApp`
*   Logic extraction to Use Cases

## 📚 Documentation

*   [Project Standards](docs/PROJECT_STANDARDS.md) - Coding standards and guidelines
*   [Technical Reference](docs/TECHNICAL_REFERENCE.md) - Architecture deep dive
*   [Deployment Guide](DEPLOYMENT.md) - How to deploy

## 🤝 Contributing

Please read [PROJECT_STANDARDS.md](docs/PROJECT_STANDARDS.md) before contributing. All code must:
- Follow the 4-file component architecture
- Include comprehensive tests (80%+ coverage)
- Use JSDoc for all public APIs
- Pass all linters (Biome, TSC)
- Use private methods (#) for internal logic

## 📄 License

This project is part of a developer portfolio.
