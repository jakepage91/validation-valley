import { css } from "lit";
import { sharedStyles } from "../../styles/shared.js";

export const styles = [
	sharedStyles,
	css`
			:host {
				position: absolute;
				bottom: 1rem;
				right: 1rem;
				z-index: 50;
			}
		`,
];
