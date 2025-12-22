import { css } from "lit";

export const styles = css`
    :host {
      position: absolute;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 15%;
      aspect-ratio: 1/1;
      pointer-events: none; /* Prevent blocking clicks if needed, but interaction is usually via keyboard */
    }

    .npc-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .npc-name-tag {
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-top: var(--wa-space-xs);
      box-shadow: var(--wa-shadow-small);
      opacity: 0.9;
      white-space: nowrap;
      z-index: 25;
    }
  `;
