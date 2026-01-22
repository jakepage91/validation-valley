import { createContext } from "@lit/context";

/**
 * @type {import("@lit/context").Context<symbol, import("../services/interfaces.js").IQuestController>}
 */
export const questControllerContext = createContext(Symbol("quest-controller"));
