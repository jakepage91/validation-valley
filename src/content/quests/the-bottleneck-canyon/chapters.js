import { msg } from "@lit/localize";
import { html } from "lit";
// AI-Forged Lands assets
import iconAlarm from "../../../assets/ai-forged-lands/icon-alarm.png";
import iconInfinity from "../../../assets/ai-forged-lands/icon-infinity.png";
import iconValidation from "../../../assets/ai-forged-lands/icon-validation.png";
// Reward images for "The End" summary
import aiForgedReward from "../../../assets/ai-forged-lands/reward.png";
import cisaLogo from "../../../assets/cracked-archive/cisa-logo.png";
import cveLandingPage from "../../../assets/cracked-archive/cve-landing-page.png";
// Cracked Archive assets
import cveMeme from "../../../assets/cracked-archive/cve-meme.png";
import cveTome from "../../../assets/cracked-archive/cve-tome.png";
import mitrePillar from "../../../assets/cracked-archive/mitre-pillar.png";
import crackedArchiveReward from "../../../assets/cracked-archive/reward.png";
import scanningBots from "../../../assets/cracked-archive/scanning-bots.png";
import aiWaiting from "../../../assets/endless-loop/ai-waiting.png";
// Endless Loop assets
import bottleneckedLoop from "../../../assets/endless-loop/bottlenecked-loop.png";
import endlessLoopReward from "../../../assets/endless-loop/reward.png";
import validatedLoop from "../../../assets/endless-loop/validated-loop.png";
import curlStoppedPaying from "../../../assets/flooded-gate/curl-stopped-paying.png";
import desperateHacker from "../../../assets/flooded-gate/desperate-hacker.png";
import hackeroneInteractive from "../../../assets/flooded-gate/hackerone-interactive.png";
import intelLogo from "../../../assets/flooded-gate/intel-logo.png";
import maintainerInMud from "../../../assets/flooded-gate/maintainer-in-mud.png";
import maintainerTeam from "../../../assets/flooded-gate/maintainer-team.png";
// Flooded Gate assets
import floodedGateNpc from "../../../assets/flooded-gate/npc.png";
import floodedGateReward from "../../../assets/flooded-gate/reward.png";
import tideliftLogo from "../../../assets/flooded-gate/tidelift-logo.png";
// Validation Clearing assets
import honeyDiagram from "../../../assets/validation-clearing/honey-diagram.png";
import mirrordDiagram from "../../../assets/validation-clearing/mirrord-diagram.png";
import ornateHandMirror from "../../../assets/validation-clearing/ornate-hand-mirror.png";
import validationClearingReward from "../../../assets/validation-clearing/reward.png";
import voteDemoIcon from "../../../assets/validation-clearing/vote-demo-icon.png";
import { ZoneTypes } from "../../../core/constants.js";

/**
 * The Bottleneck Canyon Quest - Chapter Data
 *
 * A journey through the AI-Forged Lands where a humble traveler
 * discovers the three major bottlenecks created or amplified by AI.
 *
 * Thesis: AI code generation has shifted where software bottlenecks exist,
 * but has not eliminated the need for validation. In fact, it has amplified it.
 */

/**
 * @typedef {import("../quest-types.js").LevelConfig} LevelConfig
 */

