import { createContext } from "@lit/context";

/**
 * @type {import("@lit/context").Context<symbol, import("../services/interfaces.js").IThemeService>}
 */
export const themeContext = createContext(Symbol("theme-service"));
