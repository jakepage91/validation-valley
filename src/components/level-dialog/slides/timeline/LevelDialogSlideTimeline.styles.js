import { css } from "lit";

export const timelineSlideStyles = css`
	:host {
		display: block;
		width: 100%;
	}

	.timeline-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		padding: 1rem 0;
	}

	.timeline-title {
		font-size: 1.1rem;
		color: var(--brand-main-purple, #756DF3);
		margin: 0;
		text-align: center;
	}

	.timeline-track {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		max-width: 700px;
		position: relative;
	}

	.chapter-node {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		flex: 1;
		max-width: 140px;
		position: relative;
		z-index: 1;
	}

	.chapter-icon {
		width: 60px;
		height: 60px;
		border-radius: 12px;
		overflow: hidden;
		border: 3px solid rgba(117, 109, 243, 0.4);
		background: rgba(35, 33, 65, 0.8);
		transition: all 0.3s ease;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
	}

	.chapter-icon img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.chapter-node.current .chapter-icon {
		border-color: var(--brand-main-purple, #756DF3);
		box-shadow: 0 0 12px var(--brand-main-purple, #756DF3);
		transform: scale(1.1);
	}

	.chapter-node.completed .chapter-icon {
		border-color: var(--brand-main-purple, #756DF3);
		opacity: 0.7;
	}

	.chapter-node.upcoming .chapter-icon {
		border-style: dashed;
		opacity: 0.6;
	}

	.chapter-name {
		font-size: 0.7rem;
		text-align: center;
		color: rgba(255, 255, 255, 0.7);
		line-height: 1.2;
		max-width: 110px;
	}

	.chapter-node.current .chapter-name {
		color: white;
		font-weight: 600;
	}

	.connector-line {
		flex: 0.5;
		height: 3px;
		background: rgba(117, 109, 243, 0.3);
		position: relative;
		margin: 0 -8px;
		margin-bottom: 1.5rem;
	}

	.connector-line.completed {
		background: var(--brand-main-purple, #756DF3);
	}

	.connector-line::after {
		content: "";
		position: absolute;
		right: -6px;
		top: 50%;
		transform: translateY(-50%);
		width: 0;
		height: 0;
		border-left: 6px solid rgba(117, 109, 243, 0.3);
		border-top: 4px solid transparent;
		border-bottom: 4px solid transparent;
	}

	.connector-line.completed::after {
		border-left-color: var(--brand-main-purple, #756DF3);
	}

	.timeline-subtitle {
		font-size: 0.85rem;
		color: rgba(255, 255, 255, 0.6);
		text-align: center;
		margin: 0;
		font-style: italic;
	}
`;