/** @returns {Record<string, LevelConfig>} */
export const getBottleneckCanyonChapters = () => ({
	"ai-forged-lands": {
		id: "ai-forged-lands",
		title: msg("The AI-Forged Lands"),
		// No description - skip narrative slide, go straight to content
		problemTitle: msg("Speed Has Consequences"),
		problemDesc: html`
			<div style="display: flex; flex-direction: column; gap: 1.5rem; max-width: 600px; margin: 0 auto;">
				<div style="padding: 1.5rem; background: rgba(117, 109, 243, 0.1); border-radius: 12px; border-left: 4px solid var(--brand-main-purple);">
					<p style="margin: 0; font-size: 1.3rem;">${msg("We're increasingly using tools with AI features.")}</p>
				</div>
				<div style="padding: 1.5rem; background: rgba(117, 109, 243, 0.1); border-radius: 12px; border-left: 4px solid var(--brand-main-purple);">
					<p style="margin: 0; font-size: 1.3rem;">${msg("In some areas, those tools help a lot.")}</p>
				</div>
				<div style="padding: 1.5rem; background: rgba(243, 104, 105, 0.15); border-radius: 12px; border-left: 4px solid var(--brand-blush-red);">
					<p style="margin: 0; font-size: 1.3rem;">${msg("In other areas, AI doesn't help at all,and in some cases, it actually makes things worse.")}</p>
				</div>
			</div>
		`,
		solutionTitle: msg("Two Domains Under Pressure"),
		solutionDesc: html`
			<div style="display: flex; gap: 2rem; justify-content: center; align-items: stretch; flex-wrap: wrap; margin: 1rem 0;">
				<div style="flex: 1; min-width: 200px; max-width: 300px; text-align: center; padding: 1.5rem; background: rgba(117, 109, 243, 0.1); border-radius: 12px; border: 2px solid var(--brand-main-purple);">
					<img src="${iconAlarm}" alt="Alarm" style="width: 80px; height: 80px; margin-bottom: 1rem;" />
					<h3 style="margin: 0 0 0.5rem 0; color: var(--brand-blush-red);">${msg("Open Source Security")}</h3>
					<p style="margin: 0; font-size: 1.1rem; opacity: 1;">${msg("Maintainer burnout and CVE system strain")}</p>
				</div>
				<div style="flex: 1; min-width: 200px; max-width: 300px; text-align: center; padding: 1.5rem; background: rgba(117, 109, 243, 0.1); border-radius: 12px; border: 2px solid var(--brand-main-purple);">
					<img src="${iconInfinity}" alt="Loop" style="width: 80px; height: 80px; margin-bottom: 1rem;" />
					<h3 style="margin: 0 0 0.5rem 0; color: var(--brand-main-purple);">${msg("The Inner Dev Loop")}</h3>
					<p style="margin: 0; font-size: 1.1rem; opacity: 1;">${msg("AI doesn't eliminate CI/CD waiting")}</p>
				</div>
			</div>
		`,
		commonDenominator: html`
			<div style="text-align: center; margin: 1rem 0;">
				<div style="display: flex; gap: 1rem; justify-content: center; align-items: center; margin-bottom: 2rem;">
					<img src="${iconAlarm}" alt="Security" style="width: 60px; height: 60px;" />
					<span style="font-size: 2.5rem; color: var(--brand-main-purple);">+</span>
					<img src="${iconInfinity}" alt="Loop" style="width: 60px; height: 60px;" />
					<span style="font-size: 2.5rem; color: var(--brand-main-purple);">=</span>
					<img src="${iconValidation}" alt="Validation" style="width: 70px; height: 70px;" />
				</div>
				<h3 style="margin: 0 0 1.5rem 0; color: var(--brand-main-purple); font-size: 1.8rem;">${msg("The Common Denominator: Validation")}</h3>
				<div style="display: flex; flex-direction: column; gap: 1rem; max-width: 550px; margin: 0 auto;">
					<div style="padding: 1.5rem; background: rgba(117, 109, 243, 0.2); border-radius: 12px; border: 2px solid var(--brand-main-purple);">
						<p style="margin: 0; font-size: 1.3rem;"><strong>${msg("Better validation is the bottleneck breaker.")}</strong></p>
					</div>
				</div>
			</div>
		`,
		rewardExplanation: html`
			<div style="display: flex; flex-direction: row; gap: 1.5rem; max-width: 900px; margin: 0 auto; flex-wrap: wrap; justify-content: center;">
				<div style="flex: 1; min-width: 250px; padding: 1.5rem; background: rgba(117, 109, 243, 0.15); border-radius: 12px; border-top: 4px solid var(--brand-main-purple);">
					<p style="margin: 0; font-size: 1.2rem;">${msg("You receive the Fractured Compass,a symbol of the broken pathways ahead.")}</p>
				</div>
				<div style="flex: 1; min-width: 250px; padding: 1.5rem; background: rgba(117, 109, 243, 0.15); border-radius: 12px; border-top: 4px solid var(--brand-main-purple);">
					<p style="margin: 0; font-size: 1.2rem;">${msg("Each fragment points to a different area where validation has cracked under AI pressure.")}</p>
				</div>
				<div style="flex: 1; min-width: 250px; padding: 1.5rem; background: rgba(117, 109, 243, 0.25); border-radius: 12px; border: 2px solid var(--brand-main-purple);">
					<p style="margin: 0; font-size: 1.2rem;"><strong>${msg("Follow the compass to understand each fracture before finding the solution.")}</strong></p>
				</div>
			</div>
		`,
		showTimeline: true,
		backgroundStyle: `url('/assets/ai-forged-lands/background.png')`,
		npc: {
			name: msg("The Guide"),
			image: "/assets/ai-forged-lands/npc.png",
			position: { x: 35, y: 50 },
		},
		reward: {
			name: msg("Fractured Compass"),
			image: "/assets/ai-forged-lands/reward.png",
			position: { x: 55, y: 40 },
		},
		hero: {
			image: "/assets/ai-forged-lands/hero.png",
			reward: "/assets/ai-forged-lands/hero-reward.png",
		},
		startPos: { x: 85, y: 20 },
		exitZone: {
			x: 5,
			y: 75,
			width: 20,
			height: 15,
			label: msg("To the Flooded Gate"),
		},
	},

	"flooded-gate": {
		id: "flooded-gate",
		title: msg("The Flooded OSS Maintainer Gate"),
		// No description - skip narrative slide, go straight to content
		problemTitle: msg("The Flood of Reports"),
		problemDesc: html`
			<div style="display: flex; flex-direction: column; gap: 1rem; max-width: 600px; margin: 0 auto;">
				<div style="padding: 1.5rem; background: rgba(117, 109, 243, 0.1); border-radius: 12px; border-left: 4px solid var(--brand-main-purple);">
					<p style="margin: 0; font-size: 1.3rem;">${msg("Open source projects are overwhelmed by vulnerability reports.")}</p>
				</div>
				<div style="padding: 1.5rem; background: rgba(243, 104, 105, 0.15); border-radius: 12px; border-left: 4px solid var(--brand-blush-red);">
					<p style="margin: 0; font-size: 1.3rem;">${msg("Many are AI-generated, low-quality, or outright incorrect.")}</p>
				</div>
			</div>
		`,
		contentSlides: [
			// Slide 2: Bug bounty platforms
			html`
				<div style="display: flex; gap: 2rem; align-items: center; flex-wrap: wrap; justify-content: center;">
					<div style="flex: 1; min-width: 250px; max-width: 400px; display: flex; flex-direction: column; gap: 1rem;">
						<div style="padding: 1.25rem; background: rgba(117, 109, 243, 0.1); border-radius: 12px;">
							<p style="margin: 0; font-size: 1.2rem;">${msg("The incentive structure rewards volume over accuracy.")}</p>
						</div>
						<div style="padding: 1.25rem; background: rgba(117, 109, 243, 0.1); border-radius: 12px;">
							<p style="margin: 0; font-size: 1.2rem;">${msg("Open source projects like Django and Curl offer bug bounties through platforms like HackerOne.")}</p>
						</div>
						<div style="padding: 1.25rem; background: rgba(243, 104, 105, 0.15); border-radius: 12px; border: 2px solid var(--brand-blush-red);">
							<p style="margin: 0; font-size: 1.2rem;"><strong>${msg("If 1 report in 100 is accepted, that's still money in the bank.")}</strong></p>
						</div>
					</div>
					<div style="flex-shrink: 0;">
						<img src="${desperateHacker}" alt="Desperate hacker" style="width: 200px; height: auto;" />
					</div>
				</div>
			`,
			// Slide 3: Daniel Stenberg story
			html`
				<div style="display: flex; gap: 2rem; align-items: center; flex-wrap: wrap; justify-content: center;">
					<div style="flex-shrink: 0;">
						<img src="${floodedGateNpc}" alt="Daniel Stenberg" style="width: 220px; height: auto;" />
					</div>
					<div style="flex: 1; min-width: 250px; max-width: 450px; display: flex; flex-direction: column; gap: 1rem;">
						<div style="padding: 1.25rem; background: rgba(117, 109, 243, 0.1); border-radius: 12px;">
							<p style="margin: 0; font-size: 1.2rem;"><strong>${msg("Daniel Stenberg")}</strong> ${msg("has maintained Curl for over 25 years.")}</p>
						</div>
						<div style="padding: 1.25rem; background: rgba(117, 109, 243, 0.1); border-radius: 12px;">
							<p style="margin: 0; font-size: 1.2rem;">${msg("He describes the strain this creates:")}</p>
						</div>
						<div style="padding: 1.25rem; background: rgba(243, 104, 105, 0.15); border-radius: 12px; border-left: 4px solid var(--brand-blush-red);">
							<p style="margin: 0; font-size: 1.2rem; font-style: italic;">${msg('"The emotional toll of processing mind-numbing stupidities is overwhelming the team."')}</p>
						</div>
					</div>
				</div>
			`,
			// Slide 4: The team and the math
			html`
				<div style="text-align: center;">
					<img src="${maintainerTeam}" alt="Overwhelmed maintainer team" style="width: 380px; height: auto; margin-bottom: 1.5rem;" />
					<div style="display: flex; gap: 1.5rem; justify-content: center; flex-wrap: wrap; margin-top: 1rem;">
						<div style="background: rgba(117, 109, 243, 0.1); padding: 1rem; border-radius: 8px; min-width: 140px;">
							<div style="font-size: 1.5em; font-weight: bold; color: var(--brand-main-purple);">7</div>
							<div style="font-size: 1.1rem;">${msg("volunteers")}</div>
						</div>
						<div style="background: rgba(117, 109, 243, 0.1); padding: 1rem; border-radius: 8px; min-width: 140px;">
							<div style="font-size: 1.5em; font-weight: bold; color: var(--brand-main-purple);">~3 hrs</div>
							<div style="font-size: 1.1rem;">${msg("per week each")}</div>
						</div>
						<div style="background: rgba(243, 104, 105, 0.1); padding: 1rem; border-radius: 8px; min-width: 140px;">
							<div style="font-size: 1.5em; font-weight: bold; color: var(--brand-blush-red);">2/week</div>
							<div style="font-size: 1.1rem;">${msg("reports (July 2025)")}</div>
						</div>
					</div>
					<p style="margin-top: 1.5rem; opacity: 1;">${msg("Each report requires multiple maintainers to investigate.")}</p>
					<p><strong>${msg("The math doesn't add up.")}</strong></p>
				</div>
			`,
			// Slide 5: Real HackerOne interactions
			html`
				<div style="text-align: center;">
					<div style="padding: 1.25rem; background: rgba(117, 109, 243, 0.1); border-radius: 12px; display: inline-block; margin-bottom: 1.5rem;">
						<p style="margin: 0; font-size: 1.2rem;">${msg("A typical interaction Daniel has had to deal with:")}</p>
					</div>
					<div>
						<img src="${hackeroneInteractive}" alt="HackerOne interaction screenshot" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);" />
					</div>
				</div>
			`,
			// Slide 6: Curl stopped paying
			html`
				<div style="text-align: center;">
					<p style="margin-bottom: 1rem;"><strong>${msg("Curl has officially stopped paying for vulnerability reports.")}</strong></p>
					<p style="margin-bottom: 1.5rem;">${msg("The pressure became unsustainable.")}</p>
					<img src="${curlStoppedPaying}" alt="Curl announcement" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);" />
				</div>
			`,
			// Slide 7: Two surveys
			html`
				<div style="text-align: center;">
					<p style="margin-bottom: 1.5rem;"><strong>${msg("Two worrying surveys paint the same picture:")}</strong></p>
					<div style="display: flex; gap: 2rem; justify-content: center; flex-wrap: wrap; margin-bottom: 1.5rem;">
						<div style="flex: 1; min-width: 220px; max-width: 280px; padding: 1.5rem; background: rgba(117, 109, 243, 0.1); border-radius: 12px;">
							<img src="${intelLogo}" alt="Intel" style="width: 80px; height: auto; margin-bottom: 1rem;" />
							<p style="font-size: 1.1rem; margin-bottom: 0.5rem;">${msg("Intel Open Source Community Survey")}</p>
							<div style="font-size: 1.8em; font-weight: bold; color: var(--brand-blush-red);">45%</div>
							<p style="font-size: 1rem; opacity: 1;">${msg("identify maintainer burnout as top challenge")}</p>
						</div>
						<div style="flex: 1; min-width: 220px; max-width: 280px; padding: 1.5rem; background: rgba(117, 109, 243, 0.1); border-radius: 12px;">
							<img src="${tideliftLogo}" alt="Tidelift" style="width: 80px; height: auto; margin-bottom: 1rem;" />
							<p style="font-size: 1.1rem; margin-bottom: 0.5rem;">${msg("2024 Tidelift Maintainer Survey")}</p>
							<div style="font-size: 1.8em; font-weight: bold; color: var(--brand-blush-red);">58%</div>
							<p style="font-size: 1rem; opacity: 1;">${msg("have quit (22%) or considered quitting (36%)")}</p>
						</div>
					</div>
					<img src="${maintainerInMud}" alt="Maintainer sinking" style="width: 200px; height: auto; margin-top: 1rem;" />
				</div>
			`,
		],
		rewardExplanation: html`
			<div style="display: flex; flex-direction: row; gap: 1.5rem; max-width: 900px; margin: 0 auto; flex-wrap: wrap; justify-content: center;">
				<div style="flex: 1; min-width: 250px; padding: 1.5rem; background: rgba(117, 109, 243, 0.15); border-radius: 12px; border-top: 4px solid var(--brand-main-purple);">
					<p style="margin: 0; font-size: 1.2rem;">${msg("You receive the Burden Stone, a weight that cannot be set down.")}</p>
				</div>
				<div style="flex: 1; min-width: 250px; padding: 1.5rem; background: rgba(117, 109, 243, 0.15); border-radius: 12px; border-top: 4px solid var(--brand-main-purple);">
					<p style="margin: 0; font-size: 1.2rem;">${msg("It represents the realization that maintainers are carrying an unsustainable load.")}</p>
				</div>
				<div style="flex: 1; min-width: 250px; padding: 1.5rem; background: rgba(117, 109, 243, 0.25); border-radius: 12px; border: 2px solid var(--brand-main-purple);">
					<p style="margin: 0; font-size: 1.2rem;"><strong>${msg("They are on their last legs. Something must change.")}</strong></p>
				</div>
			</div>
		`,
		backgroundStyle: `url('/assets/flooded-gate/background.png')`,
		npc: {
			name: msg("Weary Maintainer"),
			image: "/assets/flooded-gate/poor-maintainer.png",
			position: { x: 30, y: 55 },
		},
		reward: {
			name: msg("Burden Stone"),
			image: "/assets/flooded-gate/reward.png",
			position: { x: 60, y: 35 },
		},
		hero: {
			image: "/assets/flooded-gate/hero.png",
			reward: "/assets/flooded-gate/hero-reward.png",
		},
		startPos: { x: 80, y: 15 },
		exitZone: {
			x: 10,
			y: 80,
			width: 25,
			height: 15,
			label: msg("To the Cracked Archive"),
		},
	},

	"cracked-archive": {
		id: "cracked-archive",
		title: msg("The Cracked Vulnerability Archive"),
		// No description - skip narrative slide, go straight to content
		problemTitle: msg("The Foundation Everyone Depends On"),
		problemDesc: html`
			<div style="display: flex; gap: 2rem; align-items: center; flex-wrap: wrap; justify-content: center;">
				<div style="flex: 1; min-width: 250px; max-width: 350px;">
					<img src="${cveMeme}" alt="CVE infrastructure meme" style="width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);" />
				</div>
				<div style="flex: 1; min-width: 250px; max-width: 400px; display: flex; flex-direction: column; align-items: center; gap: 1rem;">
					<img src="${cveTome}" alt="CVE Tome" style="width: 120px; height: auto;" />
					<p style="text-align: center; font-size: 1.1em;">${msg("Modern digital infrastructure depends on a critical vulnerability tracking system: the CVE Program.")}</p>
				</div>
			</div>
		`,
		contentSlides: [
			// Slide 2: MITRE and the CVE program - three columns
			html`
				<div style="display: flex; gap: 2rem; align-items: center; justify-content: center; flex-wrap: wrap;">
					<div style="flex-shrink: 0;">
						<img src="${cveLandingPage}" alt="CVE landing page" style="width: 380px; height: auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);" />
					</div>
					<div style="flex: 1; min-width: 250px; max-width: 350px; display: flex; flex-direction: column; gap: 1rem;">
						<h3 style="margin: 0; color: var(--brand-main-purple);">${msg("The CVE Program")}</h3>
						<div style="padding: 1.25rem; background: rgba(117, 109, 243, 0.1); border-radius: 12px;">
							<p style="margin: 0; font-size: 1.1rem;">${msg("MITRE, a US not-for-profit, was maintaining this database.")}</p>
						</div>
						<div style="padding: 1.25rem; background: rgba(243, 104, 105, 0.15); border-radius: 12px; border: 2px solid var(--brand-blush-red);">
							<p style="margin: 0; font-size: 1.2rem;"><strong style="color: var(--brand-blush-red);">${msg("The contract lapsed in April 2025.")}</strong></p>
						</div>
					</div>
					<div style="flex-shrink: 0;">
						<img src="${mitrePillar}" alt="MITRE pillar" style="width: 200px; height: auto;" />
					</div>
				</div>
			`,
			// Slide 3: CISA steps in
			html`
				<div style="display: flex; gap: 2rem; align-items: center; flex-wrap: wrap; justify-content: center;">
					<div style="flex-shrink: 0;">
						<img src="${cisaLogo}" alt="CISA logo" style="width: 220px; height: auto;" />
					</div>
					<div style="flex: 1; min-width: 280px; max-width: 450px; display: flex; flex-direction: column; gap: 1rem;">
						<h3 style="margin: 0; color: var(--brand-main-purple);">${msg("CISA Steps In")}</h3>
						<div style="padding: 1.25rem; background: rgba(117, 109, 243, 0.1); border-radius: 12px;">
							<p style="margin: 0; font-size: 1.2rem;">${msg("The Cybersecurity and Infrastructure Security Agency extended MITRE's CVE contract at the last minute by about 11 months, until March 2026.")}</p>
						</div>
					</div>
				</div>
			`,
			// Slide 4: Growth era to quality era
			html`
				<div style="text-align: center; max-width: 900px; margin: 0 auto;">
					<h3 style="margin-bottom: 1.5rem; color: var(--brand-main-purple);">${msg("From Growth Era to Quality Era")}</h3>
					<div style="padding: 1.5rem; background: rgba(117, 109, 243, 0.1); border-radius: 12px; margin-bottom: 1.5rem;">
						<p style="margin: 0; font-size: 1.3rem;">${msg("In late 2025, CISA announced a shift: prioritizing validation over volume.")}</p>
					</div>
					<div style="display: flex; gap: 1.5rem; justify-content: center; flex-wrap: wrap;">
						<div style="flex: 1; min-width: 200px; max-width: 250px; padding: 1.25rem; background: rgba(117, 109, 243, 0.15); border-radius: 12px; border-top: 4px solid var(--brand-main-purple);">
							<p style="margin: 0; font-size: 1.1rem;">${msg("Better data quality")}</p>
						</div>
						<div style="flex: 1; min-width: 200px; max-width: 250px; padding: 1.25rem; background: rgba(117, 109, 243, 0.15); border-radius: 12px; border-top: 4px solid var(--brand-main-purple);">
							<p style="margin: 0; font-size: 1.1rem;">${msg("Stronger partnerships")}</p>
						</div>
						<div style="flex: 1; min-width: 200px; max-width: 250px; padding: 1.25rem; background: rgba(117, 109, 243, 0.15); border-radius: 12px; border-top: 4px solid var(--brand-main-purple);">
							<p style="margin: 0; font-size: 1.1rem;">${msg("Modern infrastructure")}</p>
						</div>
					</div>
				</div>
			`,
			// Slide 5: The results - three boxes + scanning bots column
			html`
				<div style="display: flex; gap: 2rem; align-items: center; justify-content: center; flex-wrap: wrap;">
					<div style="flex: 1; min-width: 400px; max-width: 500px;">
						<h3 style="margin-bottom: 1.5rem; color: var(--brand-blush-red);">${msg("What's at Stake")}</h3>
						<div style="display: flex; flex-direction: column; gap: 1rem;">
							<div style="padding: 1rem; background: rgba(243, 104, 105, 0.1); border-radius: 8px;">
								<p style="margin: 0;">${msg("The vulnerability tracking system is becoming less trustworthy, exactly when we need it most.")}</p>
							</div>
							<div style="padding: 1rem; background: rgba(243, 104, 105, 0.1); border-radius: 8px;">
								<p style="margin: 0;">${msg("Security teams can't rely on CVEs to prioritize.")}</p>
							</div>
							<div style="padding: 1rem; background: rgba(243, 104, 105, 0.1); border-radius: 8px;">
								<p style="margin: 0;">${msg("Developers don't trust vulnerability scanners — false-positive rates are too high.")}</p>
							</div>
						</div>
					</div>
					<div style="flex-shrink: 0;">
						<img src="${scanningBots}" alt="Scanning bots" style="width: 320px; height: auto;" />
					</div>
				</div>
			`,
			// Slide 5b: The deteriorating conclusion
			html`
				<div style="display: flex; gap: 2rem; align-items: center; justify-content: center; flex-wrap: wrap;">
					<div style="flex: 1; min-width: 400px; max-width: 500px;">
						<h3 style="margin-bottom: 1.5rem; color: var(--brand-blush-red);">${msg("What's at Stake")}</h3>
						<div style="display: flex; flex-direction: column; gap: 1rem; opacity: 0.85;">
							<div style="padding: 1rem; background: rgba(243, 104, 105, 0.1); border-radius: 8px;">
								<p style="margin: 0;">${msg("The vulnerability tracking system is becoming less trustworthy, exactly when we need it most.")}</p>
							</div>
							<div style="padding: 1rem; background: rgba(243, 104, 105, 0.1); border-radius: 8px;">
								<p style="margin: 0;">${msg("Security teams can't rely on CVEs to prioritize.")}</p>
							</div>
							<div style="padding: 1rem; background: rgba(243, 104, 105, 0.1); border-radius: 8px;">
								<p style="margin: 0;">${msg("Developers don't trust vulnerability scanners — false-positive rates are too high.")}</p>
							</div>
						</div>
						<p style="margin-top: 1.5rem; font-size: 1.3em; padding: 1rem; background: rgba(243, 104, 105, 0.2); border: 2px solid var(--brand-blush-red); border-radius: 8px; text-align: center;">
							<strong style="color: var(--brand-blush-red);">${msg("The whole system is deteriorating.")}</strong>
						</p>
					</div>
					<div style="flex-shrink: 0; opacity: 0.85;">
						<img src="${scanningBots}" alt="Scanning bots" style="width: 320px; height: auto;" />
					</div>
				</div>
			`,
			// Slide 6a: Solutions - First block
			html`
				<div style="text-align: center; max-width: 600px; margin: 0 auto;">
					<h3 style="margin-bottom: 1.5rem; color: var(--brand-main-purple);">${msg("What Can Be Done?")}</h3>
					<div style="text-align: left;">
						<div style="margin-bottom: 1.5rem; padding: 1rem; background: rgba(117, 109, 243, 0.1); border-radius: 8px;">
							<strong>${msg("AI Disclosure")}</strong>
							<p style="margin: 0.5rem 0 0 0; font-size: 1.1rem; opacity: 1;">${msg("Curl and Django now ask submitters whether AI was used.")}</p>
						</div>
					</div>
				</div>
			`,
			// Slide 6b: Solutions - Second block
			html`
				<div style="text-align: center; max-width: 600px; margin: 0 auto;">
					<h3 style="margin-bottom: 1.5rem; color: var(--brand-main-purple);">${msg("What Can Be Done?")}</h3>
					<div style="text-align: left;">
						<div style="margin-bottom: 1.5rem; padding: 1rem; background: rgba(117, 109, 243, 0.1); border-radius: 8px; opacity: 0.855;">
							<strong>${msg("AI Disclosure")}</strong>
							<p style="margin: 0.5rem 0 0 0; font-size: 1.1rem; opacity: 1;">${msg("Curl and Django now ask submitters whether AI was used.")}</p>
						</div>
						<div style="margin-bottom: 1.5rem; padding: 1rem; background: rgba(117, 109, 243, 0.1); border-radius: 8px;">
							<strong>${msg("Rethinking Incentives")}</strong>
							<p style="margin: 0.5rem 0 0 0; font-size: 1.1rem; opacity: 1;">${msg("Curl has removed financial rewards from their bug bounty program.")}</p>
						</div>
					</div>
				</div>
			`,
			// Slide 6c: Solutions - Third block (final)
			html`
				<div style="text-align: center; max-width: 600px; margin: 0 auto;">
					<h3 style="margin-bottom: 1.5rem; color: var(--brand-main-purple);">${msg("What Can Be Done?")}</h3>
					<div style="text-align: left;">
						<div style="margin-bottom: 1.5rem; padding: 1rem; background: rgba(117, 109, 243, 0.1); border-radius: 8px; opacity: 0.855;">
							<strong>${msg("AI Disclosure")}</strong>
							<p style="margin: 0.5rem 0 0 0; font-size: 1.1rem; opacity: 1;">${msg("Curl and Django now ask submitters whether AI was used.")}</p>
						</div>
						<div style="margin-bottom: 1.5rem; padding: 1rem; background: rgba(117, 109, 243, 0.1); border-radius: 8px; opacity: 0.855;">
							<strong>${msg("Rethinking Incentives")}</strong>
							<p style="margin: 0.5rem 0 0 0; font-size: 1.1rem; opacity: 1;">${msg("Curl has removed financial rewards from their bug bounty program.")}</p>
						</div>
						<div style="padding: 1rem; background: rgba(243, 104, 105, 0.15); border-radius: 8px; border: 2px solid var(--brand-blush-red);">
							<strong style="color: var(--brand-blush-red);">${msg("What Everyone Agrees On")}</strong>
							<p style="margin: 0.5rem 0 0 0; font-size: 1.1rem;">${msg("Stricter submission requirements with proven validation.")}</p>
						</div>
					</div>
				</div>
			`,
		],
		rewardExplanation: html`
			<div style="display: flex; flex-direction: row; gap: 1.5rem; max-width: 900px; margin: 0 auto; flex-wrap: wrap; justify-content: center;">
				<div style="flex: 1; min-width: 250px; padding: 1.5rem; background: rgba(117, 109, 243, 0.15); border-radius: 12px; border-top: 4px solid var(--brand-main-purple);">
					<p style="margin: 0; font-size: 1.2rem;">${msg("You receive the Trust Shard, a fragment of something that was once whole.")}</p>
				</div>
				<div style="flex: 1; min-width: 250px; padding: 1.5rem; background: rgba(117, 109, 243, 0.15); border-radius: 12px; border-top: 4px solid var(--brand-main-purple);">
					<p style="margin: 0; font-size: 1.2rem;">${msg("It represents the eroding trust in the systems we all depend on.")}</p>
				</div>
				<div style="flex: 1; min-width: 250px; padding: 1.5rem; background: rgba(117, 109, 243, 0.25); border-radius: 12px; border: 2px solid var(--brand-main-purple);">
					<p style="margin: 0; font-size: 1.2rem;"><strong>${msg("Without validation, trust crumbles. This shard is a reminder.")}</strong></p>
				</div>
			</div>
		`,
		backgroundStyle: `url('/assets/cracked-archive/background.png')`,
		npc: {
			name: msg("The Archive Keeper"),
			image: "/assets/cracked-archive/npc.png",
			position: { x: 40, y: 50 },
		},
		reward: {
			name: msg("Trust Shard"),
			image: "/assets/cracked-archive/reward.png",
			position: { x: 65, y: 40 },
		},
		hero: {
			image: "/assets/cracked-archive/hero.png",
			reward: "/assets/cracked-archive/hero-reward.png",
		},
		startPos: { x: 15, y: 20 },
		exitZone: {
			x: 80,
			y: 75,
			width: 18,
			height: 15,
			label: msg("To the Endless Loop"),
		},
	},

	"endless-loop": {
		id: "endless-loop",
		title: msg("The Endless Loop"),
		// No description - skip narrative slide
		problemTitle: msg("Even AI Has to Wait"),
		problemDesc: html`
			<div style="display: flex; gap: 2rem; align-items: center; flex-wrap: wrap; justify-content: center;">
				<div style="flex: 1; min-width: 280px; max-width: 400px; display: flex; flex-direction: column; gap: 1rem;">
					<div style="padding: 1.25rem; background: rgba(117, 109, 243, 0.1); border-radius: 12px;">
						<p style="margin: 0; font-size: 1.2rem;">${msg("AI coding assistants have accelerated how quickly developers write and modify code.")}</p>
					</div>
					<div style="padding: 1.25rem; background: rgba(117, 109, 243, 0.1); border-radius: 12px;">
						<p style="margin: 0; font-size: 1.2rem;">${msg("But the inner dev loop still has the same bottleneck.")}</p>
					</div>
					<div style="padding: 1.25rem; background: rgba(117, 109, 243, 0.2); border-radius: 12px; border: 2px solid var(--brand-main-purple);">
						<p style="margin: 0; font-size: 1.2rem;"><strong style="color: var(--brand-main-purple);">${msg("Even AI has to wait for CI/CD to complete.")}</strong></p>
					</div>
				</div>
				<div style="flex-shrink: 0;">
					<img src="${aiWaiting}" alt="AI agent waiting" style="width: 200px; height: auto;" />
				</div>
			</div>
		`,
		contentSlides: [
			// Slide 2: The Bottlenecked Loop - large asset, no header
			html`
				<div style="text-align: center;">
					<img src="${bottleneckedLoop}" alt="The Bottlenecked Loop" style="max-width: 95%; max-height: 450px; height: auto;" />
				</div>
			`,
			// Slide 3: Definition of the bottleneck - no header
			html`
				<div style="text-align: center; max-width: 600px; margin: 0 auto;">
					<p style="font-size: 1.2em; padding: 1.5rem; background: rgba(243, 104, 105, 0.1); border-radius: 12px; border: 2px solid var(--brand-blush-red);">
						${msg("Waiting for pipelines and deployment to run to completion in order to test your code in a realistic environment.")}
					</p>
				</div>
			`,
			// Slide 4: Why is this an issue? - no header
			html`
				<div style="text-align: center; max-width: 650px; margin: 0 auto;">
					<div style="display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center;">
						<div style="padding: 1rem; background: rgba(117, 109, 243, 0.1); border-radius: 8px; flex: 1; min-width: 180px; max-width: 200px;">
							<p style="margin: 0; font-size: 1.1rem;">${msg("Developers wait several minutes for CI")}</p>
						</div>
						<div style="padding: 1rem; background: rgba(117, 109, 243, 0.1); border-radius: 8px; flex: 1; min-width: 180px; max-width: 200px;">
							<p style="margin: 0; font-size: 1.1rem;">${msg("Context-switching 3-4 times while waiting")}</p>
						</div>
						<div style="padding: 1rem; background: rgba(117, 109, 243, 0.1); border-radius: 8px; flex: 1; min-width: 180px; max-width: 200px;">
							<p style="margin: 0; font-size: 1.1rem;">${msg("Each context switch has cognitive costs that accumulate")}</p>
						</div>
						<div style="padding: 1rem; background: rgba(117, 109, 243, 0.1); border-radius: 8px; flex: 1; min-width: 180px; max-width: 200px;">
							<p style="margin: 0; font-size: 1.1rem;">${msg("Ideally one iteration , reality is often multiple")}</p>
						</div>
						<div style="padding: 1rem; background: rgba(243, 104, 105, 0.15); border-radius: 8px; border: 2px solid var(--brand-blush-red); flex: 1; min-width: 280px; max-width: 350px;">
							<p style="margin: 0;"><strong>${msg("The longer the feedback loop, the more disconnected the developer becomes.")}</strong></p>
						</div>
					</div>
				</div>
			`,
			// Slide 5: What if there was a different loop? - no header, bigger asset
			html`
				<div style="text-align: center;">
					<img src="${validatedLoop}" alt="The Validated Loop" style="max-width: 95%; max-height: 500px; height: auto;" />
				</div>
			`,
		],
		rewardExplanation: html`
			<div style="display: flex; flex-direction: row; gap: 1.5rem; max-width: 900px; margin: 0 auto; flex-wrap: wrap; justify-content: center;">
				<div style="flex: 1; min-width: 250px; padding: 1.5rem; background: rgba(117, 109, 243, 0.15); border-radius: 12px; border-top: 4px solid var(--brand-main-purple);">
					<p style="margin: 0; font-size: 1.2rem;">${msg("You receive the Hourglass Fragment, a shard of time reclaimed.")}</p>
				</div>
				<div style="flex: 1; min-width: 250px; padding: 1.5rem; background: rgba(117, 109, 243, 0.15); border-radius: 12px; border-top: 4px solid var(--brand-main-purple);">
					<p style="margin: 0; font-size: 1.2rem;">${msg("Waiting is legacy. Waiting is something we need to avoid.")}</p>
				</div>
				<div style="flex: 1; min-width: 250px; padding: 1.5rem; background: rgba(117, 109, 243, 0.25); border-radius: 12px; border: 2px solid var(--brand-main-purple);">
					<p style="margin: 0; font-size: 1.2rem;"><strong>${msg("We're not getting rid of CI/CD pipelines. We're running them only once we've validated and know the code is ready.")}</strong></p>
				</div>
			</div>
		`,
		backgroundStyle: `url('/assets/endless-loop/background.png')`,
		npc: {
			name: msg("The Waiting Developer"),
			image: "/assets/endless-loop/npc.png",
			position: { x: 35, y: 55 },
		},
		reward: {
			name: msg("Hourglass Fragment"),
			image: "/assets/endless-loop/reward.png",
			position: { x: 55, y: 40 },
		},
		hero: {
			image: "/assets/endless-loop/hero.png",
			reward: "/assets/endless-loop/hero-reward.png",
		},
		startPos: { x: 10, y: 25 },
		exitZone: {
			x: 85,
			y: 50,
			width: 12,
			height: 20,
			label: msg("To the Clearing"),
		},
	},

	"validation-clearing": {
		id: "validation-clearing",
		title: msg("The Validation Clearing"),
		contentSlides: [
			// Slide 1: The common thread - 3-box progressive reveal
			html`
				<div style="text-align: center;">
					<h3 style="color: var(--brand-main-purple, #756DF3); margin-bottom: 1rem;">${msg("The Common Thread")}</h3>
					<p style="margin-bottom: 1.5rem; font-size: 1.1rem;">
						${msg("The solution isn't to slow down generation.")}
						<br />
						<strong>${msg("It's to improve validation.")}</strong>
					</p>
					<div style="display: flex; gap: 1.5rem; justify-content: center; flex-wrap: wrap;">
						<div style="background: linear-gradient(135deg, rgba(117, 109, 243, 0.3), rgba(117, 109, 243, 0.1)); border: 2px solid var(--brand-main-purple, #756DF3); border-radius: 12px; padding: 1.5rem 2rem; text-align: center; min-width: 150px;">
							<div style="font-size: 2rem; margin-bottom: 0.5rem;">⚡</div>
							<div style="font-size: 1.1rem; font-weight: 600;">${msg("Faster")}</div>
							<div style="font-size: 1rem;">${msg("Validation")}</div>
						</div>
						<div style="background: linear-gradient(135deg, rgba(117, 109, 243, 0.3), rgba(117, 109, 243, 0.1)); border: 2px solid var(--brand-main-purple, #756DF3); border-radius: 12px; padding: 1.5rem 2rem; text-align: center; min-width: 150px;">
							<div style="font-size: 2rem; margin-bottom: 0.5rem;">🎯</div>
							<div style="font-size: 1.1rem; font-weight: 600;">${msg("Earlier")}</div>
							<div style="font-size: 1rem;">${msg("Validation")}</div>
						</div>
						<div style="background: linear-gradient(135deg, rgba(117, 109, 243, 0.3), rgba(117, 109, 243, 0.1)); border: 2px solid var(--brand-main-purple, #756DF3); border-radius: 12px; padding: 1.5rem 2rem; text-align: center; min-width: 150px;">
							<div style="font-size: 2rem; margin-bottom: 0.5rem;">💰</div>
							<div style="font-size: 1.1rem; font-weight: 600;">${msg("Cheaper")}</div>
							<div style="font-size: 1rem;">${msg("Validation")}</div>
						</div>
					</div>
				</div>
			`,
			// Slide 2: Developer focus with mirrord diagram
			html`
				<div style="text-align: center;">
					<h3 style="color: var(--brand-main-purple); margin-bottom: 1rem;">${msg("For Developers")}</h3>
					<div style="padding: 1.25rem; background: rgba(117, 109, 243, 0.1); border-radius: 12px; display: inline-block; margin-bottom: 1.5rem;">
						<p style="margin: 0; font-size: 1.2rem;">${msg("Validate code changes earlier, directly from your local machine.")}</p>
					</div>
					<div style="display: flex; justify-content: center;">
						<img
							src="${mirrordDiagram}"
							alt="${msg("mirrord architecture diagram")}"
							style="max-width: 100%; max-height: 350px; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);"
						/>
					</div>
				</div>
			`,
			// Slide 3: Try it yourself - shows the mirror
			html`
				<div style="text-align: center;">
					<h3 style="color: var(--brand-main-purple); margin-bottom: 1rem;">${msg("Now It's Your Turn")}</h3>
					<div style="display: flex; flex-direction: column; gap: 1rem; max-width: 500px; margin: 0 auto 1.5rem auto;">
						<div style="padding: 1.25rem; background: rgba(117, 109, 243, 0.1); border-radius: 12px;">
							<p style="margin: 0; font-size: 1.2rem; font-style: italic;">"${msg("The best way to understand is to experience it yourself.")}"</p>
						</div>
						<div style="padding: 1.25rem; background: rgba(117, 109, 243, 0.15); border-radius: 12px; border: 2px solid var(--brand-main-purple);">
							<p style="margin: 0; font-size: 1.2rem;">${msg("Walk to the Vote app and try the demo.")}</p>
						</div>
					</div>
					<div>
						<img
							src="${ornateHandMirror}"
							alt="${msg("Magic mirror")}"
							style="width: 120px; height: 120px; border-radius: 12px; box-shadow: 0 4px 16px rgba(117, 109, 243, 0.4);"
						/>
					</div>
				</div>
			`,
			// Slide 4: Demo architecture diagram
			html`
				<div style="text-align: center;">
					<h3 style="color: var(--brand-main-purple); margin-bottom: 1rem;">${msg("The Demo Architecture")}</h3>
					<div style="padding: 1.25rem; background: rgba(117, 109, 243, 0.1); border-radius: 12px; display: inline-block; margin-bottom: 1.5rem;">
						<p style="margin: 0; font-size: 1.2rem;">${msg("A voting app with multiple microservices, the perfect playground for local validation.")}</p>
					</div>
					<div style="display: flex; justify-content: center;">
						<img
							src="${honeyDiagram}"
							alt="${msg("Demo voting app architecture")}"
							style="max-width: 100%; max-height: 400px; border-radius: 12px; box-shadow: 0 4px 20px rgba(117, 109, 243, 0.3);"
						/>
					</div>
				</div>
			`,
		],
		backgroundStyle: `url('/assets/validation-clearing/background.png')`,
		npc: {
			name: msg("The MirrorD Sage"),
			image: "/assets/validation-clearing/npc.png",
			position: { x: 45, y: 50 },
		},
		reward: {
			name: msg("Mirror of Validation"),
			image: "/assets/validation-clearing/reward.png",
			position: { x: 60, y: 35 },
		},
		hero: {
			image: "/assets/validation-clearing/hero.png",
			reward: "/assets/validation-clearing/hero-reward.png",
		},
		startPos: { x: 10, y: 50 },
		// Map objects - visual elements on the map
		mapObjects: [
			{
				name: msg("Demo Mirror"),
				image: voteDemoIcon,
				position: { x: 75, y: 50 },
			},
		],
		// Interactive zones - walking to the demo icon triggers the demo URL
		zones: [
			{
				x: 70,
				y: 40,
				width: 15,
				height: 25,
				label: msg("🪞 Try Demo"),
				type: ZoneTypes.OPEN_URL,
				payload: "https://honey-we-have-a-problem.freeddns.org/",
			},
		],
		// Exit to complete the quest
		exitZone: {
			x: 88,
			y: 70,
			width: 10,
			height: 20,
			label: msg("Quest Complete"),
		},
		// Skip confirmation slide - completion happens via the exit zone
		skipConfirmation: true,
	},

	"the-end": {
		id: "the-end",
		title: msg("The End"),
		contentSlides: [
			html`
				<div style="text-align: center;">
					<h3 style="color: var(--brand-main-purple, #756DF3); margin-bottom: 1rem;">${msg("Your Journey Complete")}</h3>
					<p style="font-size: 1.2rem; margin-bottom: 2rem;">
						${msg("Along the way, you gathered these insights:")}
					</p>
					<div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 1.5rem; max-width: 700px; margin: 0 auto;">
						<div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
							<img src="${aiForgedReward}" alt="Fractured Compass" style="width: 64px; height: 64px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);" />
							<span style="font-size: 1rem;">${msg("Fractured Compass")}</span>
						</div>
						<div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
							<img src="${floodedGateReward}" alt="Burden Stone" style="width: 64px; height: 64px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);" />
							<span style="font-size: 1rem;">${msg("Burden Stone")}</span>
						</div>
						<div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
							<img src="${crackedArchiveReward}" alt="Trust Shard" style="width: 64px; height: 64px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);" />
							<span style="font-size: 1rem;">${msg("Trust Shard")}</span>
						</div>
						<div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
							<img src="${endlessLoopReward}" alt="Hourglass Fragment" style="width: 64px; height: 64px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);" />
							<span style="font-size: 1rem;">${msg("Hourglass Fragment")}</span>
						</div>
						<div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
							<img src="${validationClearingReward}" alt="Mirror of Validation" style="width: 64px; height: 64px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);" />
							<span style="font-size: 1rem;">${msg("Mirror of Validation")}</span>
						</div>
					</div>
					<p style="font-size: 1rem; margin-top: 2rem; font-style: italic; opacity: 1;">
						${msg("AI accelerates generation. Validation remains the key.")}
					</p>
				</div>
			`,
		],
		backgroundStyle: `url('/assets/validation-clearing/background.png')`,
		npc: {
			name: msg("The End"),
			image: "/assets/validation-clearing/npc.png",
			position: { x: 50, y: 45 },
		},
		hero: {
			image: "/assets/validation-clearing/hero.png",
			reward: "/assets/validation-clearing/hero-reward.png",
		},
		startPos: { x: 50, y: 70 },
	},
});
