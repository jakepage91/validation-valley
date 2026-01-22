import { createContext } from "@lit/context";

/**
 * @type {import("@lit/context").Context<symbol, import("../services/progress-service.js").ProgressService>}
 */
export const progressContext = createContext(Symbol("progress-service"));
