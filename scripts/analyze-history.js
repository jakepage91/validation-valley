import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import zlib from "node:zlib";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const TEMP_DIR = path.join(ROOT, ".history-temp");

function exec(cmd, cwd = ROOT) {
	try {
		return execSync(cmd, { cwd, encoding: "utf8", stdio: "pipe" });
	} catch {
		return null;
	}
}

function getGzipSize(filePath) {
	const content = fs.readFileSync(filePath);
	return zlib.gzipSync(content).length;
}

function getLoC(dir) {
	const result = exec(`find ${dir} -name "*.js" | xargs wc -l`);
	if (!result) return 0;
	const match = result
		.trim()
		.split("\n")
		.pop()
		.match(/^\s*(\d+)\s+total/);
	return match ? parseInt(match[1], 10) : 0;
}

async function analyzeCommit(hash) {
	console.log(`\n--- Analyzing commit: ${hash} ---`);

	// Cleanup previous
	if (fs.existsSync(TEMP_DIR)) {
		try {
			exec(`git worktree remove -f ${TEMP_DIR}`);
		} catch {}
		// Force remove directory if it still exists (e.g. not a valid worktree)
		if (fs.existsSync(TEMP_DIR)) {
			fs.rmSync(TEMP_DIR, { recursive: true, force: true });
			// Prune git worktree metadata
			exec("git worktree prune");
		}
	}

	// Create worktree
	const result = exec(`git worktree add ${TEMP_DIR} ${hash}`);
	if (result === null && !fs.existsSync(TEMP_DIR)) {
		console.error(`Failed to create worktree for ${hash}`);
		return { hash };
	}

	const metrics = {
		hash,
		timestamp: exec(`git show -s --format=%ci ${hash}`)?.trim() || "",
		message: exec(`git show -s --format=%s ${hash}`)?.trim() || "",
		project: {},
		bundle: {},
		tests: {},
	};

	try {
		const pkgPath = path.join(TEMP_DIR, "package.json");
		if (!fs.existsSync(pkgPath)) {
			throw new Error("No package.json found");
		}
		const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));

		// Project Stats
		metrics.project.dependencies = Object.keys(pkg.dependencies || {}).length;
		metrics.project.devDependencies = Object.keys(
			pkg.devDependencies || {},
		).length;
		metrics.project.loc = getLoC(path.join(TEMP_DIR, "src"));

		// Count files
		const srcFiles = exec(`find ${path.join(TEMP_DIR, "src")} -type f | wc -l`);
		metrics.project.totalFiles = srcFiles ? parseInt(srcFiles.trim(), 10) : 0;

		const testFiles = exec(
			`find ${path.join(TEMP_DIR, "src")} -name "*.test.js" -o -name "*.spec.js" | wc -l`,
		);
		metrics.project.testFiles = testFiles ? parseInt(testFiles.trim(), 10) : 0;

		// Build
		console.log("Installing dependencies...");
		exec("npm install --prefer-offline --no-audit --no-fund", TEMP_DIR);

		console.log("Building...");
		exec("npm run build", TEMP_DIR);

		// Bundle metrics
		const distDir = path.join(TEMP_DIR, "dist");
		if (fs.existsSync(distDir)) {
			const jsFilesRaw = exec(`find ${distDir} -name "*.js"`, TEMP_DIR);
			const jsFiles = jsFilesRaw
				? jsFilesRaw.trim().split("\n").filter(Boolean)
				: [];
			metrics.bundle.fileCount = jsFiles.length;
			metrics.bundle.totalRawSize = 0;
			metrics.bundle.totalGzipSize = 0;

			for (const file of jsFiles) {
				const stats = fs.statSync(file);
				metrics.bundle.totalRawSize += stats.size;
				metrics.bundle.totalGzipSize += getGzipSize(file);
			}
		}

		// Tests (if script exists)
		if (pkg.scripts?.test) {
			console.log("Running tests...");
			const testResultPath = path.join(TEMP_DIR, "test-results.json");
			// We try to use vitest json reporter if possible
			exec(
				`npm test -- --reporter=json --outputFile=${testResultPath} --run`,
				TEMP_DIR,
			);

			if (fs.existsSync(testResultPath)) {
				const testData = JSON.parse(fs.readFileSync(testResultPath, "utf8"));
				metrics.tests.total = testData.numTotalTests || 0;
				metrics.tests.passed = testData.numPassedTests || 0;
				metrics.tests.failed = testData.numFailedTests || 0;
			}
		}
	} catch (err) {
		console.error(`Error analyzing ${hash}:`, err.message);
	} finally {
		exec(`git worktree remove -f ${TEMP_DIR}`);
	}

	return metrics;
}

async function main() {
	const limit = parseInt(process.argv[2], 10);
	const logRaw = exec("git log --format=%h --reverse");
	if (!logRaw) {
		console.error("Failed to get git log");
		return;
	}
	// All commits in the current branch
	const allCommits = logRaw.trim().split("\n");
	const allCommitsSet = new Set(allCommits);

	const outputPath = path.join(ROOT, "bundle-history.jsonl");

	// Load existing history and Prune stale entries
	let history = [];
	if (fs.existsSync(outputPath)) {
		const raw = fs.readFileSync(outputPath, "utf8");
		history = raw
			.trim()
			.split("\n")
			.filter(Boolean)
			.map((line) => {
				try {
					return JSON.parse(line);
				} catch {
					return null;
				}
			})
			.filter((item) => item && item.hash);
	}

	// Filter out commits that no longer exist in the branch
	const validHistory = history.filter((item) => allCommitsSet.has(item.hash));

	// Determine if we need to rewrite the file (pruning occurred)
	if (validHistory.length !== history.length) {
		console.log(
			`Pruning ${history.length - validHistory.length} stale entries...`,
		);
		const ndjson = validHistory.map((item) => JSON.stringify(item)).join("\n");
		fs.writeFileSync(outputPath, ndjson ? `${ndjson}\n` : "");
	} else {
		console.log("No stale entries found.");
	}

	// Identify missing commits to analyze
	const analyzedHashes = new Set(validHistory.map((item) => item.hash));
	const missingCommits = allCommits.filter((hash) => !analyzedHashes.has(hash));

	if (missingCommits.length === 0) {
		console.log("History is up to date.");
		return;
	}

	console.log(`Found ${missingCommits.length} missing commits.`);

	// Apply limit if provided
	const targets = !Number.isNaN(limit)
		? missingCommits.slice(0, limit)
		: missingCommits;
	console.log(`Analyzing ${targets.length} commits...`);

	for (const hash of targets) {
		const metrics = await analyzeCommit(hash);
		if (metrics?.hash) {
			fs.appendFileSync(outputPath, `${JSON.stringify(metrics)}\n`);
			console.log(`Saved metrics for ${hash}`);
		}
	}

	console.log(`\nDone! History updated in ${outputPath}`);
}

main();
