import { describe, expect, it, vi } from "vitest";
import { VoiceController } from "../controllers/voice-controller.js";
import { setupVoice } from "./setup-voice.js";

// Mock dependencies
vi.mock("../controllers/voice-controller.js");

describe("setupVoice", () => {
	it("should initialize VoiceController with correct options", () => {
		const host = {
			addController: vi.fn(),
			requestUpdate: vi.fn(),
			nextDialogSlide: vi.fn(),
			prevDialogSlide: vi.fn(),
		};
		const context = {
			logger: {},
			aiService: {},
			voiceSynthesisService: {},
			questController: { currentChapter: { title: "Test" } },
			worldState: {
				isPaused: { get: () => false },
				setCurrentDialogText: vi.fn(),
				setNextDialogText: vi.fn(),
				showDialog: { get: () => false },
				currentDialogText: { get: () => "Test dialog" },
				nextDialogText: { get: () => "Next dialog" },
			},
			questState: {
				isRewardCollected: { get: () => false },
			},
		};

		setupVoice(/** @type {any} */ (host), /** @type {any} */ (context));

		expect(VoiceController).toHaveBeenCalledWith(
			host,
			expect.objectContaining({
				onNextSlide: expect.any(Function),
				onPrevSlide: expect.any(Function),
				onGetDialogText: expect.any(Function),
				onGetNextDialogText: expect.any(Function),
			}),
		);

		// Verify callbacks call host methods
		// @ts-expect-error
		const voiceControllerCall = VoiceController.mock.calls[0];
		const options = voiceControllerCall[1];

		// Test next slide callback
		options.onNextSlide();
		expect(host.nextDialogSlide).toHaveBeenCalled();

		// Test prev slide callback
		options.onPrevSlide();
		expect(host.prevDialogSlide).toHaveBeenCalled();
	});
});
