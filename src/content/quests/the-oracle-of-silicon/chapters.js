/**
 * The Oracle of Silicon Quest Chapters
 */
/**
 * @typedef {import("../quest-types.js").LevelConfig} LevelConfig
 */

/** @type {Record<string, LevelConfig>} */
export const THE_ORACLE_OF_SILICON_CHAPTERS = {
	"deaf-ear": {
		id: "deaf-ear",
		title: "The Deaf Ear",
		description: "Fix a browser permission error blocking the microphone.",
		problemTitle: "The Muted Prophet",
		problemDesc:
			"The Oracle cannot hear your pleas because the gates of the browser are locked tight. You must unlock the voice channel.",
		solutionTitle: "Voice Channel Open",
		solutionDesc:
			"You've successfully requested and handled microphone permissions, allowing the Oracle to hear the intent behind the whispers.",
		startPos: { x: 50, y: 50 },
		npc: {
			name: "The Echo",
			image: "/assets/the-oracle-of-silicon/npc.png",
			position: { x: 40, y: 55 },
		},
		reward: {
			name: "Voice Harmonizer",
			image: "/assets/the-oracle-of-silicon/reward.png",
			position: { x: 40, y: 40 },
		},
	},
	"the-parrot": {
		id: "the-parrot",
		title: "The Parrot",
		description: "Implement speech synthesis to make the game talk back.",
		problemTitle: "Silent Echoes",
		problemDesc:
			"The Oracle processes truth but remains silent. Give the digital construct a voice to speak the truths it finds.",
		solutionTitle: "Digital Voice Acquired",
		solutionDesc:
			"Using the Web Speech API, the Oracle now speaks back, guiding you through the silicon trails.",
		startPos: { x: 50, y: 50 },
		npc: {
			name: "The Echo",
			image: "/assets/the-oracle-of-silicon/npc.png",
			position: { x: 40, y: 55 },
		},
		reward: {
			name: "Silver Tongue",
			image: "/assets/the-oracle-of-silicon/reward.png",
			position: { x: 40, y: 40 },
		},
	},
	"babel-fish": {
		id: "babel-fish",
		title: "The Babel Fish",
		description:
			"Use the AI Prompt API to translate user commands into game actions.",
		problemTitle: "Lost in Translation",
		problemDesc:
			"The Oracle hears 'Let's bounce' but doesn't know you mean 'return to hub'. Use the Prompt API to bridge the gap.",
		solutionTitle: "Intent Deciphered",
		solutionDesc:
			"You've integrated Gemini Nano to parse natural language into actionable game commands.",
		startPos: { x: 50, y: 50 },
		npc: {
			name: "The Echo",
			image: "/assets/the-oracle-of-silicon/npc.png",
			position: { x: 40, y: 55 },
		},
		reward: {
			name: "Intent Weaver",
			image: "/assets/the-oracle-of-silicon/reward.png",
			position: { x: 40, y: 40 },
		},
	},
	"context-key": {
		id: "context-key",
		title: "The Context Key",
		description:
			"Inject game context into the AI prompt for smarter responses.",
		problemTitle: "Blind Oracle",
		problemDesc:
			"The AI doesn't know where you are or what you're holding. Inject the GameContext so it can understand 'Open this'.",
		solutionTitle: "Contextual Awareness",
		solutionDesc:
			"By providing environmental data to the Prompt API, the Oracle can now make informed decisions based on the game's state.",
		startPos: { x: 50, y: 50 },
		npc: {
			name: "The Echo",
			image: "/assets/the-oracle-of-silicon/npc.png",
			position: { x: 40, y: 55 },
		},
		reward: {
			name: "Oracle's Sight",
			image: "/assets/the-oracle-of-silicon/reward.png",
			position: { x: 40, y: 40 },
		},
	},
	"hallucination-shield": {
		id: "hallucination-shield",
		title: "The Hallucination",
		description: "Handle AI errors and invalid JSON responses gracefully.",
		problemTitle: "The Shattered Logic",
		problemDesc:
			"The Oracle sometimes speaks in riddles that break the game's logic. Build a shield to catch invalid responses.",
		solutionTitle: "Logic Refined",
		solutionDesc:
			"You've implemented robust error handling and response validation for the AI's output.",
		startPos: { x: 50, y: 50 },
		npc: {
			name: "The Echo",
			image: "/assets/the-oracle-of-silicon/npc.png",
			position: { x: 40, y: 55 },
		},
		reward: {
			name: "Truth Seeker",
			image: "/assets/the-oracle-of-silicon/reward.png",
			position: { x: 40, y: 40 },
		},
	},
};
