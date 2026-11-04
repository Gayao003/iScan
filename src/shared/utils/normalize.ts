/**
 * Normalization rules per docs/data-model-and-api.md:
 * - trim surrounding whitespace
 * - preserve leading zeroes
 * - reject empty values
 * - URL safe
 */
export function normalizeItemCode(rawCode: string): string {
  if (!rawCode) return '';
  return rawCode.trim();
}

export function validateItemCode(code: string): { valid: boolean; error?: string } {
  const normalized = normalizeItemCode(code);
  if (!normalized) {
    return { valid: false, error: 'Item code cannot be empty.' };
  }
  if (normalized.length > 100) {
    return { valid: false, error: 'Item code is too long (maximum 100 characters).' };
  }
  // Check for invalid control characters
  if (/[\x00-\x1F\x7F]/.test(normalized)) {
    return { valid: false, error: 'Item code contains invalid characters.' };
  }
  return { valid: true };
}
