# Changelog - Recent Updates

## 2026-01-06 - Type System and HotSwitchState Refactoring

### Type System Improvements
- **Unified Quest Types**: Merged `Quest` and `EnrichedQuest` into a single `Quest` type composed of `QuestData` and `QuestProgress`
- **Mandatory Fields**: Enforced mandatory fields for better type safety:
  - `QuestData`: `description`, `icon`, `difficulty` are now required
  - `LevelConfig`: `problemTitle`, `problemDesc` are now required
  - `RewardConfig` and `NpcConfig`: `name` is now required
- **Geometric Types**: Introduced `Vector2`, `Size`, and `Rect` types for better spatial definitions
- **View-Specific Types**: Defined explicit view-specific state types in `game-state-mapper.js` for better decoupling

### HotSwitchState Architecture Changes
- **Default Value**: Changed from `"legacy"` to `null` across the application
  - `GameStateService` now initializes with `null`
  - `InteractionController` defaults to `null`
  - `HeroProfile` initializes with empty string `""`
- **Removed Automatic Assignment**: `GameSessionManager` no longer automatically sets `hotSwitchState` based on `serviceType`
- **Explicit State Management**: `hotSwitchState` now remains `null` unless explicitly set by:
  - Zone interactions (via `GameZoneController`)
  - User actions (manual switching)
- **Fallback Removal**: Removed `|| "legacy"` fallbacks from:
  - `game-viewport.js` hero-profile binding
  - `legacys-end-app.js` service selection
- **Styling Impact**: Empty or `null` `hotSwitchState` no longer applies `injection-*-api` classes

### Component Refactoring
- **LevelDialog Simplification**:
  - Removed `hotSwitchState` property
  - Removed "CONTROL CONSOLE" slide
  - Removed `isFinalBoss` conditional logic
  - Removed `dispatchToggleHotSwitch()` method
  - Simplified confirmation slide to always show "Level Complete!" with reward
  - Button text always shows "EVOLVE" instead of conditional "COMPLETE"/"EVOLVE"

### Testing Updates
- Updated all test mocks to reflect `null` as default `hotSwitchState`
- All tests passing (319 passed, 1 skipped)
- All lints passing (biome, lit-analyzer, tsc)

### Documentation Updates
- Updated `TECHNICAL_REFERENCE.md` to reflect:
  - New `hotSwitchState` default behavior
  - Removal of automatic assignment in `GameSessionManager`
  - Simplified `LevelDialog` structure
  - Updated `InteractionController` logic

## Impact
These changes improve the architecture by:
1. **Explicit State Management**: State is only set when needed, not by default
2. **Better Type Safety**: Mandatory fields prevent incomplete configurations
3. **Simplified Components**: Removed unnecessary conditional logic
4. **Clearer Intent**: `null` state clearly indicates "no active context" vs implicit "legacy"
