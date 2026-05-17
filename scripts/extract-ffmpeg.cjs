const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function extractZipFile(zipPath, targetFileName, outputPath) {
  const buf = fs.readFileSync(zipPath);

  // Read local file header at offset 0
  let offset = 0;
  while (offset < buf.length - 30) {
    const signature = buf.readUInt32LE(offset);
    if (signature !== 0x04034b50) break;

    const compressionMethod = buf.readUInt16LE(offset + 8);
    const compressedSize = buf.readUInt32LE(offset + 18);
    const uncompressedSize = buf.readUInt32LE(offset + 22);
    const fileNameLength = buf.readUInt16LE(offset + 26);
    const extraFieldLength = buf.readUInt16LE(offset + 28);

    const fileName = buf.slice(offset + 30, offset + 30 + fileNameLength).toString('utf-8');

    if (fileName.includes(targetFileName)) {
      console.log('Found:', fileName);
      console.log('Compressed:', compressedSize, 'Uncompressed:', uncompressedSize);

      const dataStart = offset + 30 + fileNameLength + extraFieldLength;
      const compressedData = buf.slice(dataStart, dataStart + compressedSize);

      let data;
      if (compressionMethod === 0) {
        // Stored (no compression)
        data = compressedData;
      } else if (compressionMethod === 8) {
        // Deflated
        data = zlib.inflateRawSync(compressedData);
      } else {
        console.error('Unknown compression method:', compressionMethod);
        process.exit(1);
      }

      fs.writeFileSync(outputPath, data);
      console.log('Extracted to:', outputPath, '(', data.length, 'bytes)');
      return true;
    }

    offset = offset + 30 + fileNameLength + extraFieldLength + compressedSize;
  }

  console.error('File not found in zip:', targetFileName);
  return false;
}

extractZipFile(
  path.join(__dirname, 'ffmpeg-gpl.zip'),
  'ffmpeg.exe',
  path.join(__dirname, 'ffmpeg.exe')
);
