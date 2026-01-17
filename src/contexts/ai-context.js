import { createContext } from "@lit/context";

/**
 * @type {import("@lit/context").Context<unknown, import("../services/ai-service.js").AIService>}
 */
export const aiContext = createContext(Symbol("ai-service"));
