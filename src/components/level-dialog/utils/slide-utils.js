import { LevelDialogSlideAnalysis } from "../slides/analysis/LevelDialogSlideAnalysis.js";
import { LevelDialogSlideCode } from "../slides/code/LevelDialogSlideCode.js";
import { LevelDialogSlideCommonDenominator } from "../slides/common-denominator/LevelDialogSlideCommonDenominator.js";
import { LevelDialogSlideConfirmation } from "../slides/confirmation/LevelDialogSlideConfirmation.js";
import { LevelDialogSlideContent } from "../slides/content/LevelDialogSlideContent.js";
import { LevelDialogSlideNarrative } from "../slides/narrative/LevelDialogSlideNarrative.js";
import { LevelDialogSlideProblem } from "../slides/problem/LevelDialogSlideProblem.js";
import { LevelDialogSlideSolution } from "../slides/solution/LevelDialogSlideSolution.js";

/**
 * @typedef {import('../../../content/quests/quest-types.js').LevelConfig} LevelConfig
 */

/**
 * Gets text for a specific slide type
 * @param {string} type
 * @param {LevelConfig} config
 * @returns {string}
 */
export function getSlideText(type, config) {
	if (!config) return "";

	// Handle content-N slides
	if (type.startsWith("content-")) {
		const index = parseInt(type.split("-")[1] ?? "0", 10);
		return LevelDialogSlideContent.getAccessibilityText(config, index);
	}

	switch (type) {
		case "narrative":
			return LevelDialogSlideNarrative.getAccessibilityText(config);
		case "problem":
			return LevelDialogSlideProblem.getAccessibilityText(config);
		case "code-start":
			return LevelDialogSlideCode.getAccessibilityText(config, "start");
		case "code-end":
			return LevelDialogSlideCode.getAccessibilityText(config, "end");
		case "solution":
			return LevelDialogSlideSolution.getAccessibilityText(config);
		case "common-denominator":
			return LevelDialogSlideCommonDenominator.getAccessibilityText(config);
		case "analysis":
			return LevelDialogSlideAnalysis.getAccessibilityText(config);
		case "confirmation":
			return LevelDialogSlideConfirmation.getAccessibilityText(config);
		default:
			return "";
	}
}

/**
 * Builds the sequence of slides based on available config data
 * @param {LevelConfig} config
 * @returns {string[]} Array of slide type identifiers
 */
export function getSlides(config) {
	if (!config) return ["confirmation"];

	const sequence = [];
	if (config.description) {
		sequence.push("narrative");
	}
	if (config.codeSnippets?.start) {
		sequence.push("code-start");
	}
	if (config.problemDesc) {
		sequence.push("problem");
	}
	if (config.codeSnippets?.end) {
		sequence.push("code-end");
	}
	if (config.solutionDesc) {
		sequence.push("solution");
	}
	if (config.commonDenominator) {
		sequence.push("common-denominator");
	}
	// Add content slides (flexible array of HTML templates)
	if (config.contentSlides && config.contentSlides.length > 0) {
		config.contentSlides.forEach((_, index) => {
			sequence.push(`content-${index}`);
		});
	}
	if (config.architecturalChanges && config.architecturalChanges.length > 0) {
		sequence.push("analysis");
	}
	// Add timeline slide before confirmation if enabled (shows journey overview)
	if (config.showTimeline) {
		sequence.push("timeline");
	}
	// Skip confirmation slide if explicitly disabled (useful for chapters where completion happens via exit zone)
	if (!config.skipConfirmation) {
		sequence.push("confirmation");
	}
	return sequence;
}
