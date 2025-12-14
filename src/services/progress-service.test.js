import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as QuestRegistry from "../quests/quest-registry.js";
import { ProgressService } from "./progress-service.js";

// Mock dependencies
vi.mock("../quests/quest-registry.js", () => ({
	getQuest: vi.fn(),
	isQuestLocked: vi.fn(),
	QUESTS: {},
}));

describe("ProgressService", () => {
	let service;

	beforeEach(() => {
		// Spy on localStorage methods
		vi.spyOn(Storage.prototype, 'getItem');
		vi.spyOn(Storage.prototype, 'setItem');
		vi.spyOn(Storage.prototype, 'removeItem');
		vi.spyOn(Storage.prototype, 'clear');

		localStorage.clear();
		vi.clearAllMocks();

		// Setup default QUESTS mock
		QuestRegistry.QUESTS.testQuest1 = {
			id: "test-quest-1",
			type: "quest",
			chapterIds: ["c1", "c2"],
		};
		QuestRegistry.QUESTS.testQuest2 = {
			id: "test-quest-2",
			type: "quest",
			chapterIds: ["c3"],
		};

		service = new ProgressService();
	});

	afterEach(() => {
		vi.restoreAllMocks();
		localStorage.clear();
	});

	it("should initialize with default progress if no saved data", () => {
		const progress = service.getProgress();
		expect(progress.completedQuests).toEqual([]);
		expect(progress.unlockedQuests).toContain("the-aura-of-sovereignty");
	});

	it("should save progress to localStorage", () => {
		service.saveProgress();
		expect(localStorage.setItem).toHaveBeenCalledWith(
			"legacys-end-progress",
			expect.any(String),
		);
	});

	it("should complete a chapter", () => {
		service.completeChapter("c1");
		expect(service.isChapterCompleted("c1")).toBe(true);
		expect(service.progress.stats.chaptersCompleted).toBe(1);
		expect(localStorage.setItem).toHaveBeenCalled();
	});

	it("should not double-complete a chapter", () => {
		service.completeChapter("c1");
		service.completeChapter("c1");
		expect(service.progress.stats.chaptersCompleted).toBe(1);
	});

	it("should complete a quest and unlock achievement", () => {
		const questMock = {
			id: "quest-1",
			chapterIds: ["c1"],
			reward: { badge: "badge-1" },
		};
		QuestRegistry.getQuest.mockReturnValue(questMock);
		QuestRegistry.isQuestLocked.mockReturnValue(false);

		service.completeQuest("quest-1");

		expect(service.isQuestCompleted("quest-1")).toBe(true);
		expect(service.progress.achievements).toContain("badge-1");
		expect(service.progress.stats.questsCompleted).toBe(1);
		// Should auto-complete chapters if not done
		expect(service.isChapterCompleted("c1")).toBe(true);
	});

	it("should reset progress", () => {
		service.completeChapter("c1");
		service.resetProgress();

		expect(service.isChapterCompleted("c1")).toBe(false);
		expect(service.progress.stats.chaptersCompleted).toBe(0);
		expect(localStorage.removeItem).toHaveBeenCalled();
	});

	it("should unlock new quests based on prerequisites", () => {
		// Mock QUESTS with a locked quest
		QuestRegistry.QUESTS.lockedQuest = {
			id: "locked-quest",
			type: "quest",
		};

		// Setup isQuestLocked to return false (unlocked) when called
		QuestRegistry.isQuestLocked.mockReturnValue(false);

		service.unlockNewQuests();

		expect(service.progress.unlockedQuests).toContain("locked-quest");
	});

	it("should reset specific quest progress", () => {
		QuestRegistry.getQuest.mockReturnValue({
			id: "q1",
			chapterIds: ["c1", "c2"],
		});

		service.setCurrentQuest("q1", "c1");
		service.completeChapter("c1");
		service.completeQuest("q1");

		service.resetQuestProgress("q1");

		expect(service.isQuestCompleted("q1")).toBe(false);
		expect(service.isChapterCompleted("c1")).toBe(false);
		expect(service.progress.currentQuest).toBeNull();
	});

	it("should calculate quest progress percentage", () => {
		QuestRegistry.getQuest.mockReturnValue({
			id: "q1",
			chapterIds: ["c1", "c2", "c3", "c4"],
		});

		service.completeChapter("c1");

		expect(service.getQuestProgress("q1")).toBe(25);
	});
});
