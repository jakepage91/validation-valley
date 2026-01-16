import { LanguageSelector } from "./LanguageSelector.js";

if (!customElements.get("language-selector")) {
	customElements.define("language-selector", LanguageSelector);
}
