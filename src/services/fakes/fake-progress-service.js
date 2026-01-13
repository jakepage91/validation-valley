import { ProgressService } from "../progress-service.js";
import { MemoryStorageAdapter } from "./memory-storage-adapter.js";

/**
 * FakeProgressService
 * Extends ProgressService but uses in-memory storage.
 */
export class FakeProgressService extends ProgressService {
	/**
	 * @param {typeof import('../quest-registry-service.js')} registry
	 */
	constructor(registry) {
		super(new MemoryStorageAdapter(), registry, undefined);
	}
}
