import { achievementsService } from './achievementsService';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

// Mock Firebase functions
jest.mock('../firebase', () => ({
    db: {}
}));

jest.mock('firebase/firestore', () => ({
    doc: jest.fn(),
    getDoc: jest.fn(),
    setDoc: jest.fn(),
    serverTimestamp: jest.fn(() => 'mock-timestamp')
}));

describe('achievementsService', () => {
    const mockUserId = 'user123';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('checkAndUpdateAchievements', () => {
        // --- Sorting Achievements Tests ---

        test('should unlock bronze sorting achievement when requirements are met (3 correct)', async () => {
            // Setup: No existing achievements
            getDoc.mockResolvedValue({ exists: () => false });

            await achievementsService.checkAndUpdateAchievements(mockUserId, 'population', 3);

            // Verify setDoc was called with new achievement
            expect(setDoc).toHaveBeenCalledWith(
                undefined, // doc() result is undefined in mock unless specified
                expect.objectContaining({
                    population_sorting_bronze: expect.objectContaining({
                        unlocked: true
                    })
                }),
                { merge: true }
            );
        });

        test('should NOT unlock bronze sorting achievement when requirements are NOT met (2 correct)', async () => {
            // Setup: No existing achievements
            getDoc.mockResolvedValue({ exists: () => false });

            await achievementsService.checkAndUpdateAchievements(mockUserId, 'population', 2);

            // Verify setDoc was NOT called (except potentially for game count, but let's check sorting part)
            // Actually setDoc IS called for game count, so we check the payload doesn't have sorting bronze
            expect(setDoc).toHaveBeenCalled();
            const payload = setDoc.mock.calls[0][1];
            expect(payload).not.toHaveProperty('population_sorting_bronze');
        });

        test('should unlock gold sorting achievement when requirements are met (12 correct)', async () => {
            getDoc.mockResolvedValue({ exists: () => false });

            await achievementsService.checkAndUpdateAchievements(mockUserId, 'population', 12);

            // Should unlock bronze, silver, AND gold because 12 >= 3, 7, 12
            // The service iterates all achievements.
            expect(setDoc).toHaveBeenCalledWith(
                undefined,
                expect.objectContaining({
                    population_sorting_bronze: expect.objectContaining({ unlocked: true }),
                    population_sorting_silver: expect.objectContaining({ unlocked: true }),
                    population_sorting_gold: expect.objectContaining({ unlocked: true })
                }),
                { merge: true }
            );
        });

        test('should not re-unlock already unlocked achievements', async () => {
            // Setup: Bronze already unlocked
            getDoc.mockResolvedValue({
                exists: () => true,
                data: () => ({
                    population_sorting_bronze: { unlocked: true, unlockedAt: 'old-time' }
                })
            });

            await achievementsService.checkAndUpdateAchievements(mockUserId, 'population', 5);

            // Should unlock Silver (maybe? 5 < 7 so no silver). 
            // Requirement 3 is met, but already unlocked.
            // So setDoc should only be called for game Count update

            const payload = setDoc.mock.calls[0][1];
            // It SHOULD be there, but it should be the OLD version, not a new one
            expect(payload).toHaveProperty('population_sorting_bronze');
            expect(payload.population_sorting_bronze).toEqual({
                unlocked: true,
                unlockedAt: 'old-time'
            });
        });


        // --- Game Count Achievements Tests ---

        test('should increment game count and unlock game master achievement when reaching 50 games', async () => {
            // Setup: 49 games played
            getDoc.mockResolvedValue({
                exists: () => true,
                data: () => ({
                    population_games: { count: 49 }
                })
            });

            await achievementsService.checkAndUpdateAchievements(mockUserId, 'population', 0);

            expect(setDoc).toHaveBeenCalledWith(
                undefined,
                expect.objectContaining({
                    population_games: expect.objectContaining({
                        count: 50,
                        unlocked: true,
                        unlockedAt: 'mock-timestamp'
                    })
                }),
                { merge: true }
            );
        });

        test('should just increment game count if under 50', async () => {
            // Setup: 10 games played
            getDoc.mockResolvedValue({
                exists: () => true,
                data: () => ({
                    population_games: { count: 10 }
                })
            });

            await achievementsService.checkAndUpdateAchievements(mockUserId, 'population', 0);

            expect(setDoc).toHaveBeenCalledWith(
                undefined,
                expect.objectContaining({
                    population_games: expect.objectContaining({
                        count: 11
                    })
                }),
                { merge: true }
            );
            // specific check that it is NOT unlocking
            const payload = setDoc.mock.calls[0][1];
            expect(payload.population_games).not.toHaveProperty('unlocked', true);
        });
    });
});
