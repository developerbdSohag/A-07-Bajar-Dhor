const BENGALI_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

const UNIT_MAP: Record<string, string> = {
  kg: "কেজি",
  litre: "লিটার",
  liter: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
  halli: "হালি",
};

/**
 * Converts any number or numeric string from English digits to Bengali digits.
 */
export function toBengaliDigits(value: number | string): string {
  return String(value).replace(/[0-9]/g, (digit) => BENGALI_DIGITS[Number(digit)] ?? digit);
}

/**
 * Formats a number with comma separators and converts to Bengali digits.
 */
export function formatBengaliNumber(val: number, decimals: number = 0): string {
  const safeVal = Number.isFinite(val) ? val : 0;
  const isNegative = safeVal < 0;
  const absVal = Math.abs(safeVal);
  
  const [intPart = "0", decPart = ""] = absVal.toFixed(decimals).split(".");
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const result = decimals > 0 && decPart ? `${formattedInt}.${decPart}` : formattedInt;
  
  return (isNegative ? "-" : "") + toBengaliDigits(result);
}

/**
 * Formats a price in Bengali currency format (e.g. "১৪৮ টাকা" or "১,৮৫০ টাকা")
 */
export function formatPrice(price: number, decimals?: number): string {
  const needsDecimals = decimals !== undefined ? decimals : (Number.isInteger(price) ? 0 : 2);
  return `${formatBengaliNumber(price, needsDecimals)} টাকা`;
}

/**
 * Maps English unit keys (kg, litre, etc.) to Bengali strings.
 */
export function formatUnit(unit: string): string {
  return UNIT_MAP[unit.toLowerCase()] || unit;
}

/**
 * Returns directional arrow symbol for price change.
 */
export function getChangeIcon(dir: "up" | "down" | "flat"): string {
  if (dir === "up") return "▲";
  if (dir === "down") return "▼";
  return "—";
}

/**
 * Returns CSS class for price change:
 * In commodity markets: price increase is red (inflation/error), price decrease is green (relief/success).
 */
export function getChangeClass(dir: "up" | "down" | "flat"): string {
  if (dir === "up") return "text-error";
  if (dir === "down") return "text-success";
  return "text-base-content/70";
}

/**
 * Returns Bengali descriptive text for price change direction.
 */
export function getChangeText(dir: "up" | "down" | "flat"): string {
  if (dir === "up") return "বেড়েছে";
  if (dir === "down") return "কমেছে";
  return "অপরিবর্তিত";
}

/**
 * Formats full change string (e.g. "▲ ২.১%")
 */
export function formatChange(change: { dir: "up" | "down" | "flat"; pct: number }): string {
  const icon = getChangeIcon(change.dir);
  const pct = formatBengaliNumber(Math.abs(change.pct), 1);
  return `${icon} ${pct}%`;
}

/**
 * Formats date into Bengali string (e.g., "বুধবার, ৭ অক্টোবর, ২০২৬")
 */
export function getBanglaDate(date: Date = new Date()): string {
  try {
    return new Intl.DateTimeFormat("bn-BD", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch {
    return "বুধবার, ৭ অক্টোবর, ২০২৬";
  }
}
