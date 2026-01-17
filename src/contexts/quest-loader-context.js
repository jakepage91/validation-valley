import { createContext } from "@lit/context";

/**
 * @type {import("@lit/context").Context<unknown, import("../services/quest-loader-service.js").QuestLoaderService>}
 */
export const questLoaderContext = createContext(Symbol("quest-loader"));
