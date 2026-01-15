import { createContext } from "@lit/context";

/** @typedef {import('../interfaces.js').IQuestStateService} IQuestStateService */

export const questStateContext = createContext(Symbol("quest-state"));
