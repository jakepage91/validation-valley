import { html, LitElement } from "lit";
import { processImagePath } from "../utils/process-assets.js";
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
          <img src="${processImagePath(this.image)}" class="reward-img" alt="Reward" />
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
