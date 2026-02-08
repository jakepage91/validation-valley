import { css } from "lit";
import { sharedStyles } from "../../styles/shared.js";

export const victoryScreenStyles = [
	...sharedStyles,
	css`
		:host {
			display: flex;
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
			background-color: rgba(0, 0, 0, 0.9);
			color: white;
			align-items: center;
			justify-content: center;
			z-index: 1000;
			animation: fade-in 1s ease-out;
		}

		.victory-screen {
			text-align: center;
			width: 90%;
			max-width: 800px;
			padding: 2rem;
			background: linear-gradient(135deg, var(--brand-dark-purple, #232141) 0%, #1a1833 100%);
			color: white;
			border-radius: 12px;
			box-shadow: 0 0 60px rgba(117, 109, 243, 0.4);
			border: 3px solid var(--brand-main-purple, #756DF3);
			display: flex;
			flex-direction: column;
			align-items: center;
		}

		.victory-title {
			font-family: var(--wa-font-family-heading);
			font-size: var(--wa-font-size-2xl);
			color: var(--brand-main-purple, #756DF3);
			text-shadow: 2px 2px 0 #000;
			margin: 0 0 1rem 0;
			animation: bounce-in 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
		}

		.metalbear-logo {
			width: 100px;
			height: auto;
			margin-bottom: 1rem;
			animation: float 3s ease-in-out infinite;
		}

		.victory-text {
			font-family: var(--wa-font-family-body);
			font-size: var(--wa-font-size-m);
			margin: 0 0 1rem 0;
			line-height: 1.5;
			color: var(--brand-medium-purple, #E4E3FD);
		}

		/* Carousel Container */
		.carousel-container {
			position: relative;
			width: 100%;
			overflow: hidden;
			margin: 1rem 0;
		}

		.carousel-track {
			display: flex;
			width: 200%;
			transition: transform 0.4s ease-in-out;
		}

		.carousel-track.show-qr {
			transform: translateX(-50%);
		}

		.carousel-panel {
			width: 50%;
			flex-shrink: 0;
			padding: 0 1rem;
			box-sizing: border-box;
		}

		.rewards-panel {
			display: flex;
			flex-direction: column;
			align-items: center;
		}

		.rewards-list {
			list-style: none;
			padding: 0;
			margin: 1rem 0;
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			gap: 1.5rem;
			width: 100%;
		}

		.reward-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 0.5rem;
			animation: pop-in 0.5s ease-out backwards;
			animation-delay: calc(var(--index, 0) * 0.15s + 0.3s);
		}

		.reward-img {
			width: 56px;
			height: 56px;
			object-fit: contain;
			filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
		}

		.reward-name {
			font-size: var(--wa-font-size-xs);
			font-weight: bold;
			color: var(--brand-medium-purple, #E4E3FD);
			max-width: 80px;
			text-align: center;
		}

		/* QR Panel */
		.qr-panel {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
		}

		.qr-code {
			width: 160px;
			height: 160px;
			border-radius: 12px;
			background: white;
			padding: 8px;
			box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
		}

		.qr-label {
			font-size: var(--wa-font-size-m);
			font-weight: bold;
			color: var(--brand-main-purple, #756DF3);
			margin-top: 0.75rem;
		}

		.github-ask {
			font-size: var(--wa-font-size-s);
			color: var(--brand-medium-purple, #E4E3FD);
			margin-top: 1rem;
			opacity: 0.85;
		}

		.github-ask a {
			color: var(--brand-main-purple, #756DF3);
			text-decoration: none;
			font-weight: bold;
		}

		.github-ask a:hover {
			text-decoration: underline;
		}

		/* Arrow Button */
		.carousel-arrow {
			position: absolute;
			right: 0.5rem;
			top: 50%;
			transform: translateY(-50%);
			width: 40px;
			height: 40px;
			border-radius: 50%;
			background: var(--brand-main-purple, #756DF3);
			border: none;
			color: white;
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: center;
			transition: all 0.3s ease;
			box-shadow: 0 4px 12px rgba(117, 109, 243, 0.5);
			z-index: 10;
		}

		.carousel-arrow:hover {
			background: #8a82f5;
			transform: translateY(-50%) scale(1.1);
		}

		.carousel-arrow.flipped {
			transform: translateY(-50%) rotate(180deg);
		}

		.carousel-arrow.flipped:hover {
			transform: translateY(-50%) rotate(180deg) scale(1.1);
		}

		.carousel-arrow wa-icon {
			font-size: 1.25rem;
		}

		/* Button */
		.ng-btn {
			margin-top: 1rem;
			font-size: var(--wa-font-size-m);
			--border-radius: 8px;
			--wa-button-background-color: var(--brand-main-purple, #756DF3);
			--wa-button-background-color-hover: #8a82f5;
		}

		/* Animations */
		@keyframes fade-in {
			from { opacity: 0; }
			to { opacity: 1; }
		}

		@keyframes bounce-in {
			0% { transform: scale(0); opacity: 0; }
			60% { transform: scale(1.1); opacity: 1; }
			100% { transform: scale(1); }
		}

		@keyframes pop-in {
			from { transform: scale(0) translateY(20px); opacity: 0; }
			to { transform: scale(1) translateY(0); opacity: 1; }
		}

		@keyframes float {
			0%, 100% { transform: translateY(0); }
			50% { transform: translateY(-6px); }
		}
	`,
];
