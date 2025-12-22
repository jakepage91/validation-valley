import { css } from "lit";
import { sharedStyles } from "../../styles/shared.js";

export const styles = [
	...sharedStyles,
	css`
			:host {
				position: fixed; inset: 0; z-index: 60; background-color: black;
				display: flex; flex-direction: column; align-items: center; justify-content: center;
				color: white; animation: fadeIn 1s ease-in;
				font-family: var(--wa-font-family-body);
			}
			.victory-screen {
				display: flex; flex-direction: column; align-items: center; justify-content: center;
				width: 100%; height: 100%;
			}
			.victory-title { color: var(--wa-color-warning-fill-loud); text-align: center; animation: pulse 2s infinite; margin-bottom: var(--wa-space-l); font-family: 'Press Start 2P', monospace; }
			.victory-text { display: block; text-align: center; max-width: 28rem; line-height: 2; padding: 0 var(--wa-space-m); }
			
			.rewards-container {
				display: flex; gap: 2rem; margin: 2rem 0; flex-wrap: wrap; justify-content: center;
			}
			.reward-item {
				display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
			}
			.reward-img {
				width: 64px; height: 64px; object-fit: contain; filter: drop-shadow(0 0 10px rgba(255,255,255,0.3));
			}
			.reward-name {
				font-size: 0.8rem; color: #fbbf24;
			}

			.ng-btn {
				margin-top: var(--wa-space-xl); 
				--border-radius: 0;
				font-family: var(--wa-font-family-body);
				animation: bounce 1s infinite;
			}

			@keyframes pulse { 50% { opacity: .5; } }
			@keyframes bounce {
				0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8,0,1,1); }
				50% { transform: none; animation-timing-function: cubic-bezier(0,0,0.2,1); }
			}
			@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
		`,
];
