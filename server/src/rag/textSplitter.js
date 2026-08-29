export function splitText(text, size = 900, overlap = 120) {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  const chunks = [];
  for (let start = 0; start < cleaned.length; start += size - overlap) {
    const content = cleaned.slice(start, start + size).trim();
    if (content.length > 40) chunks.push({ content, pageNumber: Math.floor(start / 3000) + 1 });
  }
  return chunks;
}
