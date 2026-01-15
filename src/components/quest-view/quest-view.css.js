import { css } from "lit";
import { sharedStyles } from "../../styles/shared.js";

export const questViewStyles = [
	...sharedStyles,
	css`
    :host {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        width: 100vw;
        background-color: var(--wa-color-neutral-fill-loud);
        background-image: linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px);
        background-size: 40px 40px;
        color: var(--wa-color-text-normal);
        position: relative;
        overflow: hidden;
        font-family: var(--wa-font-family-body);
        box-sizing: border-box;
    }

    main {
        width: 100%;
        max-width: 90rem;
        height: 100%;
        box-shadow: var(--wa-shadow-large);
        position: relative;
        transition: all 1s;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
    }
  `,
];
