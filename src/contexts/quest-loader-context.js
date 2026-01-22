import { createContext } from "@lit/context";

/**
 * @type {import("@lit/context").Context<symbol, import("../services/interfaces.js").IQuestLoaderService>}
 */
export const questLoaderContext = createContext(Symbol("quest-loader"));
