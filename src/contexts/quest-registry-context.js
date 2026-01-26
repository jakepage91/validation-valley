import { createContext } from "@lit/context";

/** @typedef {import("../services/quest-registry-service.js").QuestRegistryService} QuestRegistryService */

/** @type {import('@lit/context').Context<any, QuestRegistryService>} */
export const questRegistryContext = createContext("quest-registry");
