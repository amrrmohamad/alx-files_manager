const fs = require('fs');
const path = require('path');

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

function writeFile(filePath, data) {
  fs.writeFileSync(filePath, data);
}

module.exports = {
  fileExists,
  writeFile,
};
