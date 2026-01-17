import { createContext } from "@lit/context";

/**
 * @type {import("@lit/context").Context<unknown, import("../services/localization-service.js").LocalizationService>}
 */
export const localizationContext = createContext(
	Symbol("localization-service"),
);
