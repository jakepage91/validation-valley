import { logger } from "../services/logger-service.js";

/**
 * @typedef {Object} VoiceControllerOptions
 * @property {(dx: number, dy: number) => void} [onMove] - Movement callback
 * @property {() => void} [onInteract] - Interaction callback
 * @property {() => void} [onPause] - Pause callback
 * @property {() => void} [onNextSlide] - Next slide callback
 * @property {() => void} [onPrevSlide] - Previous slide callback
 * @property {() => void} [onMoveToNpc] - Move to NPC callback
 * @property {() => void} [onMoveToExit] - Move to exit callback
 * @property {() => string} [onGetDialogText] - Get current dialog text
 * @property {() => {isDialogOpen: boolean, isRewardCollected: boolean}} [onGetContext] - Get game context
 * @property {(action: string, value: any) => void} [onDebugAction] - Debug action callback
 * @property {() => boolean} [isEnabled] - Check if voice control is enabled
 * @property {string} [language] - Language code (e.g., 'en-US', 'es-ES')
 */

/**
 * VoiceController - Lit Reactive Controller for voice commands
 *
 * Uses the Web Speech API to listen for commands.
 * Supports English and Spanish commands.
 * Optionally uses Chrome's Built-in AI (Prompt API) for smarter command recognition.
 * Integration with SpeechSynthesis for voice feedback using Alarion's persona.
 *
 * @implements {import('lit').ReactiveController}
 */
export class VoiceController {
	/**
	 * @param {import('lit').ReactiveControllerHost} host
	 * @param {Partial<VoiceControllerOptions>} [options]
	 */
	constructor(host, options = {}) {
		/** @type {import('lit').ReactiveControllerHost} */
		this.host = host;
		/** @type {VoiceControllerOptions} */

		this.options = {
			onMove: (_dx, _dy) => { },
			onInteract: () => { },
			onPause: () => { },
			onNextSlide: () => { },
			onPrevSlide: () => { },
			onMoveToNpc: () => { },
			onMoveToExit: () => { },
			onGetDialogText: () => "",
			onGetContext: () => ({ isDialogOpen: false, isRewardCollected: false }),
			onDebugAction: (_action, _value) => { },
			isEnabled: () => false,
			language: document.documentElement.lang.startsWith("es")
				? "es-ES"
				: "en-US",
			...options,
		};

		/** @type {SpeechRecognition|null} */
		this.recognition = null;
		/** @type {boolean} */
		this.isSpeaking = false;
		/** @type {any} */
		this.aiSession = null;
		/** @type {any} */
		this.narratorSession = null;
		/** @type {SpeechSynthesis} */
		this.synthesis = window.speechSynthesis;
		/** @type {SpeechSynthesisVoice[]} */
		this.voices = [];
		/** @type {number} */
		this.restartAttempts = 0;
		/** @type {number} */
		this.lastStartTime = 0;

		if (this.synthesis) {
			this.voices = this.synthesis.getVoices();
			this.synthesis.onvoiceschanged = () => {
				this.voices = this.synthesis.getVoices();
			};
		}

		const SpeechRecognition =
			window.SpeechRecognition || window.webkitSpeechRecognition;

		if (SpeechRecognition) {
			this.recognition = new SpeechRecognition();
			this.recognition.continuous = true;
			this.recognition.interimResults = false;
			// Set language based on options
			this.recognition.lang = this.options.language;

			this.recognition.onstart = () => {
				this.isListening = true;
				this.lastStartTime = Date.now();
				logger.debug(`🎤 Voice control active (${this.recognition.lang}).`);
			};

			this.recognition.onresult = (event) => this.handleResult(event);

			this.recognition.onend = () => {
				this.isListening = false;
				// Prevent auto-restart if we are speaking
				if (this.options.isEnabled() && !this.isSpeaking) {
					const duration = Date.now() - this.lastStartTime;
					// If session lasted less than 2 seconds, assume instability
					if (duration < 2000) {
						this.restartAttempts++;
					} else {
						// Stable session, reset counter
						this.restartAttempts = 0;
					}

					// Exponential backoff: 100ms, 200ms, 400ms... max 3s
					const delay = Math.min(100 * 2 ** this.restartAttempts, 3000);
					if (this.restartAttempts > 2) {
						logger.debug(
							`🎤 Restarting voice in ${delay}ms (Attempt ${this.restartAttempts})`,
						);
					}
					setTimeout(() => this.start(), delay);
				} else {
					this.restartAttempts = 0;
				}
			};

			this.recognition.onerror = (event) => {
				console.error("❌ Voice recognition error:", event.error);
				if (event.error === "not-allowed") {
					this.isListening = false;
				}
			};
		}

		// Initialize AI session if available
		this.initAI();

		host.addController(this);
	}

