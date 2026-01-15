import { createContext } from "@lit/context";

/** @typedef {import('../interfaces.js').IHeroStateService} IHeroStateService */

export const heroStateContext = createContext(Symbol("hero-state"));
