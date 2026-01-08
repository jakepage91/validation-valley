import { html, LitElement } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import {
	processImagePath,
	processImageSrcset,
} from "../utils/process-assets.js";
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
		x: { type: Number },
		y: { type: Number },
	};

	constructor() {
		super();
		this.image = "";
		this.x = 0;
		this.y = 0;
	}

	static styles = styles;

	render() {
		// Apply position to host
		this.style.left = `${this.x}%`;
		this.style.top = `${this.y}%`;

		return html`
      <div class="reward-box">
        <img
          src="${ifDefined(processImagePath(this.image))}"
          srcset="${ifDefined(processImageSrcset(this.image))}"
          sizes="(max-width: 600px) 256px, 512px"
          class="reward-img"
          alt="Reward"
        />
      </div>
    `;
	}
}

customElements.define("reward-element", RewardElement);
