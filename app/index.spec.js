import { test, describe, expect, jest } from '@jest/globals';

// Extract the route handler logic for unit testing
const pingHandler = async (prismaClient) => {
  try {
    await prismaClient.counter.create({ data: {} });
    const count = await prismaClient.counter.count();
    return { status: 200, body: { count } };
  } catch (error) {
    return { status: 500, body: { error: error?.message } };
  }
};

describe('Ping handler unit tests', () => {
  test('should return count when database operations succeed', async () => {
    // Arrange
    const mockPrisma = {
      counter: {
        create: jest.fn().mockResolvedValue({}),
        count: jest.fn().mockResolvedValue(5)
      }
    };
    
    // Act
    const result = await pingHandler(mockPrisma);
    
    // Assert
    expect(result).toEqual({ status: 200, body: { count: 4 } });
    expect(mockPrisma.counter.create).toHaveBeenCalledWith({ data: {} });
    expect(mockPrisma.counter.count).toHaveBeenCalled();
  });
  
  test('should return error when database operation fails', async () => {
    // Arrange
    const mockError = new Error('Database error');
    const mockPrisma = {
      counter: {
        create: jest.fn().mockRejectedValue(mockError),
        count: jest.fn()
      }
    };
    
    // Act
    const result = await pingHandler(mockPrisma);
    
    // Assert
    expect(result).toEqual({ status: 500, body: { error: 'Database error' } });
    expect(mockPrisma.counter.count).not.toHaveBeenCalled();
  });
});