import { createContext } from "@lit/context";

// Manages the visual state of the hero character including suit, gear, power effects, and mastery.
// Provides: {
//   suit: { image: string },
//   gear: { image: string },
//   power: { effect: string, intensity: string },
//   mastery: { level: number }
// }
export const characterContext = createContext(Symbol("character-context"));
