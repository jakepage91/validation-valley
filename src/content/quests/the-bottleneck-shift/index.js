import { msg } from "@lit/localize";
import { getBottleneckShiftMetadata } from "../quest-manifest.js";
import { getBottleneckShiftChapters } from "./chapters.js";

/**
 * The Bottleneck Shift Quest
 *
 * AI increases generation speed; validation becomes the bottleneck.
 * A journey through open source security and the inner developer loop.
 */
export const getBottleneckShiftQuest = () => ({
	...getBottleneckShiftMetadata(),
	legacyProblem: msg(
		"AI accelerates generation but doesn't address validation. The bottleneck has shifted.",
	),
	shortcuts: /** @type {string[]} */ ([]),
	levels: msg("8 chapters"),
	concepts: [
		msg("Validation"),
		msg("AI Generation"),
		msg("Developer Experience"),
		msg("Open Source Security"),
	],

	// Chapter IDs - the player walks through these in order
	chapterIds: [
		"entrance-valley",
		"curl-maintainers-hut",
		"cve-tower",
		"dev-loop-mines",
		"pattern-peak",
		"validation-springs",
		"mirrord-workshop",
		"path-forward",
	],

	// Chapter data
	chapters: getBottleneckShiftChapters(),

	reward: {
		badge: msg("Validation Master"),
		description: msg("Understood the shift from generation to validation"),
		ability: msg("Earlier, Closer to Reality, Cheaper to Fail"),
	},
});
