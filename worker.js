const Bull = require('bull');
const imageThumbnail = require('image-thumbnail');
const { writeFile } = require('./utils/fileUtils');
const { getUserById } = require('./utils/userUtils');
const db = require('./db'); // Mocked DB module

// Queues
const fileQueue = new Bull('fileQueue');
const userQueue = new Bull('userQueue');

// File processing
fileQueue.process(async (job) => {
  const { userId, fileId } = job.data;

  if (!fileId) throw new Error('Missing fileId');
  if (!userId) throw new Error('Missing userId');

  const file = db.getFileById(fileId);
  if (!file || file.userId !== userId) throw new Error('File not found');

  try {
    const sizes = [500, 250, 100];
    const originalFilePath = file.filePath;

    for (const width of sizes) {
      const thumbnail = await imageThumbnail(originalFilePath, { width });
      const newFilePath = `${originalFilePath}_${width}`;
      writeFile(newFilePath, thumbnail);
    }

    console.log(`Thumbnails generated for fileId: ${fileId}`);
  } catch (error) {
    console.error(`Error generating thumbnails: ${error.message}`);
  }
});

// User processing
userQueue.process(async (job) => {
  const { userId } = job.data;

  if (!userId) throw new Error('Missing userId');

  const user = getUserById(userId);
  if (!user) throw new Error('User not found');

  console.log(`Welcome ${user.email}!`);
});

console.log('Worker running for fileQueue and userQueue');
