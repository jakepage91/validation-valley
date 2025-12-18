import { configureLocalization } from "@lit/localize";
import { sourceLocale, targetLocales } from "./generated/locale-codes.js";

/**
 * Localization configuration for the application.
 * Exports getLocale and setLocale for language management.
 */
export const { getLocale, setLocale } = configureLocalization({
	sourceLocale,
	targetLocales,
	loadLocale: (locale) => import(`./generated/locales/${locale}.js`),
});
