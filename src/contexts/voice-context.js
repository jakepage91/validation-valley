import { createContext } from "@lit/context";

/**
 * @type {import("@lit/context").Context<unknown, import("../services/voice-synthesis-service.js").VoiceSynthesisService>}
 */
export const voiceContext = createContext(Symbol("voice-service"));
