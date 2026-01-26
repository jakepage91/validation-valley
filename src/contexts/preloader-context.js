import { createContext } from "@lit/context";

/** @typedef {import("../services/preloader-service.js").PreloaderService} PreloaderService */

/** @type {import('@lit/context').Context<any, PreloaderService>} */
export const preloaderContext = createContext("preloader");
