import { Difficulty } from "../quest-types.js";
import { THE_ORACLE_OF_SILICON_CHAPTERS } from "./chapters.js";

/**
 * The Oracle of Silicon Quest Metadata
 *
 * Use Built-in AI to interact with the world through intent and speech.
 */
/** @type {import("../quest-types.js").Quest} */
export const THE_ORACLE_OF_SILICON_QUEST = {
	id: "the-oracle-of-silicon",
	name: "The Oracle of Silicon",
	subtitle: "Harnessing the Built-in Machine Voice",
	description:
		"Deep within the Whispering Caverns, Alarion encounters an ancient construct: The Echo. To progress, he must move beyond rigid commands and learn to speak with pure intent through the machine's voice. Master the Digital Oracle.",
	legacyProblem:
		"Rigid 'if/else' command matching that fails on natural language. Lack of accessibility through voice.",
	prerequisites: /** @type {any[]} */ ([]),
	shortcuts: /** @type {string[]} */ ([]),
	difficulty: Difficulty.ADVANCED,
	icon: "microchip",
	estimatedTime: "15-20 min",
	levels: "5 intent-driven levels",
	concepts: ["Built-in AI", "Prompt API", "Web Speech API", "Intent Parsing"],

	// Chapter IDs
	chapterIds: [
		"deaf-ear",
		"the-parrot",
		"babel-fish",
		"context-key",
		"hallucination-shield",
	],

	// Chapter data
	chapters: THE_ORACLE_OF_SILICON_CHAPTERS,

	reward: {
		badge: "Silver Tongue",
		description: "Ability to control the game via natural language and voice",
		ability: "Command Override",
	},
	status: "coming-soon",
};
