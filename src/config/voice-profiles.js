/**
 * Voice Profiles Configuration
 *
 * Defines speech characteristics for different roles (hero, npc).
 */

export const VOICE_PROFILES = {
	hero: {
		rate: 1.1,
		pitch: 1.05,
		pitchVar: 0.05,
		preferredVoices: {
			en: ["Google US English", "Daniel", "Alex", "Fred", "Rishi"],
			es: ["Google español", "Jorge", "Diego", "Carlos", "Pablo"],
		},
	},
	npc: {
		rate: 0.85,
		pitch: 0.8,
		pitchVar: 0.1,
		preferredVoices: {
			en: ["Google UK English Female", "Samantha", "Victoria", "Karen"],
			es: ["Mónica", "Paulina", "Soledad", "Angelica"],
		},
	},
};
