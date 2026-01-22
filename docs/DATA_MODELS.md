# Data Models & Schema Registry

This document catalogs the primary data models, interfaces, and schemas used across the Legacy's End application. Following a major refactoring, the codebase is now strictly typed using JSDoc and TypeScript literal unions.

## 1. Quest & Content Models
Defined primarily in [quest-types.js](../src/content/quests/quest-types.js).

| Model | Description | Key Properties & Typed Unions |
| :--- | :--- | :--- |
| **Quest** | Complete quest data including metadata and completion status. | `id`, `difficulty`: **DifficultyType**, `status`: **QuestStatus**, `chapters` |
| **Chapter** | A single interactive level. Alias for `LevelConfig`. | `id`, `title`, `problemDesc`: **string \| TemplateResult** |
| **LevelConfig** | Detailed level configuration for NPCs, rewards, and world geometry. | `npc`, `reward`, `zones`, `obstacles`, `serviceType`: **ServiceBrand** |
| **NpcConfig** | Configuration for interactive NPCs with logic requirements. | `name`, `requirements` (Record of conditions) |
| **RewardConfig** | Configuration for collectible items. | `name`, `image`, `position` |
| **Zone** | Interactive triggers (e.g., level exits, dialogue triggers). | `x`, `y`, `type`: **ZoneType**, `payload`: **JsonValue** |
| **CodeSnippet** | Code metadata for architectural reviews. | `title`, `code`, `language` (default: 'js') |

### 🧩 Core Literal Unions

- **QuestStatus**: `'available' | 'coming_soon' | 'locked'`
- **DifficultyType**: `'beginner' | 'intermediate' | 'advanced' | 'expert'`
- **ZoneType**: `'THEME_CHANGE' | 'CONTEXT_CHANGE' | 'NONE'`
- **ServiceBrand**: `'Legacy API' | 'Mock Service' | 'New V2 API'`

## 2. Persistence & Progress Models
Defined in [progress-service.js](../src/services/progress-service.js).

| Model | Description | Persistence Detail |
| :--- | :--- | :--- |
| **ProgressState** | Root object for all persistent user data. | `completedQuests`, `unlockedQuests`, `achievements`, `chapterStates` |
| **ProgressStats** | Aggregate metrics for player progression. | Calculated on-the-fly or stored in `ProgressState`. |
| **JsonValue** | Strict type for JSON-serializable data. | `string \| number \| boolean \| null \| Object \| Array` |

## 3. Service Interfaces (Service Layer)
Defined in [interfaces.js](../src/services/interfaces.js).

| Interface | Purpose | Implementation |
| :--- | :--- | :--- |
| **IProgressService** | Persistence logic for quest advancement. | `ProgressService` |
| **IQuestController** | State machine for navigation and game flow. | `QuestController` |
| **IStorageAdapter** | Persistence abstraction (e.g., LocalStorage). | `LocalStorageAdapter` |
| **IGameConfiguration** | Provides read-only access to app settings. | `GameConfigurationService` |

## 4. Game Domain (Signals & Reactive State)
Defined in [game/interfaces.js](../src/game/interfaces.js).

| Interface | Reactive State Purpose | Consumers |
| :--- | :--- | :--- |
| **IHeroStateService** | Hero-specific signals (pos, evolution). | `HeroComponent` |
| **IQuestStateService** | Progression-related UI signals. | `AppHeader`, `QuestHub` |
| **IWorldStateService** | Global world flags (pause, dialog visibility). | `LegacysEndApp` |

## 5. Intelligence & Specialized Models

| Model | Context | Location |
| :--- | :--- | :--- |
| **AIModelSession** | Interface for the Prompt API session. | `src/services/interfaces.js` |
| **AIDownloadProgressEvent** | Progress tracking for AI models. | `src/services/interfaces.js` |
| **VoiceContext** | Game context provided to AI for command analysis. | `src/controllers/voice-controller.js` |
| **Box** | Boundary box for geometry (`{x, y, width, height}`). | `src/controllers/collision-controller.js` |

## 6. Type Conventions (Legacy vs Heroic)

> [!IMPORTANT]
> **No `any` Policy**: The use of `any` has been systematically eliminated from the core schema.
> - `Object` has been replaced by `JsonValue` or specific interfaces.
> - `EnrichedQuest` has been unified into **`Quest`**.
> - `problemDesc` now supports **`TemplateResult`** for rich HTML narration.
