import { createContext } from "@lit/context";

/**
 * @type {import("@lit/context").Context<symbol, import("../services/interfaces.js").IAIService>}
 */
export const aiContext = createContext(Symbol("ai-service"));
