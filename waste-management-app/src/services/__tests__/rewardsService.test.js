import { checkCredits, claimCreditPoints, getRecentActivities } from '../rewardsService';

describe('Rewards Service', () => {
  const mockResidentId = 'user123';

  test('checkCredits should return credit information', async () => {
    const credits = await checkCredits(mockResidentId);
    
    expect(credits).toHaveProperty('available');
    expect(credits).toHaveProperty('earned');
    expect(credits).toHaveProperty('total');
    expect(typeof credits.available).toBe('number');
    expect(typeof credits.earned).toBe('number');
    expect(typeof credits.total).toBe('number');
  });

  test('claimCreditPoints should convert earned to available points', async () => {
    const pointsToClaim = 50;
    const result = await claimCreditPoints(mockResidentId, pointsToClaim);
    
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('message');
    expect(result).toHaveProperty('updatedCredits');
    expect(result.updatedCredits).toHaveProperty('available');
    expect(result.updatedCredits).toHaveProperty('earned');
  });

  test('claimCreditPoints should validate against available earned points', async () => {
    // Test with excessive points to claim
    const excessivePoints = 10000;
    
    await expect(claimCreditPoints(mockResidentId, excessivePoints))
      .rejects.toThrow('Insufficient earned points');
  });

  test('getRecentActivities should return array of activities', async () => {
    const activities = await getRecentActivities(mockResidentId);
    
    expect(Array.isArray(activities)).toBe(true);
    if (activities.length > 0) {
      expect(activities[0]).toHaveProperty('id');
      expect(activities[0]).toHaveProperty('date');
      expect(activities[0]).toHaveProperty('type');
      expect(activities[0]).toHaveProperty('points');
      expect(activities[0]).toHaveProperty('description');
    }
  });
});