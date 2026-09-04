/**
 * BID SURE AI - CROSS-DOCUMENT NORMALIZATION UTILITY LAYER
 * 
 * Reusable normalization functions for cross-document attribute comparison.
 * Normalization removes formatting differences (case, whitespace, legal suffixes,
 * punctuation) without blindly treating different corporate entities or financial periods as equal.
 */

/**
 * Basic string normalization:
 * Lowercase, trim leading/trailing whitespace, collapse internal spaces, strip punctuation.
 */
export function normalizeString(val: string): string {
  if (!val) return '';
  return val
    .toLowerCase()
    .trim()
    .replace(/[\.\,\-\_\/\(\)]/g, ' ') // Strip common punctuation
    .replace(/\s+/g, ' ')               // Collapse multiple spaces
    .trim();
}

/**
 * Corporate / Legal entity suffix normalization.
 * Maps common variations:
 * - "Private Limited", "Pvt. Ltd.", "Pvt Ltd", "P. Ltd." -> "pvtltd"
 * - "Limited", "Ltd.", "Ltd" -> "ltd"
 * - "Limited Liability Partnership", "LLP", "L.L.P." -> "llp"
 * - "Sole Proprietorship", "Proprietorship", "Prop." -> "proprietorship"
 */
export function normalizeLegalName(val: string): string {
  if (!val) return '';
  let norm = normalizeString(val);

  // Replace legal suffix variations
  norm = norm
    .replace(/\b(private limited|pvt ltd|pvt limited|p limited|pvtltd)\b/g, 'pvtltd')
    .replace(/\b(limited|ltd)\b/g, 'ltd')
    .replace(/\b(limited liability partnership|llp)\b/g, 'llp')
    .replace(/\b(sole proprietorship|proprietorship|prop)\b/g, 'proprietorship')
    .replace(/\b(co|company|corp|corporation)\b/g, '')
    .replace(/\s+/g, '')
    .trim();

  return norm;
}

/**
 * GSTIN Normalization:
 * Uppercase, strip whitespace and hyphens.
 */
export function normalizeGstin(val: string): string {
  if (!val) return '';
  return val.toUpperCase().replace(/[^A-Z0-9]/g, '').trim();
}

/**
 * PAN Normalization:
 * Uppercase, strip whitespace and hyphens.
 */
export function normalizePan(val: string): string {
  if (!val) return '';
  return val.toUpperCase().replace(/[^A-Z0-9]/g, '').trim();
}

/**
 * Date Normalization:
 * Standardizes DD/MM/YYYY, YYYY-MM-DD, DD-MM-YYYY into standard ISO YYYY-MM-DD string.
 */
export function normalizeDate(val: string): string {
  if (!val) return '';
  const cleaned = val.trim().replace(/[\.\-]/g, '/');
  
  // DD/MM/YYYY or D/M/YYYY
  const ddmmyyyyMatch = cleaned.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (ddmmyyyyMatch) {
    const day = ddmmyyyyMatch[1].padStart(2, '0');
    const month = ddmmyyyyMatch[2].padStart(2, '0');
    const year = ddmmyyyyMatch[3];
    return `${year}-${month}-${day}`;
  }

  // YYYY/MM/DD
  const yyyymmddMatch = cleaned.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/);
  if (yyyymmddMatch) {
    const year = yyyymmddMatch[1];
    const month = yyyymmddMatch[2].padStart(2, '0');
    const day = yyyymmddMatch[3].padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  return cleaned.toLowerCase();
}

/**
 * Currency & Numeric Amount Normalization:
 * Converts strings like "₹2.4 Crore", "Rs. 24,00,000", "2.4 Cr", "24000000" into numeric 24000000.
 */
export function normalizeCurrencyAmount(val: string): number | null {
  if (!val) return null;
  const cleaned = val.toLowerCase().replace(/,/g, '').trim();

  // Match Crore / Cr
  const croreMatch = cleaned.match(/([\d\.]+)\s*(crore|cr)/);
  if (croreMatch) {
    const num = parseFloat(croreMatch[1]);
    if (!isNaN(num)) return Math.round(num * 10000000);
  }

  // Match Lakh / Lakhs / L
  const lakhMatch = cleaned.match(/([\d\.]+)\s*(lakh|lakhs|l)\b/);
  if (lakhMatch) {
    const num = parseFloat(lakhMatch[1]);
    if (!isNaN(num)) return Math.round(num * 100000);
  }

  // Plain numeric extract
  const plainNumMatch = cleaned.replace(/[^\d\.]/g, '');
  if (plainNumMatch) {
    const num = parseFloat(plainNumMatch);
    if (!isNaN(num)) return num;
  }

  return null;
}
