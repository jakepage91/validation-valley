import { LegacysEndApp } from "./components/legacys-end-app/LegacysEndApp.js";

if (!customElements.get("legacys-end-app")) {
	customElements.define("legacys-end-app", LegacysEndApp);
}

export { LegacysEndApp };
