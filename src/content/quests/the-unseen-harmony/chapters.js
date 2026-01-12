/**
 * @typedef {import("../quest-types.js").LevelConfig} LevelConfig
 */

/** @type {Record<string, LevelConfig>} */
export const THE_UNSEEN_HARMONY_CHAPTERS = {
	"fog-of-silence": {
		id: "fog-of-silence",
		title: "The Fog of Silence",
		description:
			"Alarion enters a thick fog where sight is useless. He must learn to navigate using inner resonance and digital echoes. Master the basics of Keyboard Navigation and ARIA Labels.",
		problemTitle: "The Invisible Maze",
		problemDesc:
			"The interface is a maze with no signs, invisible to those who cannot see with eyes.",
		solutionTitle: "The Guided Path",
		solutionDesc:
			"By adding semantic labels and logical focus flow, the path becomes clear even in the darkest fog.",
		startPos: { x: 50, y: 15 },
		npc: {
			name: "The Blind Guide",
			image: "/assets/the-unseen-harmony/npc.png",
			position: { x: 50, y: 40 },
		},
		reward: {
			name: "Sonar Ring",
			image: "/assets/the-unseen-harmony/reward.png",
			position: { x: 60, y: 45 },
		},
	},
	"echo-chamber": {
		id: "echo-chamber",
		title: "The Echo Chamber",
		description:
			"In the Echo Chamber, every change in the world must be announced to those listening. Learn to use ARIA Live Regions and Focus Management to harmonize the experience.",
		problemTitle: "Silent Changes",
		problemDesc:
			"Things happen in the shadow, but the Echoes remain silent, leaving the player lost.",
		solutionTitle: "Resonant Truth",
		solutionDesc:
			"With Live Regions, the world's pulse is heard by all, ensuring no event goes unnoticed.",
		startPos: { x: 50, y: 15 },
		npc: {
			name: "The Blind Guide",
			image: "/assets/the-unseen-harmony/npc.png",
			position: { x: 50, y: 40 },
		},
		reward: {
			name: "Vibrating Sigil",
			image: "/assets/the-unseen-harmony/reward.png",
			position: { x: 60, y: 45 },
		},
	},
};
