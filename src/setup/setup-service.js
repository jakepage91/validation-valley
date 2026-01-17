import { ServiceController } from "../controllers/service-controller.js";

/**
 * @typedef {import('lit').LitElement} ServiceHost
 * @typedef {import('../core/game-context.js').IGameContext} IGameContext
 */

/**
 * Setup ServiceController
 * @param {ServiceHost} host
 * @param {Object} dependencies
 * @param {Record<string, any>} dependencies.services
 * @returns {ServiceController}
 */
export function setupService(host, { services }) {
	// Define getActiveService logic that will be bound to the controller instance later if needed,
	// or rely on the controller's internal logic if possible.
	// But sticking to the pattern:

	/** @type {ServiceController} */
	const serviceController = new ServiceController(/** @type {any} */ (host), {
		services: services || {},
		profileProvider: /** @type {any} */ (host).profileProvider,
		getActiveService: () => {
			// This closure captures the variable 'serviceController' which is declared in the same scope.
			// To avoid TDZ (temporal dead zone) or usage before init, checks are needed or restructuring.
			// However, since this callback is invoked LATER (asynchronously), valid JS handles this reference
			// as long as it is initialized by the time it runs.
			// The lint error "used before declaration" is valid for strict linters.
			// We can use 'this' context if bound, or defer lookup.

			// Safe approach: Access via host if attached
			const ctrl = /** @type {any} */ (host).serviceController;
			return ctrl?.getActiveService(
				/** @type {any} */ (undefined),
				/** @type {any} */ (undefined),
			);
		},
	});

	/** @type {ServiceHost & { serviceController: ServiceController }} */ (
		host
	).serviceController = serviceController;

	return serviceController;
}
