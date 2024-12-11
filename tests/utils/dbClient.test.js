const dbClient = require('../../utils/dbClient'); // Adjust path as necessary

describe('dbClient', () => {
  test('should connect to database', () => {
    expect(dbClient.isAlive()).toBe(true);
  });

  test('should perform CRUD operations', async () => {
    const testRecord = { key: 'test', value: 'data' };
    await dbClient.store('test', testRecord);
    const record = await dbClient.get('test');
    expect(record).toEqual(testRecord);

    await dbClient.delete('test');
    const deletedRecord = await dbClient.get('test');
    expect(deletedRecord).toBeNull();
  });
});
