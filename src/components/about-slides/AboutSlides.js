import { msg, updateWhenLocaleChanges } from "@lit/localize";
import { html, LitElement } from "lit";
import { getAboutSlidesContent } from "../../content/about-content.js";
import "@awesome.me/webawesome/dist/components/dialog/dialog.js";
import "@awesome.me/webawesome/dist/components/carousel/carousel.js";
import "@awesome.me/webawesome/dist/components/carousel-item/carousel-item.js";
import "@awesome.me/webawesome/dist/components/button/button.js";
import { aboutSlidesStyles } from "./AboutSlides.styles.js";

/**
 * AboutSlides - Displays information about the game in a carousel dialog
 *
 * @element about-slides
 */
export class AboutSlides extends LitElement {
	/** @override */
	static styles = aboutSlidesStyles;

	constructor() {
		super();
		updateWhenLocaleChanges(this);
	}

	/** @override */
	render() {
		const slides = getAboutSlidesContent();
		return html`
			<wa-dialog label="${msg("About Validation Valley")}" class="about-dialog" style="--width: 800px;">
				<wa-carousel navigation pagination mouseDragging>
					${slides.map(
						(slide) => html`
						<wa-carousel-item>
							<h2>${slide.title}</h2>
							${slide.lines.map((line) => html`<p>${line}</p>`)}
							${
								slide.link
									? html`
								<p style="margin-top: 1rem;">
									<a href="${slide.link.url}" target="_blank" rel="noopener noreferrer" style="color: var(--brand-main-purple);">
										${slide.link.text}
									</a>
								</p>
							`
									: ""
							}
						</wa-carousel-item>
					`,
					)}
				</wa-carousel>
			</wa-dialog>
		`;
	}

	/**
	 * Show the about dialog
	 */
	show() {
		const dialog =
			/** @type {import("@awesome.me/webawesome/dist/components/dialog/dialog.js").default} */ (
				this.shadowRoot?.querySelector("wa-dialog")
			);
		if (dialog) {
			dialog.open = true;
		}
	}

	/**
	 * Hide the about dialog
	 */
	hide() {
		const dialog =
			/** @type {import("@awesome.me/webawesome/dist/components/dialog/dialog.js").default} */ (
				this.shadowRoot?.querySelector("wa-dialog")
			);
		if (dialog) {
			dialog.open = false;
		}
	}
}