	async initAI() {
		try {
			// @ts-expect-error
			if (typeof LanguageModel !== "undefined") {
				// @ts-expect-error
				const availability = await LanguageModel.availability();

				if (availability === "available" || availability === "readily") {
					// @ts-expect-error
					this.aiSession = await LanguageModel.create({
						initialPrompts: [
							{
								role: "system",
								content: `You are Alarion, a heroic developer battling the Monolith.
Your mission is to process voice commands and respond.

CRITICAL RULES:
1. MIRROR LANGUAGE: STRICTLY speak the SAME language as the user. 
   - User English -> You English.
   - User Spanish -> You Spanish.
   - NEVER mix languages.
   - PRIORITY: If User language is unclear, DEFAULT to ${this.options.language}.
2. PAGE LANGUAGE: The current page language is ${this.options.language}. 
3. AI PERSONA: Brave, heroic, using code/tech metaphors.
4. FORMAT: Return ONLY valid JSON: {"action": "string", "value": "optional_string", "feedback": "string", "lang": "es-ES"|"en-US"}.
5. ALLOWED ACTIONS: ["move_up", "move_down", "move_left", "move_right", "move_to_npc", "move_to_exit", "interact", "pause", "next_slide", "prev_slide"].
6. FEEDBACK POLICY:
   - MOVEMENT: Speak AS ALARION responding enthusiastically. Use phrases like "Let's see what they have to say!", "On my way!", "Vamos a ver qué nos cuenta.". NEVER use "Navigating" or "Moving towards".
   - GREETING: Speak AS ALARION greeting the character (e.g., "Greetings, stranger!", "I seek your wisdom!"). Avoid robotic phrases like "Initiating communication" or "State your query".
   - CELEBRATION: When completing a chapter, be joyful and motivating.
   - SILENCE: For navigation commands (next slide, back, help, pause), keep "feedback" as "".
7. CONTEXT RULES:
   - If [Dialog: Open], "next" -> "next_slide".
   - If [Dialog: Closed] AND [Reward: Collected], "next" or "next level" -> "move_to_exit".
   - If [Dialog: Closed] AND [Reward: Not Collected], ONLY "next" or "exit" -> "unknown" (guide user to find the NPC/reward).
   - "move_to_npc" and "interact" are ALWAYS allowed.`,
							},
							{
								role: "user",
								content: "go to the next level",
							},
							{
								role: "assistant",
								content:
									'{"action": "move_to_exit", "value": null, "feedback": "Let\'s move on!", "lang": "en-US"}',
							},
							{
								role: "user",
								content: "go to the rainwalker",
							},
							{
								role: "assistant",
								content:
									'{"action": "move_to_npc", "value": null, "feedback": "Time to face the Rainwalker. Let\'s go!", "lang": "en-US"}',
							},
							{
								role: "user",
								content: "move right",
							},
							{
								role: "assistant",
								content:
									'{"action": "move_right", "value": null, "feedback": "Moving right.", "lang": "en-US"}',
							},
							{
								role: "user",
								content: "ve con el habitante de la lluvia",
							},
							{
								role: "assistant",
								content:
									'{"action": "move_to_npc", "value": null, "feedback": "Hora de enfrentar al Caminante. ¡Vamos!", "lang": "es-ES"}',
							},
							{
								role: "user",
								content: "ve con el habitante de la lluvia",
							},
							{
								role: "assistant",
								content:
									'{"action": "move_to_npc", "value": null, "feedback": "Hora de enfrentar al Caminante. ¡Vamos!", "lang": "es-ES"}',
							},
							{
								role: "user",
								content: "interactuate",
							},

							{
								role: "user",
								content: "talk to him",
							},
							{
								role: "assistant",
								content:
									'{"action": "interact", "value": null, "feedback": "Greetings, fellow traveler! I seek your wisdom."}',
							},
							{
								role: "user",
								content: "go to the exit",
							},
							{
								role: "assistant",
								content:
									'{"action": "move_to_exit", "value": null, "feedback": "Heading to the exit."}',
							},
							{
								role: "user",
								content: "ve a la salida",
							},
							{
								role: "assistant",
								content:
									'{"action": "move_to_exit", "value": null, "feedback": "Avanzando hacia la salida.", "lang": "es-ES"}',
							},
							{
								role: "user",
								content:
									'[Context: Dialog=Open, Reward=Not Collected] User command: "next"',
							},
							{
								role: "assistant",
								content:
									'{"action": "next_slide", "value": null, "feedback": "", "lang": "en-US"}',
							},
							{
								role: "user",
								content:
									'[Context: Dialog=Closed, Reward=Not Collected] User command: "go to the npc"',
							},
							{
								role: "assistant",
								content:
									'{"action": "move_to_npc", "value": null, "feedback": "Approaching the character to gather intel.", "lang": "en-US"}',
							},
							{
								role: "user",
								content:
									'[Context: Dialog=Closed, Reward=Collected] User command: "next"',
							},
							{
								role: "assistant",
								content:
									'{"action": "move_to_exit", "value": null, "feedback": "Onward to the next challenge!", "lang": "en-US"}',
							},
							{
								role: "user",
								content: "finish chapter",
							},
							{
								role: "assistant",
								content:
									'{"action": "complete_chapter", "value": null, "feedback": "System update successful! Let\'s keep going!", "lang": "en-US"}',
							},
							{
								role: "user",
								content: "next slide",
							},
							{
								role: "assistant",
								content:
									'{"action": "next_slide", "value": null, "feedback": "", "lang": "en-US"}',
							},
							{
								role: "user",
								content: "diapositiva anterior",
							},
							{
								role: "assistant",
								content:
									'{"action": "prev_slide", "value": null, "feedback": "", "lang": "es-ES"}',
							},
							{
								role: "user",
								content: "siguiente",
							},
							{
								role: "assistant",
								content:
									'{"action": "next_slide", "value": null, "feedback": "", "lang": "es-ES"}',
							},
							{
								role: "user",
								content: "go to the stranger",
							},
							{
								role: "assistant",
								content:
									'{"action": "move_to_npc", "value": null, "feedback": "Approaching the unknown entity to establish communication.", "lang": "en-US"}',
							},
							{
								role: "user",
								content: "acércate al personaje",
							},
							{
								role: "assistant",
								content:
									'{"action": "move_to_npc", "value": null, "feedback": "Me acerco para ver qué dice.", "lang": "es-ES"}',
							},
							{
								role: "user",
								content: "help",
							},
							{
								role: "assistant",
								content:
									'{"action": "help", "value": null, "feedback": "", "lang": "en-US"}',
							},
						],
					});

					// Initialize NPC AI session
					// @ts-expect-error
					this.npcSession = await LanguageModel.create({
						initialPrompts: [
							{
								role: "system",
								content: `You are acting as the character currently speaking in the dialogue (e.g., The Rainwalker, The Architect).
Your goal is to Speak the essence of the current dialogue line to Alarion.
- PERSONA: Match the tone of the character (Wise, Grumpy, Digital, etc.).
- RULE: Speak in the first person ("I", "We").
- RULE: Mention Alarion ONLY if it fits naturally (e.g., commands, warnings). Do not force his name into every sentence.
- RULE: BE VERY CONCISE. Maximum one sentence.
- RULE: MIRROR LANGUAGE. If the input is English, speak English. If Spanish, speak Spanish.`,
							},
						],
					});

					console.log(
						"🤖 Chrome Built-in AI initialized with Alarion's persona & NPC Persona.",
					);
				}
			}
		} catch (error) {
			console.warn("⚠️ Could not initialize Built-in AI:", error);
		}
	}

