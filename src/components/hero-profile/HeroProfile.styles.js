import { css } from "lit";
import { sharedStyles } from "../../styles/shared.js";

export const heroProfileStyles = [
	...sharedStyles,
	css`
    :host {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      transition: all 0.5s;
    }

    /* Nameplate Elements */
    .name-tag,
    .loading,
    .error {
      position: absolute;
      bottom: -2rem;
      pointer-events: none;
      z-index: 20;
    }

    .loading,
    .error {
      white-space: nowrap;
    }

    .loading {
      animation: bounce 1s infinite;
      font-size: var(--wa-font-size-2xs);
      font-weight: bold;
      text-shadow: var(--wa-shadow-small);
    }
    
    .error {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      color: var(--wa-color-danger-fill-loud);
      font-weight: 900;
      text-shadow: var(--wa-shadow-small);
    }

    .name-tag {
      box-shadow: var(--wa-shadow-small);
      white-space: normal;
      text-align: center;
      line-height: 1.3;
      font-size: var(--wa-font-size-3xs, 9px);
      padding: 0.4em 0.6em;
      min-height: auto;
      height: auto;
    }

    /* Character Image */
    .character-img {
      width: 100%;
      height: 100%;
      aspect-ratio: 1;
	  object-fit: contain;
	  transition: all 0.5s ease-in-out;
    }
    :host(.wa-dark) .character-img {
       filter: drop-shadow(0 0 10px rgba(99,102,241,0.6));
    }
    :host(.injection-legacy-api) .character-img {
       filter: drop-shadow(0 0 10px var(--wa-color-danger-fill-loud));
    }
	:host(.injection-mock-api) .character-img {
       filter: drop-shadow(0 0 10px var(--wa-color-warning-fill-loud));
    }
    :host(.injection-new-api) .character-img {
       filter: drop-shadow(0 0 10px var(--wa-color-brand-fill-loud));
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8,0,1,1); }
      50% { transform: none; animation-timing-function: cubic-bezier(0,0,0.2,1); }
    }
    @keyframes pulse {
      50% { opacity: .5; }
    }
  `,
];
