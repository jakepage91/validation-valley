import { msg } from "@lit/localize";
import { getMirrorOfVeracityMetadata } from "../quest-manifest.js";
import { getMirrorOfVeracityChapters } from "./chapters.js";

/** @returns {import("../quest-types.js").Quest} */
export const getMirrorOfVeracityQuest = () => ({
	...getMirrorOfVeracityMetadata(),
	legacyProblem: msg(
		"Code is fragile, prone to regression bugs, and lacks automated verification.",
	),
	shortcuts: /** @type {string[]} */ ([]),
	concepts: [
		msg("Testing Pyramid"),
		msg("Unit Testing"),
		msg("Integration Testing"),
		msg("Mocking"),
		msg("TDD"),
	],
	chapterIds: /** @type {string[]} */ ([]),
	// Chapter data
	chapters: getMirrorOfVeracityChapters(),
	reward: {
		badge: msg("Truth Seeker"),
		description: msg(
			"A shielded component, verified and resistant to regressions",
		),
		ability: msg("Automated Verification"),
	},
	status: "coming_soon",
});

/** @deprecated Use getMirrorOfVeracityQuest() instead */
export const THE_MIRROR_OF_VERACITY_QUEST = getMirrorOfVeracityQuest();