	getBestVoice(lang, role = "hero") {
		if (!this.voices.length) return null;

		// Normalize lang (e.g., 'es' -> 'es-ES')
		const searchLang = lang.startsWith("es") ? "es" : "en";

		// Deeply differentiated roles with high-fidelity preferences
		const preferredVoices =
			{
				en:
					role === "hero"
						? ["Google US English", "Daniel", "Alex", "Fred", "Rishi"] // Male Hero
						: ["Google UK English Female", "Samantha", "Victoria", "Karen"], // Female Oracle
				es:
					role === "hero"
						? ["Google español", "Jorge", "Diego", "Carlos", "Pablo"] // Male Hero
						: ["Mónica", "Paulina", "Soledad", "Angelica"], // Female Oracle
			}[searchLang] || [];

		// Filter by language and look for premium versions
		const langVoices = this.voices
			.filter((v) => v.lang.toLowerCase().startsWith(searchLang))
			.sort((a, b) => {
				// Prioritize voices that sound more natural (heuristics)
				const aScore =
					(a.name.includes("Natural") ? 2 : 0) +
					(a.name.includes("Enhanced") ? 1 : 0);
				const bScore =
					(b.name.includes("Natural") ? 2 : 0) +
					(b.name.includes("Enhanced") ? 1 : 0);
				return bScore - aScore;
			});

		if (langVoices.length === 0) return null;

		// Try to find a role-specific preferred voice
		for (const name of preferredVoices) {
			const found = langVoices.find((v) => v.name.includes(name));
			if (found) return found;
		}

		// If no preferred, at least try to pick different ones for hero/npc if multiple available
		if (role === "npc" && langVoices.length > 1) return langVoices[1];

		return langVoices[0];
	}

