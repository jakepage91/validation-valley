import { css } from "lit";

export const styles = css`
		:host {
			display: block;
		}

		wa-dialog {
			--header-spacing: 1.5rem;
			--body-spacing: 1.5rem;
			--footer-spacing: 0;
		}

		/* Customizing the dialog header to match the game's pixel font style */
		wa-dialog::part(title) {
			font-family: var(--wa-font-family-heading);
			font-size: var(--wa-font-size-m);
			color: #fbbf24;
			text-align: center;
			width: 100%;
			text-shadow: var(--wa-shadow-small);
		}

		/* Hide the close button since we have explicit actions */
		wa-dialog::part(close-button) {
			display: none;
		}

		wa-dialog::part(overlay) {
			background-color: rgba(0, 0, 0, 0.8);
			backdrop-filter: blur(4px);
		}

		wa-dialog::part(panel) {
			background-color: #1f2937;
			border: 4px solid #374151;
			border-radius: 0;
			box-shadow: var(--wa-shadow-large);
		}

		.menu-buttons {
			display: flex;
			flex-direction: column;
			gap: 1rem;
			width: 100%;
		}

		.menu-btn {
			width: 100%;
			--border-radius: 0;
			font-family: var(--wa-font-family-body);
			font-size: var(--wa-font-size-2xs);
		}
	`;
