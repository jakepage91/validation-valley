import { beforeEach, describe, expect, it, vi } from "vitest";
import { setupControllers } from "./controllers.js";

describe("Controllers Setup", () => {
	let mockApp;

	beforeEach(() => {
		// Create a minimal mock app with all required properties and methods
		mockApp = {
			// Properties
			isEvolving: false,
			showDialog: false,
			isPaused: false,
			isInHub: false,
			chapterId: "test-chapter",
			hasCollectedItem: false,
			heroPos: { x: 0, y: 0 },
			themeMode: "dark",
			hotSwitchState: "default",
			userData: null,
			userError: null,
			showQuestCompleteDialog: false,
			currentQuest: { id: "test-quest" },
			services: [],

			// Controllers (will be set by setupControllers)
			keyboard: null,
			debug: null,
			voice: null,
			zones: null,
			collision: null,
			serviceController: null,
			characterContexts: null,
			interaction: null,
			questController: null,

			// Methods
			handleMove: vi.fn(),
			handleInteract: vi.fn(),
			togglePause: vi.fn(),
			getChapterData: vi.fn(() => ({
				id: "test-chapter",
				npc: { position: { x: 50, y: 50 } },
				exitZone: { x: 90, y: 50 },
			})),
			triggerLevelTransition: vi.fn(),
			applyTheme: vi.fn(),
			getActiveService: vi.fn(() => null),

			// State management
			gameState: {
				setCollectedItem: vi.fn(),
				setHeroPosition: vi.fn(),
				setThemeMode: vi.fn(),
				setHotSwitchState: vi.fn(),
				setLockedMessage: vi.fn(),
			},

			// Progress service
			progressService: {
				getProgress: vi.fn(() => ({})),
				resetProgress: vi.fn(),
				updateChapterState: vi.fn(),
			},

			// Session manager
			sessionManager: {
				loadChapter: vi.fn(),
				startQuest: vi.fn(),
				completeQuest: vi.fn(),
				completeChapter: vi.fn(),
				returnToHub: vi.fn(),
				moveTo: vi.fn(),
				subscribe: vi.fn(),
				getQuestControllerCallbacks: vi.fn(() => ({
					onQuestStart: vi.fn(),
					onQuestComplete: vi.fn(),
				})),
				options: {},
			},

			// Router
			router: {},

			// Shadow root mock
			shadowRoot: {
				querySelector: vi.fn(() => ({
					shadowRoot: {
						querySelector: vi.fn(() => null),
					},
				})),
			},

			// Reactive controller host methods
			addController: vi.fn(),
			requestUpdate: vi.fn(),
		};
	});

	describe("Controller Initialization", () => {
		it("should initialize all controllers without errors", () => {
			expect(() => setupControllers(mockApp)).not.toThrow();
		});

		it("should initialize KeyboardController", () => {
			setupControllers(mockApp);
			expect(mockApp.keyboard).toBeDefined();
			expect(mockApp.addController).toHaveBeenCalled();
		});

		it("should initialize DebugController", () => {
			setupControllers(mockApp);
			expect(mockApp.debug).toBeDefined();
		});

		it("should initialize VoiceController", () => {
			setupControllers(mockApp);
			expect(mockApp.voice).toBeDefined();
		});

		it("should initialize GameZoneController", () => {
			setupControllers(mockApp);
			expect(mockApp.zones).toBeDefined();
		});

		it("should initialize CollisionController", () => {
			setupControllers(mockApp);
			expect(mockApp.collision).toBeDefined();
		});

		it("should initialize ServiceController", () => {
			setupControllers(mockApp);
			expect(mockApp.serviceController).toBeDefined();
		});

		it("should initialize CharacterContextController", () => {
			setupControllers(mockApp);
			expect(mockApp.characterContexts).toBeDefined();
		});

		it("should initialize InteractionController", () => {
			setupControllers(mockApp);
			expect(mockApp.interaction).toBeDefined();
		});

		it("should initialize QuestController", () => {
			setupControllers(mockApp);
			expect(mockApp.questController).toBeDefined();
		});
	});

	describe("KeyboardController Options", () => {
		it("should configure keyboard with correct callbacks", () => {
			setupControllers(mockApp);

			// Test onMove callback
			mockApp.keyboard.options.onMove(5, 10);
			expect(mockApp.handleMove).toHaveBeenCalledWith(5, 10);

			// Test onInteract callback
			mockApp.keyboard.options.onInteract();
			expect(mockApp.handleInteract).toHaveBeenCalled();

			// Test onPause callback
			mockApp.keyboard.options.onPause();
			expect(mockApp.togglePause).toHaveBeenCalled();
		});

		it("should configure keyboard isEnabled correctly", () => {
			setupControllers(mockApp);

			// Should be enabled when all flags are false
			expect(mockApp.keyboard.options.isEnabled()).toBe(true);

			// Should be disabled when dialog is shown
			mockApp.showDialog = true;
			expect(mockApp.keyboard.options.isEnabled()).toBe(false);
		});
	});

	describe("SessionManager Integration", () => {
		it("should update session manager with controller references", () => {
			setupControllers(mockApp);

			expect(mockApp.sessionManager.options.questController).toBe(
				mockApp.questController,
			);
			expect(mockApp.sessionManager.options.router).toBe(mockApp.router);
			expect(mockApp.sessionManager.options.controllers).toBeDefined();
			expect(mockApp.sessionManager.options.controllers.keyboard).toBe(
				mockApp.keyboard,
			);
		});
	});

	describe("InteractionController Options", () => {
		it("should configure interaction callbacks", () => {
			setupControllers(mockApp);

			// Test onShowDialog
			mockApp.interaction.options.onShowDialog();
			expect(mockApp.showDialog).toBe(true);

			// Test onVictory
			mockApp.interaction.options.onVictory();
			expect(mockApp.gameState.setCollectedItem).toHaveBeenCalledWith(true);
		});
	});

	describe("QuestController Integration", () => {
		it("should configure quest controller with progress service", () => {
			setupControllers(mockApp);
			expect(mockApp.questController.progressService).toBe(
				mockApp.progressService,
			);
		});

		it("should configure quest complete callback", () => {
			setupControllers(mockApp);

			const mockQuest = { id: "test-quest", name: "Test Quest" };
			mockApp.questController.options.onQuestComplete(mockQuest);

			expect(mockApp.showQuestCompleteDialog).toBe(true);
		});
	});
});
