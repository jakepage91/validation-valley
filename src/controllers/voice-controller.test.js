import { beforeEach, describe, expect, it, vi } from "vitest";
import { VoiceController } from "./voice-controller.js";

// Mock dependencies
const mockVoiceSynthesisService = {
	speak: vi.fn().mockResolvedValue(undefined),
	cancel: vi.fn(),
	getBestVoice: vi.fn(),
	getSpeakingStatus: vi.fn().mockReturnValue(false),
};

const mockAIService = {
	checkAvailability: vi.fn().mockResolvedValue("available"),
	createSession: vi.fn().mockResolvedValue(undefined),
	getSession: vi.fn(),
	destroySession: vi.fn(),
	hasSession: vi.fn().mockReturnValue(true),
};

describe("VoiceController", () => {
	/** @type {any} */
	let host;
	/** @type {VoiceController} */
	let controller;
	/** @type {any} */
	let options;

	beforeEach(() => {
		host = {
			addController: vi.fn(),
			requestUpdate: vi.fn(),
		};

		options = {
			aiService: mockAIService,
			voiceSynthesisService: mockVoiceSynthesisService,
			logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
			onMoveToNpc: vi.fn(),
			onMoveToExit: vi.fn(),
			onGetDialogText: vi.fn().mockReturnValue("Hello world"),
			onGetContext: vi
				.fn()
				.mockReturnValue({ isDialogOpen: false, isRewardCollected: false }),
			onInteract: vi.fn().mockResolvedValue(undefined),
			onNextSlide: vi.fn().mockResolvedValue(undefined),
			isEnabled: vi.fn().mockReturnValue(true),
		};

		// Mock SpeechRecognition
		class SpeechRecognitionMock {
			constructor() {
				this.start = vi.fn();
				this.stop = vi.fn();
				this.lang = "en-US";
			}
		}
		vi.stubGlobal("SpeechRecognition", SpeechRecognitionMock);
		vi.stubGlobal("webkitSpeechRecognition", SpeechRecognitionMock);

		controller = new VoiceController(host, options);
	});

	describe("processCommand", () => {
		it("should use DialogueGenerationService to process commands", async () => {
			const mockSession = {
				prompt: vi
					.fn()
					.mockResolvedValue('{"action": "interact", "feedback": "Hi"}'),
			};
			mockAIService.getSession.mockReturnValue(mockSession);

			await controller.processCommand("hello");

			expect(mockSession.prompt).toHaveBeenCalledWith(
				expect.stringContaining("hello"),
			);
			expect(mockVoiceSynthesisService.speak).toHaveBeenCalledWith(
				"Hi",
				expect.any(Object),
			);
		});
	});

	describe("executeAction", () => {
		it("should handle 'move_to_npc'", async () => {
			await controller.executeAction("move_to_npc", null);
			expect(options.onMoveToNpc).toHaveBeenCalled();
		});

		it("should handle 'interact' and speak", async () => {
			vi.useFakeTimers();
			const promise = controller.executeAction("interact", null);

			// Simulate the delay in setup-voice for state update
			await vi.advanceTimersByTimeAsync(400);
			await promise;

			expect(options.onInteract).toHaveBeenCalled();
			expect(mockVoiceSynthesisService.speak).toHaveBeenCalled();
			vi.useRealTimers();
		});

		it("should handle 'next_slide' with prefetching", async () => {
			const mockSession = { prompt: vi.fn().mockResolvedValue("NPC says hi") };
			mockAIService.getSession.mockReturnValue(mockSession);
			options.onGetNextDialogText = vi.fn().mockReturnValue("Next line");

			await controller.executeAction("next_slide", null);

			expect(options.onNextSlide).toHaveBeenCalled();
			// Prefetch should have been triggered
			expect(mockSession.prompt).toHaveBeenCalledWith(
				expect.stringContaining("Next line"),
			);
		});
	});

	describe("speak", () => {
		it("should apply voice profiles correctly", async () => {
			await controller.speak("Hello", "en-US", "hero");

			expect(mockVoiceSynthesisService.getBestVoice).toHaveBeenCalledWith(
				"en-US",
				expect.any(Array),
			);
			expect(mockVoiceSynthesisService.speak).toHaveBeenCalledWith(
				"Hello",
				expect.objectContaining({
					lang: "en-US",
					rate: 1.1,
				}),
			);
		});
	});
});
