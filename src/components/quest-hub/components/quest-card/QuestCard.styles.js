import { css } from "lit";

export const questCardStyles = css`
	:host {
		display: block;
	}

	.quest-card {
		height: 100%;
		--spacing: var(--wa-space-m);
	}

	.quest-card.locked {
		cursor: not-allowed;
		opacity: 0.6;
	}

	.quest-content {
		display: flex;
		flex-direction: column;
		flex: 1;
		gap: var(--wa-space-s);
	}

	.quest-description {
		flex: 1;
		margin-bottom: var(--wa-space-m);
	}

	.quest-subtitle {
		font-style: italic;
		color: var(--wa-color-text-quiet);
		margin: 0;
	}

	.progress-info {
		display: flex;
		justify-content: space-between;
		font-size: var(--wa-font-size-2xs);
		margin-bottom: var(--wa-space-3xs);
	}

	.card-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
	}

	.quest-header {
		margin: 0;
		font-size: var(--wa-font-size-m);
		font-weight: var(--wa-font-weight-bold);
		line-height: var(--wa-line-height-condensed);
	}

	.card-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}

	.quest-time {
		opacity: 0.8;
		display: flex;
		align-items: center;
		gap: var(--wa-space-2xs);
		font-size: var(--wa-font-size-xs);
	}

	.card-footer-actions {
		display: flex;
		justify-content: flex-end;
		gap: var(--wa-space-s);
		width: 100%;
	}
`;
