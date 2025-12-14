import { ContextProvider } from "@lit/context";
import {
	characterContext,
	profileContext,
	themeContext,
} from "../contexts/index.js";

/**
 * ContextMixin - Validates and initializes all application context providers
 * @param {any} superClass
 */
export const ContextMixin = (superClass) =>
	class extends superClass {
		constructor() {
			super();
			this.profileProvider = new ContextProvider(this, {
				context: profileContext,
				initialValue: { loading: true },
			});
			this.themeProvider = new ContextProvider(this, {
				context: themeContext,
				initialValue: { themeMode: "light" },
			});
			this.characterProvider = new ContextProvider(this, {
				context: characterContext,
				initialValue: {
					suit: {},
					gear: {},
					power: {},
					mastery: {},
				},
			});
		}
	};
