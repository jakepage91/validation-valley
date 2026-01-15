import { createContext } from "@lit/context";

/** @typedef {import('../interfaces.js').IWorldStateService} IWorldStateService */

export const worldStateContext = createContext(Symbol("world-state"));
