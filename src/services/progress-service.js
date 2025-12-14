import * as DefaultRegistry from "../quests/quest-registry.js";
import { logger } from "./logger-service.js";
import { LocalStorageAdapter } from "./storage-service.js";

/** @typedef {import('./storage-service').StorageAdapter} StorageAdapter */

/**
 * ProgressService - Manages player progress and persistence
 *
 * Tracks:
 * - Completed quests and chapters
 * - Current quest/chapter
 * - Unlocked quests
 * - Achievements
 *
 * Persists to localStorage
 */
export class ProgressService {
	/**
	 * @param {StorageAdapter} storage - Storage adapter for persistence
	 * @param {Object} registry - Quest registry for looking up quest data
	 */
	constructor(storage = new LocalStorageAdapter(), registry = DefaultRegistry) {
		this.storage = storage;
		this.registry = registry;
		this.storageKey = "legacys-end-progress";
		this.progress = this.loadProgress();
	}

	/**
	 * Load progress from storage
	 */
	loadProgress() {
		const data = this.storage.getItem(this.storageKey);
		if (data) {
			logger.info("💾 Loaded progress:", data);
			return data;
		}

		// Default progress for new players
		logger.info("🆕 Creating new progress");
		return {
			completedQuests: [],
			completedChapters: [],
			currentQuest: null,
			currentChapter: null,
			unlockedQuests: ["the-aura-of-sovereignty"], // First quest always unlocked
			achievements: [],
			stats: {
				totalPlayTime: 0,
				questsCompleted: 0,
				chaptersCompleted: 0,
			},
			chapterStates: {}, // Stores state per chapter (e.g. collectedItem)
		};
	}

	/**
	 * Save progress to storage
	 */
	saveProgress() {
		logger.info("💾 Saving progress:", this.progress);
		this.storage.setItem(this.storageKey, this.progress);
	}

	/**
	 * Reset all progress (for testing or new game)
	 */
	resetProgress() {
		this.progress = this.loadProgress();
		this.storage.removeItem(this.storageKey);
		this.progress = {
			completedQuests: [],
			completedChapters: [],
			currentQuest: null,
			currentChapter: null,
			unlockedQuests: ["the-aura-of-sovereignty"],
			achievements: [],
			stats: {
				totalPlayTime: 0,
				questsCompleted: 0,
				chaptersCompleted: 0,
			},
			chapterStates: {},
		};
		this.saveProgress();
	}

	/**
	 * Reset progress for a specific quest
	 * @param {string} questId
	 */
	resetQuestProgress(questId) {
		const quest = this.registry.getQuest(questId);
		if (!quest) return;

		// Remove from completed quests
		this.progress.completedQuests = this.progress.completedQuests.filter(
			(id) => id !== questId,
		);

		// Remove quest chapters from completed chapters
		if (quest.chapterIds) {
			this.progress.completedChapters = this.progress.completedChapters.filter(
				(chapterId) => !quest.chapterIds.includes(chapterId),
			);
		}

		// Reset current quest if it matches
		if (this.progress.currentQuest === questId) {
			this.progress.currentQuest = null;
			this.progress.currentChapter = null;
		}

		this.saveProgress();
		logger.info(`🔄 Reset progress for quest: ${questId}`);
	}

	/**
	 * Mark a chapter as completed
	 */
	completeChapter(chapterId) {
		if (!this.progress.completedChapters.includes(chapterId)) {
			this.progress.completedChapters.push(chapterId);
			this.progress.stats.chaptersCompleted++;
			this.saveProgress();
			logger.info(`💾 Completing chapter: ${chapterId}`);
		} else {
			logger.warn(`⚠️ Chapter ${chapterId} already completed`);
		}

		// Removed auto-check for quest completion here.
		// Quest completion should be driven by the QuestController flow
		// to prevent premature completion if chapters were previously completed.
	}

	/**
	 * Check if current quest is completed and handle completion
	 */
	checkQuestCompletion() {
		if (!this.progress.currentQuest) return;

		const quest = this.registry.getQuest(this.progress.currentQuest);
		if (!quest || !quest.chapterIds) return;

		// Check if all chapters are completed
		const allChaptersComplete = quest.chapterIds.every((chapterId) =>
			this.progress.completedChapters.includes(chapterId),
		);

		if (allChaptersComplete) {
			console.log(`🎉 All chapters completed for quest ${quest.id}`);
			this.completeQuest(quest.id);
		}
	}

