import { describe, expect, it, vi } from "vitest";
import { VoiceController } from "../controllers/voice-controller.js";
import { setupVoice } from "./setup-voice.js";

// Mock dependencies
vi.mock("../controllers/voice-controller.js");

describe("setupVoice", () => {
	it("should initialize VoiceController with correct options including next/prev slide calling host methods", () => {
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
			// commandBus removed

			gameState: { getState: () => ({}) },
			questController: {},
			worldState: {
				isPaused: { get: () => false },
				setCurrentDialogText: vi.fn(),
				showDialog: { get: () => false },
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
