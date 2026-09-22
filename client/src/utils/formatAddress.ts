/**
 * Deduplicates comma-separated address segments while preserving order.
 * Trims whitespace and removes duplicate entries regardless of case.
 * 
 * Example:
 * formatCleanAddress("Main road near shiv temple, Sector - 21", "Sector - 21", "Pune", "Pune")
 * => "Main road near shiv temple, Sector - 21, Pune"
 */
export const formatCleanAddress = (...parts: (string | undefined | null)[]): string => {
  const allSegments: string[] = [];

  for (const part of parts) {
    if (!part || typeof part !== 'string') continue;
    const subParts = part.split(',');
    for (const sub of subParts) {
      const trimmed = sub.trim();
      if (trimmed && trimmed.toLowerCase() !== 'n/a') {
        allSegments.push(trimmed);
      }
    }
  }

  const seen = new Set<string>();
  const uniqueSegments: string[] = [];

  for (const seg of allSegments) {
    const key = seg.toLowerCase().replace(/\s+/g, ' ');
    if (!seen.has(key)) {
      seen.add(key);
      uniqueSegments.push(seg);
    }
  }

  return uniqueSegments.join(', ');
};
