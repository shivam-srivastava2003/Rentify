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

/**
 * Helper to get property-type specific unit labels.
 * PG / Shared Room -> "Beds"
 * Single Room -> "Rooms"
 * 1BHK Flat -> "Flats/Units"
 * Studio -> "Studio Units"
 */
export const getUnitLabel = (type?: string): { unitName: string; pluralUnitName: string; sectionTitle: string } => {
  const t = type ? type.toLowerCase() : '';
  if (t.includes('pg') || t.includes('shared')) {
    return { unitName: 'Bed', pluralUnitName: 'Beds', sectionTitle: 'Bed Capacity & Occupancy' };
  }
  if (t.includes('single room') || t.includes('room')) {
    return { unitName: 'Room', pluralUnitName: 'Rooms', sectionTitle: 'Room Capacity & Occupancy' };
  }
  if (t.includes('1bhk') || t.includes('flat') || t.includes('apartment')) {
    return { unitName: 'Flat/Unit', pluralUnitName: 'Units', sectionTitle: 'Unit & Apartment Capacity' };
  }
  if (t.includes('studio')) {
    return { unitName: 'Studio Unit', pluralUnitName: 'Studio Units', sectionTitle: 'Studio Capacity & Occupancy' };
  }
  return { unitName: 'Unit', pluralUnitName: 'Units', sectionTitle: 'Unit Capacity & Occupancy' };
};
