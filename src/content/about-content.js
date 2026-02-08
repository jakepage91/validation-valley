import { msg } from "@lit/localize";

export const getAboutSlidesContent = () => [
	{
		title: msg("Validation Valley"),
		lines: [
			msg(
				"An RPG-style talk exploring the bottlenecks AI code generation has uncovered.",
			),
			msg("Built with Lit and Web Awesome."),
		],
	},
	{
		title: msg("The Bottleneck Canyon"),
		lines: [
			msg("A quest through two domains under pressure:"),
			msg("Open source security and the inner developer loop."),
			msg("The common denominator? Validation."),
		],
	},
	{
		title: msg("MetalBear"),
		lines: [
			msg("Creators of mirrord — connect your local process to Kubernetes."),
			msg("Test against real environments without waiting for CI/CD."),
		],
	},
	{
		title: msg("Special Thanks"),
		lines: [
			msg("This project is based on Legacy's End by Jorge del Casar."),
			msg("Thank you for creating such an inspiring foundation."),
		],
		link: {
			url: "https://github.com/jorgecasar/legacys-end",
			text: msg("View Original Project"),
		},
	},
];
