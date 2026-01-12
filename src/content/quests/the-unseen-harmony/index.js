import { Difficulty } from "../quest-types.js";
import { THE_UNSEEN_HARMONY_CHAPTERS } from "./chapters.js";

/**
 * The Unseen Harmony Quest Metadata
 *
 * Teaches A11y, ARIA, and Focus Management.
 */
/** @type {import("../quest-types.js").Quest} */
export const THE_UNSEEN_HARMONY_QUEST = {
	id: "the-unseen-harmony",
	name: "The Unseen Harmony",
	subtitle: "Navigating the Invisible Realm",
	description:
		"A magical fog has blinded the realm. Your eyes are useless here. You must learn to navigate the world through the Resonant Echoes, guiding those who perceive the code differently safely through the interface. Find logic where there is no sight.",
	legacyProblem:
		"Inaccessible application, keyboard traps, lack of screen reader support.",
	prerequisites: ["the-aura-of-sovereignty"],
	shortcuts: [],
	difficulty: Difficulty.INTERMEDIATE,
	icon: "universal-access",
	estimatedTime: "25-35 min",
	concepts: [
		"ARIA Live Regions",
		"Focus Management",
		"Semantic HTML",
		"Screen Readers",
		"Keyboard Navigation",
	],

	// Chapter IDs
	chapterIds: ["fog-of-silence", "echo-chamber"],

	// Chapter data
	chapters: THE_UNSEEN_HARMONY_CHAPTERS,

	reward: {
		badge: "Blindseer's Lens",
		description: "An accessible component, usable by all",
		ability: "Universal Perception",
	},
	status: "coming-soon",
};
