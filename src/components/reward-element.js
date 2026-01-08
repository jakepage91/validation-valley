import { html, LitElement } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import {
	processImagePath,
	processImageSrcset,
} from "../utils/process-assets.js";
import "@awesome.me/webawesome/dist/components/icon/icon.js";
import { styles } from "./reward-element.css.js";

/**
 * @element reward-element
 * @property {String} image
 * @property {String} icon
 * @property {Number} x
 * @property {Number} y
 */
export class RewardElement extends LitElement {
	static properties = {
		image: { type: String },
		icon: { type: String },
		x: { type: Number },
		y: { type: Number },
	};

	constructor() {
		super();
		this.image = "";
		this.icon = "";
		this.x = 0;
		this.y = 0;
	}

	static styles = styles;

	render() {
		// Apply position to host
		this.style.left = `${this.x}%`;
		this.style.top = `${this.y}%`;

		const hasImage = !!this.image;

		return html`
      <div class="reward-box ${hasImage ? "has-image" : ""}">
        ${
					hasImage
						? html`
          <img
						src="${ifDefined(processImagePath(this.image))}"
						srcset="${ifDefined(processImageSrcset(this.image))}"
						sizes="(max-width: 600px) 256px, 512px"
						class="reward-img"
						alt="Reward"
					/>
        `
						: html`
          <wa-icon name="${this.icon}" style="font-size: var(--wa-font-size-l); color: #facc15;"></wa-icon>
        `
				}
      </div>
    `;
	}
}

customElements.define("reward-element", RewardElement);
