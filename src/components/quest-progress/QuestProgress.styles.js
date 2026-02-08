import { css } from "lit";

export const questProgressStyles = css`
	:host {
		position: fixed;
		left: 1rem;
		top: 50%;
		transform: translateY(-50%);
		z-index: 100;
		pointer-events: auto;
	}

	.progress-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0;
		padding: 0.75rem 0.5rem;
		background: rgba(35, 33, 65, 0.85);
		border-radius: 20px;
		border: 1px solid rgba(117, 109, 243, 0.3);
		backdrop-filter: blur(8px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	}

	.chapter-marker {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: rgba(117, 109, 243, 0.3);
		border: 2px solid rgba(117, 109, 243, 0.5);
		transition: all 0.3s ease;
		position: relative;
		cursor: pointer;
	}

	.chapter-marker:hover {
		transform: scale(1.3);
		box-shadow: 0 0 10px rgba(117, 109, 243, 0.6);
	}

	.chapter-marker:hover .chapter-label {
		opacity: 1;
	}

	.chapter-marker.completed {
		background: var(--brand-main-purple, #756DF3);
		border-color: var(--brand-main-purple, #756DF3);
	}

	.chapter-marker.current {
		background: var(--brand-main-purple, #756DF3);
		border-color: white;
		box-shadow: 0 0 8px var(--brand-main-purple, #756DF3);
		transform: scale(1.2);
	}

	.chapter-marker.current:hover {
		transform: scale(1.3);
	}

	.chapter-marker.upcoming {
		background: transparent;
		border-color: rgba(117, 109, 243, 0.4);
	}

	.connector {
		width: 2px;
		height: 16px;
		background: rgba(117, 109, 243, 0.3);
		transition: background 0.3s ease;
	}

	.connector.completed {
		background: var(--brand-main-purple, #756DF3);
	}

	.chapter-label {
		position: absolute;
		left: 24px;
		top: 50%;
		transform: translateY(-50%);
		font-size: 0.65rem;
		color: rgba(255, 255, 255, 0.7);
		white-space: nowrap;
		opacity: 0;
		transition: opacity 0.2s ease;
		pointer-events: none;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
	}

	.chapter-marker.current .chapter-label {
		opacity: 1;
		color: white;
		font-weight: 500;
	}

	/* Hide on very small screens */
	@media (max-width: 600px) {
		:host {
			display: none;
		}
	}
`;
