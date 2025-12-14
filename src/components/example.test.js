import { expect, test } from "vitest";

test("browser environment works", () => {
	expect(window).toBeDefined();
	expect(document).toBeDefined();
	const div = document.createElement("div");
	div.innerHTML = "Hello World";
	document.body.appendChild(div);
	expect(document.body.textContent).toContain("Hello World");
});