	/**
	 * Mark a quest as completed
	 */
	completeQuest(questId) {
		if (!this.progress.completedQuests.includes(questId)) {
			this.progress.completedQuests.push(questId);
			this.progress.stats.questsCompleted++;

			// Ensure all chapters are marked as completed (consistency check)
			const quest = this.registry.getQuest(questId);
			if (quest?.chapterIds) {
				quest.chapterIds.forEach((chapterId) => {
					if (!this.progress.completedChapters.includes(chapterId)) {
						this.progress.completedChapters.push(chapterId);
						this.progress.stats.chaptersCompleted++;
					}
				});
			}

			// Award achievement
			if (quest?.reward?.badge) {
				this.unlockAchievement(quest.reward.badge);
			}

			this.saveProgress();
			this.unlockNewQuests();
		}
	}

	/**
	 * Unlock quests that have their prerequisites met
	 */
	unlockNewQuests() {
		const allQuests = this.registry.getAllQuests();
		allQuests.forEach((quest) => {
			if (!this.progress.unlockedQuests.includes(quest.id)) {
				// Check if all prerequisites are completed
				if (
					!this.registry.isQuestLocked(quest.id, this.progress.completedQuests)
				) {
					this.progress.unlockedQuests.push(quest.id);
				}
			}
		});
		this.saveProgress();
	}

	/**
	 * Unlock an achievement
	 */
	unlockAchievement(achievementId) {
		if (!this.progress.achievements.includes(achievementId)) {
			this.progress.achievements.push(achievementId);
			this.saveProgress();
		}
	}

	/**
	 * Set current quest and chapter
	 */
	setCurrentQuest(questId, chapterId = null) {
		this.progress.currentQuest = questId;
		this.progress.currentChapter = chapterId;
		this.saveProgress();
	}

	/**
	 * Check if a quest is available to play
	 */
	isQuestAvailable(questId) {
		return this.progress.unlockedQuests.includes(questId);
	}

	/**
	 * Check if a quest is completed
	 */
	isQuestCompleted(questId) {
		return this.progress.completedQuests.includes(questId);
	}

	/**
	 * Check if a chapter is completed
	 */
	isChapterCompleted(chapterId) {
		return this.progress.completedChapters.includes(chapterId);
	}

	/**
	 * Get quest completion percentage
	 */
	getQuestProgress(questId) {
		if (this.isQuestCompleted(questId)) {
			return 100;
		}

		const quest = this.registry.getQuest(questId);
		if (!quest || !quest.chapterIds || quest.chapterIds.length === 0) {
			return 0;
		}

		const completedCount = quest.chapterIds.filter((chapterId) =>
			this.isChapterCompleted(chapterId),
		).length;

		return Math.round((completedCount / quest.chapterIds.length) * 100);
	}

	/**
	 * Get overall game completion percentage
	 */
	getOverallProgress() {
		// Use registry.getAllQuests() instead of Object.values(QUESTS)
		// Assuming getAllQuests() returns the main quests.
		const allQuests = this.registry
			.getAllQuests()
			.filter((q) => q.status !== "coming-soon");

		if (allQuests.length === 0) return 0;

		const completedCount = allQuests.filter((q) =>
			this.isQuestCompleted(q.id),
		).length;

		return Math.round((completedCount / allQuests.length) * 100);
	}

	/**
	 * Get current progress object (for debugging/display)
	 */
	getProgress() {
		return { ...this.progress };
	}

	/**
	 * Update state for a specific chapter
	 * @param {string} chapterId
	 * @param {Object} state
	 */
	updateChapterState(chapterId, state) {
		if (!this.progress.chapterStates) {
			this.progress.chapterStates = {};
		}

		this.progress.chapterStates[chapterId] = {
			...(this.progress.chapterStates[chapterId] || {}),
			...state,
		};
		this.saveProgress();
	}

	/**
	 * Get state for a specific chapter
	 * @param {string} chapterId
	 */
	getChapterState(chapterId) {
		if (!this.progress.chapterStates) return {};
		return this.progress.chapterStates[chapterId] || {};
	}
}