	speak(text, lang = null, role = "hero", queue = false) {
		if (!this.synthesis || !text) return;

		this.isSpeaking = true;
		this.stop();

		if (!queue) {
			this.synthesis.cancel();
		}

		const utterance = new SpeechSynthesisUtterance(text);
		const targetLang = lang || this.recognition?.lang || this.options.language;
		utterance.lang = targetLang;

		// Select best voice if available for this specific role
		const voice = this.getBestVoice(targetLang, role);
		if (voice) {
			utterance.voice = voice;
		}

		// Character Voice Profiles
		if (role === "hero") {
			// Alarion (The Hero): Faster, energetic, slightly higher pitch for bravery
			utterance.rate = 1.1;
			// Add a tiny bit of random variation so it feels less robotic over time
			utterance.pitch = 1.05 + (Math.random() * 0.1 - 0.05);
		} else {
			// NPCs (The Guides): Slower, wiser, deeper pitch
			utterance.rate = 0.85;
			utterance.pitch = 0.85 + (Math.random() * 0.06 - 0.03);
		}

		utterance.onstart = () => {
			this.isSpeaking = true;
		};
		utterance.onend = () => {
			this.isSpeaking = false;
			setTimeout(() => {
				if (this.options.isEnabled() && !this.isSpeaking) this.start();
			}, 100);
		};
		utterance.onerror = () => {
			this.isSpeaking = false;
			if (this.options.isEnabled()) this.start();
		};

		this.synthesis.speak(utterance);
	}

	async narrateDialogue(text, lang = null) {
		if (!text) return;

		let narration = text;

		// Use AI to act as the NPC and summarize/speak the text
		if (this.npcSession) {
			try {
				const targetLang = lang || this.options.language;
				const prompt = `${text} IMPORTANT: Reformulate this line for voice acting. Output MUST be in '${targetLang}'.`;
				const response = await this.npcSession.prompt(prompt);
				narration = response.replace(/```json|```/g, "").trim();
				logger.info(`🤖 NPC (${targetLang}):`, narration);
			} catch (error) {
				console.error("❌ AI Narration error:", error);
			}
		}

		// Use the NPC voice for dialogue narration (queued after Alarion speaks)
		this.speak(narration, lang, "npc", true);
	}

	hostConnected() {
		if (this.options.isEnabled()) {
			this.start();
		}
	}

	hostDisconnected() {
		this.stop();
		if (this.aiSession) {
			this.aiSession.destroy();
		}
		if (this.npcSession) {
			this.npcSession.destroy();
		}
		if (this.synthesis) {
			this.synthesis.cancel();
		}
	}

	start() {
		if (this.recognition && !this.isListening) {
			try {
				this.recognition.start();
			} catch (_e) {
				// Already started
			}
		}
	}

	stop() {
		if (this.recognition && this.isListening) {
			this.recognition.stop();
			this.isListening = false;
		}
	}

	handleResult(event) {
		const last = event.results.length - 1;
		const transcript = event.results[last][0].transcript.toLowerCase().trim();

		console.log(`🗣️ Voice command [${this.recognition.lang}]: "${transcript}"`);
		this.processCommand(transcript);
	}

