import fs from 'node:fs/promises';
import path from 'node:path';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';

export async function extractText(filePath, fileType) {
  const buffer = await fs.readFile(filePath);
  if (fileType === 'application/pdf' || path.extname(filePath).toLowerCase() === '.pdf') {
    const result = await pdf(buffer);
    return result.text;
  }
  if (['.doc', '.docx'].includes(path.extname(filePath).toLowerCase())) return (await mammoth.extractRawText({ buffer })).value;
  return buffer.toString('utf8');
}
