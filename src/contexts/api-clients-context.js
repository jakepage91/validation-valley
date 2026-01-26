import { createContext } from "@lit/context";

/**
 * @typedef {import("../services/user-api-client.js").IUserApiClient} IUserApiClient
 */

/**
 * @typedef {Object} UserApiClients
 * @property {IUserApiClient} [legacy]
 * @property {IUserApiClient} [mock]
 * @property {IUserApiClient} [new]
 */

/** @type {import('@lit/context').Context<any, UserApiClients>} */
export const apiClientsContext = createContext("api-clients");
