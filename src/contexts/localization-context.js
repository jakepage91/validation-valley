import { createContext } from "@lit/context";

/**
 * @type {import("@lit/context").Context<symbol, import("../services/interfaces.js").ILocalizationService>}
 */
export const localizationContext = createContext(
	Symbol("localization-service"),
);
