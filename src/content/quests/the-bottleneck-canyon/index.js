import { msg } from "@lit/localize";
import { getBottleneckCanyonMetadata } from "../quest-manifest.js";
import { getBottleneckCanyonChapters } from "./chapters.js";

/**
 * The Bottleneck Canyon Quest
 *
 * A journey through the AI-Forged Lands where AI code generation
 * has shifted where software bottlenecks exist—but has not eliminated
 * the need for validation. In fact, it has amplified it.
 *
 * Explores two domains: open source security and the inner developer loop.
 */
export const getBottleneckCanyonQuest = () => ({
	...getBottleneckCanyonMetadata(),
	legacyProblem: msg(
		"AI accelerates generation but doesn't address validation. The bottleneck has shifted—and validation is now the constraint.",
	),
	shortcuts: /** @type {string[]} */ ([]),
	levels: msg("5 chapters"),
	concepts: [
		msg("Open Source Security"),
		msg("CVE System"),
		msg("Inner Developer Loop"),
		msg("Validation Workflows"),
		msg("mirrord"),
	],

	// Chapter IDs - the traveler walks through these in order
	chapterIds: [
		"ai-forged-lands",
		"flooded-gate",
		"cracked-archive",
		"endless-loop",
		"validation-clearing",
	],

	// Chapter data
	chapters: getBottleneckCanyonChapters(),

	reward: {
		badge: msg("Canyon Navigator"),
		description: msg(
			"Understood how AI shifts bottlenecks and why validation is the answer",
		),
		ability: msg("Earlier, Closer to Reality, Cheaper to Fail"),
	},
});
