import { createContext } from "@lit/context";

/**
 * @type {import("@lit/context").Context<unknown, import("../controllers/quest-controller.js").QuestController>}
 */
export const questControllerContext = createContext(Symbol("quest-controller"));
