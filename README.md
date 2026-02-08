# Validation Valley

> A fork of [Legacy's End](https://github.com/nicholasgriffintn/legacys-end) by [Jorge Del Casar](https://github.com/nicholasgriffintn)

We're incredibly grateful to Jorge for creating such a well-architected, beautifully designed RPG-style web application. His work on Legacy's End provided the perfect foundation for our project. The Clean Architecture, reactive state management, and component-driven design made it possible for us to focus on our content while standing on solid ground.

---

## What is Validation Valley?

**Validation Valley** is an interactive presentation built for [MetalBear](https://metalbear.co) that explores how AI code generation has shifted where software bottlenecks exist — and why validation is the answer.

### The Bottleneck Canyon Quest

Players journey through the **AI-Forged Lands**, discovering two domains under pressure:

1. **Open Source Security** — Maintainer burnout from AI-generated vulnerability reports and CVE system strain
2. **The Inner Developer Loop** — AI accelerates code generation, but developers still wait for CI/CD pipelines

The quest culminates in the **Validation Clearing**, where players discover [mirrord](https://metalbear.com/mirrord/) — a tool that enables faster, earlier, and cheaper validation by letting developers test against real environments from their local machine.

### Chapters

| Chapter | Theme |
|---------|-------|
| The AI-Forged Lands | Introduction to AI's impact on validation |
| The Flooded OSS Maintainer Gate | Bug bounty abuse and maintainer burnout |
| The Cracked Vulnerability Archive | CVE program fragility and trust erosion |
| The Endless Loop | The inner dev loop bottleneck |
| The Validation Clearing | The solution: better validation with mirrord |

---

## 🏗️ Architecture

This project inherits the excellent architecture from Legacy's End, following **SOLID principles** and **Clean Architecture**.

### Key Concepts

* **Context-Based Dependency Injection**: Services and controllers injected via `@lit/context`
* **Domain-Driven State**: Focused domain services (`HeroStateService`, `QuestStateService`, `WorldStateService`)
* **Reactive Signals**: Fine-grained reactivity with `@lit-labs/signals`
* **Use Cases**: Pure, stateless business logic classes
* **Reactive Controllers**: Bridging logic between domain services and UI
* **Web Components**: Built with Lit following a 3-4 file architecture pattern

### Directory Structure

```
src/
├── game/
│   ├── services/      # Domain state (Hero, Quest, World)
│   └── contexts/      # Domain context definitions
├── services/          # Infrastructure services (Theme, Progress, Session)
├── controllers/       # Reactive controllers
├── use-cases/         # Pure business logic
├── components/        # Lit components
├── contexts/          # Global context definitions
├── content/           # Quest content and configurations
│   └── quests/        # Quest definitions (The Bottleneck Canyon)
├── core/              # Constants, bootstrapper, events
└── utils/             # Shared utilities
```

### Changes from Original

We preserved the original architecture while adding:

| Addition | Purpose |
|----------|---------|
| `skipConfirmation` config | Allows chapters to close dialog without triggering completion |
| `mapObjects` rendering | Visual elements on the game map |
| `OPEN_URL` zone type | Interactive zones that open external links |
| `forceJumpToChapter()` | Presentation mode: jump to any chapter |
| **VictoryScreen** component | Quest completion with rewards summary and QR code |
| **Level dialog slides** | Modular slide system (content, problem, solution, analysis, etc.) |
| **QuestProgress** component | Clickable chapter navigation sidebar |
| **i18n support** | English and Spanish translations |

---

## 🚀 Run Locally

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
npm install

# Run the app
npm run dev
```

## 🌐 Localization

The project supports multiple languages via `@lit/localize`:

```bash
# Extract strings for translation
npm run localize:extract

# Build locale files
npm run localize:build
```

## 🧪 Testing

* **Run all tests:** `npm run test`
* **Run with coverage:** `npm run test:coverage`
* **Lint code:** `npm run lint`
* **Type check:** `npm run lint:tsc`

---

## 🙏 Acknowledgments

- **[Jorge Del Casar](https://github.com/nicholasgriffintn)** — Creator of Legacy's End, the foundation for this project
- **[MetalBear](https://metalbear.co)** — The team behind mirrord and this presentation

## 📄 License

This project is a fork of Legacy's End. Please refer to the original project for licensing information.

---

<div align="center">
  <strong>AI accelerates generation. Validation remains the key.</strong>
  <br><br>
  <a href="https://github.com/metalbear-co/mirrord">⭐ Star mirrord on GitHub</a>
</div>
