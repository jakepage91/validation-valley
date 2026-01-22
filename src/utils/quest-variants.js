import { msg } from "@lit/localize";
import { Difficulty } from "../content/quests/quest-types.js";

/** @typedef {import('../content/quests/quest-types.js').DifficultyType} DifficultyType */

/**
 * @typedef {import('../content/quests/quest-types.js').Quest} Quest
 */

/**
 * Gets the variant for a quest card based on its state
 * @param {Quest} quest - The quest to get the variant for
 * @returns {"success" | "neutral" | "brand"} The variant name
 */
export function getQuestVariant(quest) {
	if (quest.isCompleted) return "success";
	if (quest.isLocked) return "neutral";
	return "brand";
}

/**
 * Gets the variant for a difficulty badge
 * @param {DifficultyType} [difficulty=Difficulty.BEGINNER] - The difficulty level
 * @returns {"success" | "warning" | "danger" | "neutral"} The variant name
 */
export function getDifficultyVariant(difficulty = Difficulty.BEGINNER) {
	switch (difficulty) {
		case Difficulty.BEGINNER:
			return "success";
		case Difficulty.INTERMEDIATE:
			return "warning";
		case Difficulty.ADVANCED:
			return "danger";
		case Difficulty.EXPERT:
			return "danger";
		default:
			return "neutral";
	}
}

/**
 * Gets the localized label for a difficulty level
 * @param {DifficultyType} [difficulty=Difficulty.BEGINNER] - The difficulty level
 * @returns {string} The localized label
 */
export function getDifficultyLabel(difficulty = Difficulty.BEGINNER) {
	switch (difficulty) {
		case Difficulty.BEGINNER:
			return msg("Beginner");
		case Difficulty.INTERMEDIATE:
			return msg("Intermediate");
		case Difficulty.ADVANCED:
			return msg("Advanced");
		case Difficulty.EXPERT:
			return msg("Expert");
		default:
			return /** @type {string} */ (difficulty);
	}
}