	async processCommand(command) {
		if (!this.aiSession) {
			console.warn("⚠️ AI Session not available. Command ignored.");
			return;
		}

		try {
			// Inyectar contexto
			const context = this.options.onGetContext();
			const targetLang = this.options.language;
			const contextStr = `[Context: Dialog=${context.isDialogOpen ? "Open" : "Closed"}, Reward=${context.isRewardCollected ? "Collected" : "Not Collected"}]`;
			const promptWithContext = `${contextStr} User command: "${command}". IMPORTANT: The 'lang' field in JSON MUST be '${targetLang}' and 'feedback' text MUST be in '${targetLang}'.`;

			logger.debug("🤖 Prompt:", promptWithContext);
			const response = await this.aiSession.prompt(promptWithContext);
			const cleanedResponse = response.replace(/```json|```/g, "").trim();
			try {
				const result = JSON.parse(cleanedResponse);
				logger.info("🤖 AI response:", result);

				if (result.feedback) {
					this.speak(result.feedback, result.lang);
				}

				if (result.action && result.action !== "unknown") {
					this.executeAction(result.action, result.value, result.lang);
				}
			} catch (_e) {
				console.warn("⚠️ Failed to parse AI response as JSON:", response);
			}
		} catch (error) {
			console.error("❌ AI processing error:", error);
		}
	}

	executeAction(action, value, lang = null) {
		logger.info(`🎙️ executeAction: action=${action}, value=${value}`);
		const moveSpeed = 5;
		const speakLang = lang || this.recognition?.lang || this.options.language;

		switch (action) {
			case "move_up":
				this.options.onMove(0, -moveSpeed);
				break;
			case "move_down":
				this.options.onMove(0, moveSpeed);
				break;
			case "move_left":
				this.options.onMove(-moveSpeed, 0);
				break;
			case "move_right":
				this.options.onMove(moveSpeed, 0);
				break;
			case "move_to_npc":
				this.options.onMoveToNpc();
				break;
			case "move_to_exit":
				this.options.onMoveToExit();
				break;
			case "interact":
				this.options.onInteract();
				setTimeout(() => {
					const text = this.options.onGetDialogText();
					if (text) this.narrateDialogue(text, speakLang);
				}, 400); // Shorter delay since we removed the manual feedback
				break;
			case "pause":
				this.options.onPause();
				break;
			case "next_slide":
				this.options.onNextSlide();
				setTimeout(() => {
					const text = this.options.onGetDialogText();
					if (text) this.narrateDialogue(text, speakLang);
				}, 200);
				break;
			case "prev_slide":
				this.options.onPrevSlide();
				setTimeout(() => {
					const text = this.options.onGetDialogText();
					if (text) this.narrateDialogue(text, speakLang);
				}, 200);
				break;
			case "setChapter":
				this.options.onDebugAction("setChapter", value);
				break;
			case "complete_chapter":
				this.options.onDebugAction("completeChapter");
				break;
			case "giveItem":
				this.options.onDebugAction("giveItem");
				break;
			case "setTheme":
				this.options.onDebugAction("setTheme", value);
				break;
			case "returnToHub":
				this.options.onDebugAction("returnToHub");
				break;
			case "help":
				this.showHelp();
				break;
		}
	}

	celebrateChapter() {
		const lang = this.options.language || "en-US";
		const isEn = lang.startsWith("en");

		const phrases = isEn
			? [
				"Chapter complete! The Monolith weakens. Onward!",
				"System update successful! Let's keep going!",
				"Victory! We've reclaimed another sector of the Sovereignty!",
			]
			: [
				"¡Capítulo completado! ¡El Monolito se debilita! ¡Sigamos!",
				"¡Actualización del sistema completada! ¡Hacia el siguiente sector!",
				"¡Victoria! ¡Hemos recuperado otro sector de la Soberanía!",
			];

		const phrase = phrases[Math.floor(Math.random() * phrases.length)];
		this.speak(phrase, lang);
	}

	showHelp() {
		console.log(`
🎤 VOICE COMMANDS / COMANDOS DE VOZ:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MOVE: 'Up/Arriba', 'Down/Abajo', 'Left/Izquierda', 'Right/Derecha'
APPROACH: 'Approach/Acércate', 'Talk to/Háblale'
DIALOGUE: 'Next/Siguiente', 'Back/Atrás'
ACTIONS: 'Interact/Interactúa', 'Pause/Pausa', 'Help/Ayuda'
DEBUG: 'Chapter/Capítulo [id]', 'Item/Objeto', 'Night/Noche', 'Hub'
🤖 AI Multilingual Feedback Active
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
		`);
	}
}
