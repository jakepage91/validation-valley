import { createContext } from "@lit/context";

/**
 * @type {import("@lit/context").Context<symbol, import("../services/interfaces.js").IVoiceSynthesisService>}
 */
export const voiceContext = createContext(Symbol("voice-service"));
