const db = require('../db'); // Mocked DB module
const fileQueue = require('../worker'); // Worker queue

async function uploadFile(req, res) {
  try {
    const { userId, fileId, filePath, fileType } = req.body;

    if (!userId || !fileId || !filePath || !fileType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Store file in DB (mocked)
    db.storeFile({ userId, fileId, filePath, fileType });

    // Add job to queue for thumbnail generation
    if (fileType === 'image') {
      await fileQueue.add({ userId, fileId });
    }

    res.status(201).json({ message: 'File uploaded successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getFileData(req, res) {
  try {
    const { id } = req.params;
    const { size } = req.query;

    const file = db.getFileById(id); // Fetch file from DB (mocked)
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    const filePath = size
      ? `${file.filePath}_${size}`
      : file.filePath;

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.sendFile(path.resolve(filePath));
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  uploadFile,
  getFileData,
};
