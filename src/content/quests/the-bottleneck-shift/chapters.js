import { msg } from "@lit/localize";
import { html } from "lit";

/**
 * The Bottleneck Shift Quest - Chapter Data
 *
 * A journey through the world of AI-accelerated generation
 * and the validation challenges it creates.
 *
 * Thesis: AI increases generation speed; validation becomes the bottleneck.
 */

/**
 * @typedef {import("../quest-types.js").LevelConfig} LevelConfig
 */

/** @returns {Record<string, LevelConfig>} */
export const getBottleneckShiftChapters = () => ({
	"entrance-valley": {
		id: "entrance-valley",
		title: msg("The Bottleneck Shift"),
		description: msg(
			"You stand at the entrance to Validation Valley. The old ways of building software are changing. AI has arrived, and with it, a fundamental shift in where the hard work lies.",
		),
		problemTitle: msg("The Shift Has Begun"),
		problemDesc: html`
			<p>${msg("We're living through a fundamental shift in how software gets made.")}</p>
			<p>${msg("AI tools have dramatically increased the speed at which code, documentation, and contributions can be generated.")}</p>
			<p>${msg("But generation was never the hard part.")}</p>
			<p><strong>${msg("The hard part is knowing whether what you generated is correct, secure, and actually works in reality.")}</strong></p>
		`,
		solutionTitle: msg("The Journey Ahead"),
		architecturalChanges: [
			msg("AI accelerates generation. Validation becomes the constraint."),
			msg(
				"This journey explores two domains where this shift creates pressure.",
			),
			msg("And one principle that addresses both."),
		],
		backgroundStyle: `url('/assets/swamp-of-scope/background.png')`,
		npc: {
			name: msg("The Witness"),
			image: "/assets/swamp-of-scope/npc.png",
			position: { x: 30, y: 50 },
		},
		reward: {
			name: msg("Map of the Valley"),
			image: "/assets/swamp-of-scope/reward.png",
			position: { x: 45, y: 35 },
		},
		hero: {
			image: "/assets/swamp-of-scope/hero.png",
			reward: "/assets/swamp-of-scope/hero-reward.png",
		},
		startPos: { x: 80, y: 20 },
		exitZone: {
			x: 5,
			y: 80,
			width: 20,
			height: 15,
			label: msg("To the Maintainer's Hut"),
		},
	},

	"curl-maintainers-hut": {
		id: "curl-maintainers-hut",
		title: msg("The Curl Maintainer's Dilemma"),
		description: msg(
			"In a small hut at the edge of the valley lives Daniel, keeper of curl. He has maintained this critical piece of infrastructure for over 25 years. But the nature of his burden has changed.",
		),
		problemTitle: msg("Low-Cost Submissions, High-Cost Review"),
		problemDesc: html`
			<p>${msg("Daniel Stenberg has maintained curl for over 25 years. It's installed on billions of devices.")}</p>
			<p>${msg("In recent years, he's faced a flood of AI-generated security reports.")}</p>
			<p>${msg("The cost to submit has dropped to nearly zero. The cost to review remains stubbornly human.")}</p>
			<p>${msg("Many reports are low-quality, speculative, or outright wrong. But each one demands careful attention.")}</p>
			<p><strong>${msg("The asymmetry is stark: seconds to generate, hours to validate.")}</strong></p>
		`,
		solutionTitle: msg("The Maintainer's Burden"),
		architecturalChanges: [
			msg(
				"curl is used by virtually every operating system, browser, and connected device.",
			),
			msg(
				"Stenberg has written extensively about the burden of triaging AI-generated reports.",
			),
			msg(
				"The incentive structure rewards volume: bug bounty hunters can spray reports across projects.",
			),
			msg(
				"Even a low hit rate is profitable for submitters, but devastating for maintainers.",
			),
		],
		backgroundStyle: `url('/assets/hall-of-fragments/background.png')`,
		npc: {
			name: msg("Daniel's Echo"),
			image: "/assets/hall-of-fragments/npc.png",
			position: { x: 35, y: 55 },
		},
		reward: {
			name: msg("Burden Stone"),
			image: "/assets/hall-of-fragments/reward.png",
			position: { x: 55, y: 40 },
		},
		hero: {
			image: "/assets/hall-of-fragments/hero.png",
			reward: "/assets/hall-of-fragments/hero-reward.png",
		},
		startPos: { x: 75, y: 15 },
		exitZone: {
			x: 10,
			y: 85,
			width: 25,
			height: 12,
			label: msg("To the CVE Tower"),
		},
	},

	"cve-tower": {
		id: "cve-tower",
		title: msg("CVE Infrastructure Under Strain"),
		description: msg(
			"The tower looms ahead—the CVE Registry, keeper of vulnerability records. Once a trusted source of truth, it now struggles under the weight of noise.",
		),
		problemTitle: msg("When Noise Overwhelms Signal"),
		problemDesc: html`
			<p>${msg("The CVE system was designed for a world where vulnerability reports were scarce and carefully researched.")}</p>
			<p>${msg("Today, the system is flooded. AI-generated reports, incentive-driven submissions, and automated scanning tools have increased volume dramatically.")}</p>
			<p>${msg("Maintainers face alert fatigue. Real vulnerabilities get buried in noise.")}</p>
			<p><strong>${msg("Security depends on trust. When the signal-to-noise ratio collapses, everyone loses.")}</strong></p>
		`,
		solutionTitle: msg("The Trust Degradation"),
		architecturalChanges: [
			msg("CVE assignment often happens before thorough validation."),
			msg(
				"Some projects spend more time disputing invalid CVEs than fixing real issues.",
			),
			msg(
				"The degradation is self-reinforcing: as trust drops, serious researchers invest less effort.",
			),
			msg("This leaves the field to volume players."),
		],
		backgroundStyle: `url('/assets/fortress-of-design/background.png')`,
		npc: {
			name: msg("The Registry Keeper"),
			image: "/assets/fortress-of-design/npc.png",
			position: { x: 45, y: 50 },
		},
		reward: {
			name: msg("Trust Shard"),
			image: "/assets/fortress-of-design/reward.png",
			position: { x: 60, y: 35 },
		},
		hero: {
			image: "/assets/fortress-of-design/hero.png",
			reward: "/assets/fortress-of-design/hero-reward.png",
		},
		startPos: { x: 20, y: 15 },
		exitZone: {
			x: 80,
			y: 85,
			width: 18,
			height: 12,
			label: msg("To the Dev Loop Mines"),
		},
	},

	"dev-loop-mines": {
		id: "dev-loop-mines",
		title: msg("The Inner Loop Problem"),
		description: msg(
			"Deep in the mines, developers labor. AI has given them powerful tools to write code faster. But something hasn't changed—the waiting.",
		),
		problemTitle: msg("AI Helps You Write Faster. Not Wait Faster."),
		problemDesc: html`
			<p>${msg("Inside companies, AI coding assistants have accelerated how quickly developers write and modify code.")}</p>
			<p>${msg("But the inner development loop still has the same bottleneck:")}</p>
			<p><strong>${msg("Waiting for CI/CD to validate changes against real environments.")}</strong></p>
			<p>${msg("Write code in seconds, wait minutes or hours to discover if it actually works.")}</p>
			<p>${msg("The validation delay hasn't shrunk. If anything, faster generation makes the wait feel longer.")}</p>
		`,
		solutionTitle: msg("The Waiting Game"),
		architecturalChanges: [
			msg(
				"Developers context-switch an average of 3-4 times while waiting for CI.",
			),
			msg(
				"Each context switch has cognitive costs that accumulate throughout the day.",
			),
			msg(
				"The longer the feedback loop, the more disconnected the developer becomes.",
			),
			msg("CI should confirm, not discover."),
		],
		backgroundStyle: `url('/assets/temple-of-inversion/background.png')`,
		npc: {
			name: msg("The Waiting Developer"),
			image: "/assets/temple-of-inversion/npc.png",
			position: { x: 40, y: 55 },
		},
		reward: {
			name: msg("Hourglass Fragment"),
			image: "/assets/temple-of-inversion/reward.png",
			position: { x: 55, y: 40 },
		},
		hero: {
			image: "/assets/temple-of-inversion/hero.png",
			reward: "/assets/temple-of-inversion/hero-reward.png",
		},
		startPos: { x: 15, y: 20 },
		exitZone: {
			x: 85,
			y: 50,
			width: 12,
			height: 20,
			label: msg("To Pattern Peak"),
		},
	},

	"pattern-peak": {
		id: "pattern-peak",
		title: msg("The Pattern"),
		description: msg(
			"You've climbed to Pattern Peak. From here, you can see the entire valley. The connection becomes clear.",
		),
		problemTitle: msg("The Shared Pattern"),
		problemDesc: html`
			<p>${msg("Open source security and inner development loops seem like different problems.")}</p>
			<p><strong>${msg("They're not.")}</strong></p>
			<p>${msg("Both are experiencing the same asymmetry:")}</p>
			<p>${msg("The cost to generate has dropped dramatically.")}</p>
			<p>${msg("The cost to validate has remained high or even increased.")}</p>
			<p><strong>${msg("AI amplifies this asymmetry. It makes generation nearly free without addressing validation at all.")}</strong></p>
		`,
		solutionTitle: msg("The Insight"),
		architecturalChanges: [
			msg(
				"In both domains, generation got cheap. Validation stayed expensive.",
			),
			msg("The solution isn't to slow down generation."),
			msg("It's to make validation faster, earlier, and cheaper."),
		],
		backgroundStyle: `url('/assets/the-jewelers-workshop/background.png')`,
		npc: {
			name: msg("The Pattern Seer"),
			image: "/assets/the-jewelers-workshop/npc.png",
			position: { x: 50, y: 45 },
		},
		reward: {
			name: msg("Pattern Crystal"),
			image: "/assets/the-jewelers-workshop/reward.png",
			position: { x: 35, y: 55 },
		},
		hero: {
			image: "/assets/the-jewelers-workshop/hero.png",
			reward: "/assets/the-jewelers-workshop/hero-reward.png",
		},
		startPos: { x: 10, y: 75 },
		exitZone: {
			x: 90,
			y: 20,
			width: 10,
			height: 25,
			label: msg("To Validation Springs"),
		},
	},

	"validation-springs": {
		id: "validation-springs",
		title: msg("Better Validation"),
		description: msg(
			"The springs of validation flow here. Not more validation—better validation. The water teaches you three principles.",
		),
		problemTitle: msg("The Lever"),
		problemDesc: html`
			<p>${msg("The lever is validation itself. Not 'more validation'—better validation.")}</p>
			<p><strong>${msg("Earlier:")}</strong> ${msg("Catch issues before they compound, before they reach maintainers, before they hit production.")}</p>
			<p><strong>${msg("Closer to reality:")}</strong> ${msg("Test against real dependencies, real services, real data shapes—not mocks that drift from truth.")}</p>
			<p><strong>${msg("Cheaper to fail:")}</strong> ${msg("Make it safe and fast to discover problems during development, not in production.")}</p>
		`,
		solutionTitle: msg("The Three Principles"),
		architecturalChanges: [
			msg("Earlier: Catch issues before they compound."),
			msg("Closer to reality: Test against real dependencies, not mocks."),
			msg("Cheaper to fail: Discovery should happen during development."),
			msg("CI should confirm, not discover."),
		],
		backgroundStyle: `url('/assets/hall-of-definition/background.png')`,
		npc: {
			name: msg("The Spring Guardian"),
			image: "/assets/hall-of-definition/npc.png",
			position: { x: 45, y: 50 },
		},
		reward: {
			name: msg("Validation Orb"),
			image: "/assets/hall-of-definition/reward.png",
			position: { x: 60, y: 40 },
		},
		hero: {
			image: "/assets/hall-of-definition/hero.png",
			reward: "/assets/hall-of-definition/hero-reward.png",
		},
		startPos: { x: 10, y: 50 },
		exitZone: {
			x: 90,
			y: 70,
			width: 10,
			height: 20,
			label: msg("To the Workshop"),
		},
	},

	"mirrord-workshop": {
		id: "mirrord-workshop",
		title: msg("An Example Workflow"),
		description: msg(
			"In the workshop, you see one approach to earlier validation in action. Not the only way—but one example of the principle.",
		),
		problemTitle: msg("mirrord: Connect Local to Real"),
		problemDesc: html`
			<p>${msg("One approach to earlier validation: run your code locally while connected to real remote dependencies.")}</p>
			<p>${msg("mirrord lets developers plug their local process into a Kubernetes cluster—accessing real databases, services, and configurations without deploying.")}</p>
			<p><strong>${msg("The feedback loop shrinks from minutes to seconds.")}</strong></p>
			<p>${msg("Changes are validated against reality before they ever reach CI.")}</p>
			<p><em>${msg("This isn't the only approach, and it's not a silver bullet. It's one example of the principle in action.")}</em></p>
		`,
		solutionTitle: msg("The Principle in Action"),
		architecturalChanges: [
			msg("mirrord mirrors or steals traffic from a target pod."),
			msg("The local process accesses the cluster's network and filesystem."),
			msg(
				"Other tools exist: Telepresence, Bridge to Kubernetes, service meshes.",
			),
			msg("The principle matters more than the specific tool."),
		],
		backgroundStyle: `url('/assets/assay-chamber/background.png')`,
		npc: {
			name: msg("The Workshop Master"),
			image: "/assets/assay-chamber/npc.png",
			position: { x: 40, y: 50 },
		},
		reward: {
			name: msg("Mirror Shard"),
			image: "/assets/assay-chamber/reward.png",
			position: { x: 55, y: 35 },
		},
		hero: {
			image: "/assets/assay-chamber/hero.png",
			reward: "/assets/assay-chamber/hero-reward.png",
		},
		startPos: { x: 15, y: 80 },
		exitZone: {
			x: 85,
			y: 15,
			width: 15,
			height: 20,
			label: msg("To the Path Forward"),
		},
	},

	"path-forward": {
		id: "path-forward",
		title: msg("The Path Forward"),
		description: msg(
			"You've reached the end of the valley. The path continues, but now you understand where it leads.",
		),
		problemTitle: msg("The Bottleneck Has Shifted"),
		problemDesc: html`
			<p>${msg("AI has permanently changed the economics of generation.")}</p>
			<p>${msg("We can't go back to a world where production is the bottleneck.")}</p>
			<p>${msg("The question now is whether we adapt our validation practices to match—")}</p>
			<p><strong>${msg("—or continue drowning in unvalidated output.")}</strong></p>
		`,
		solutionTitle: msg("The Way Forward"),
		architecturalChanges: [
			msg(
				"For open source maintainers: better tooling for triage and automated pre-validation.",
			),
			msg(
				"For development teams: move validation earlier into the development process.",
			),
			msg("The principle is simple."),
			msg("The implementation is where the work begins."),
			msg("Our tools should shift with the bottleneck."),
		],
		backgroundStyle: `url('/assets/liberated-battlefield/background.png')`,
		npc: {
			name: msg("The Guide"),
			image: "/assets/liberated-battlefield/npc.png",
			position: { x: 50, y: 50 },
		},
		reward: {
			name: msg("Compass of Change"),
			image: "/assets/liberated-battlefield/reward.png",
			position: { x: 35, y: 40 },
		},
		hero: {
			image: "/assets/liberated-battlefield/hero.png",
			reward: "/assets/liberated-battlefield/hero-reward.png",
		},
		startPos: { x: 10, y: 50 },
		exitZone: {
			x: 90,
			y: 50,
			width: 10,
			height: 30,
			label: msg("Quest Complete"),
		},
	},
});
