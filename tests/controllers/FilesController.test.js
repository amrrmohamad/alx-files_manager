const FilesController = require('../../controllers/FilesController');
const db = require('../../db'); // Mocked DB module
const fileQueue = require('../../worker'); // Mocked worker

jest.mock('../../db');
jest.mock('../../worker');

describe('FilesController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('uploadFile should handle missing fields', async () => {
    const req = { body: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await FilesController.uploadFile(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields' });
  });

  test('uploadFile should queue a job for an image file', async () => {
    const req = {
      body: {
        userId: '123',
        fileId: 'abc',
        filePath: '/tmp/image.png',
        fileType: 'image',
      },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await FilesController.uploadFile(req, res);
    expect(fileQueue.add).toHaveBeenCalledWith({ userId: '123', fileId: 'abc' });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'File uploaded successfully' });
  });

  test('getFileData should return 404 if file is not found', async () => {
    db.getFileById.mockReturnValue(null);

    const req = { params: { id: '123' }, query: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await FilesController.getFileData(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'File not found' });
  });
});
