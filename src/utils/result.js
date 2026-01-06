/**
 * Result Type - Represents the outcome of an operation that may fail
 *
 * This pattern makes error handling explicit and composable.
 * Instead of throwing exceptions or returning null, operations return
 * a Result that can be either Ok (success) or Err (failure).
 * Result Type - Explicit Error Handling
 *
 * Represents the result of an operation that can either succeed or fail.
 * Inspired by Rust's Result<T, E> type.
 *
 * Usage:
 * ```js
 * const result = Result.Ok(42);
 * const error = Result.Err(new Error("Failed"));
 * ```
 */

/**
 * Result class for explicit error handling
 * Can be either Ok (success) or Err (failure)
 */
export class Result {
	/**
	 * @private
	 * @param {any} value
	 * @param {any} error
	 */
	constructor(value, error) {
		this._value = value;
		this._error = error;
		this.ok = error === null;
	}

	/**
	 * Create a successful Result
	 * @param {any} value - The success value
	 * @returns {Result}
	 */
	static Ok(value) {
		return new Result(value, null);
	}

	/**
	 * Create a failed Result
	 * @param {any} error - The error
	 * @returns {Result}
	 */
	static Err(error) {
		return new Result(null, error);
	}

	/**
	 * Check if the result is successful
	 * @returns {boolean}
	 */
	isOk() {
		return this.ok;
	}

	/**
	 * Check if the result is an error
	 * @returns {boolean}
	 */
	isErr() {
		return !this.ok;
	}

	/**
	 * Get the value, throwing if this is an error
	 * @returns {any}
	 * @throws {Error} If this is an Err
	 */
	unwrap() {
		if (this.isErr()) {
			throw this.error;
		}
		return this.value;
	}

	/**
	 * Get the value or a default if it's an error
	 * @template T
	 * @param {T} defaultValue - The default value to return on error
	 * @returns {T}
	 */
	unwrapOr(defaultValue) {
		return this.isOk() ? this._value : defaultValue;
	}

	/**
	 * Get the error, throwing if this is a success
	 * @returns {any}
	 * @throws {Error} If this is an Ok
	 */
	unwrapErr() {
		if (this.isOk()) {
			throw new Error("Called unwrapErr on an Ok value");
		}
		return this.error;
	}

	/**
	 * Map the success value
	 * @param {Function} fn - The mapping function
	 * @returns {Result}
	 */
	map(fn) {
		if (this.isOk()) {
			return Result.Ok(fn(this.value));
		}
		return this;
	}

	/**
	 * Map the error value
	 * @param {Function} fn - The mapping function
	 * @returns {Result}
	 */
	mapErr(fn) {
		if (this.isErr()) {
			return Result.Err(fn(this.error));
		}
		return this;
	}

	/**
	 * Chain operations that return Results
	 * @param {Function} fn - The function to chain
	 * @returns {Result}
	 */
	andThen(fn) {
		if (this.isOk()) {
			return fn(this.value);
		}
		return this;
	}

	/**
	 * Get value or compute from error
	 * @param {Function} fn - Function to compute value from error
	 * @returns {any}
	 */
	unwrapOrElse(fn) {
		return this.isOk() ? this.value : fn(this.error);
	}

	/**
	 * Pattern match on the Result
	 * @param {Object} handlers
	 * @param {Function} handlers.ok - Handler for success
	 * @param {Function} handlers.err - Handler for error
	 * @returns {any}
	 */
	match(handlers) {
		return this.isOk() ? handlers.ok(this.value) : handlers.err(this.error);
	}

	/**
	 * Get the value property (for compatibility)
	 * @returns {any | null}
	 */
	get value() {
		return this._value;
	}

	/**
	 * Get the error property (for compatibility)
	 * @returns {any | null}
	 */
	get error() {
		return this._error;
	}
}

/**
 * Wrap an async function to return a Result
 * @param {Function} fn - Async function to wrap
 * @returns {Promise<Result>}
 */
export async function tryAsync(fn) {
	try {
		const value = await fn();
		return Result.Ok(value);
	} catch (error) {
		return Result.Err(error);
	}
}

/**
 * Wrap a sync function to return a Result
 * @param {Function} fn - Function to wrap
 * @returns {Result}
 */
export function trySync(fn) {
	try {
		const value = fn();
		return Result.Ok(value);
	} catch (error) {
		return Result.Err(error);
	}
}
