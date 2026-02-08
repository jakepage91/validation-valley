import { css } from "lit";
import { sharedStyles } from "../../styles/shared.js";

export const questHubStyles = [
	...sharedStyles,
	css`
		:host {
			display: block;
			width: 100%;
			height: 100%;
			overflow-y: auto;
			background-color: var(--brand-dark-purple);
			color: var(--brand-light-grey);
			--wa-font-sans: 'Press Start 2P', monospace;
		}

		.hub-container {
			max-width: 1200px;
			margin: 0 auto;
			padding: var(--wa-space-m);
		}

		@media (min-width: 768px) {
			.hub-container {
				padding: var(--wa-space-xl);
			}
		}

		.hub-header {
			margin-bottom: var(--wa-space-l);
		}

		.hub-navbar {
			display: flex;
			justify-content: flex-end;
			padding: var(--wa-space-xs) 0;
			margin-bottom: var(--wa-space-s);
		}

		.navbar-actions {
			display: flex;
			gap: var(--wa-space-s);
			flex-wrap: wrap;
			justify-content: center;
		}

		.header-content {
			text-align: center;
		}

		.hub-title {
			font-size: var(--wa-font-size-4xl);
			margin: 0 0 var(--wa-space-xs) 0;
			font-family: var(--wa-font-family-heading);
			color: var(--brand-main-purple);
			text-shadow: var(--wa-shadow-small);
		}

		.hub-subtitle {
			font-size: var(--wa-font-size-xl);
			margin: 0;
			color: var(--brand-medium-purple);
		}

		.quests-section {
			margin-bottom: var(--wa-space-xl);
		}

		.hub-description {
			margin: 1rem auto 0 auto;
			max-width: 700px;
			font-size: var(--wa-font-size-s);
			line-height: 1.6;
			color: var(--brand-dark-grey);
		}

		.section-title {
			color: var(--brand-light-grey);
		}

		.hub-footer {
			margin-top: var(--wa-space-xl);
			text-align: center;
		}

		.quests-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: var(--wa-space-s);
		}

		.mascot-container {
			flex-shrink: 0;
		}

		.mascot-image {
			width: 80px;
			height: auto;
		}

		@media (max-width: 600px) {
			.quests-header {
				flex-direction: column;
				text-align: center;
				gap: var(--wa-space-m);
			}

			.mascot-image {
				width: 60px;
			}
		}
	`,
];
