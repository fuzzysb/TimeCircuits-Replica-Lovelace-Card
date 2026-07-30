export interface TimeCircuitsConfig {
  /** Entity for the top row "Destination Time" (e.g. text.timecircuits_top_time) */
  destination_entity?: string;
  /** Entity for the bottom row "Last Time Departed" (e.g. text.timecircuits_bot_time) */
  departed_entity?: string;
  /** Entity for the middle row "Present Time". Optional - falls back to HA server time. */
  present_entity?: string;
  /** Entity for the date-format select (e.g. select.timecircuits_dateformat). Optional. */
  date_format_entity?: string;
  /** Entity for the sync-RTC button (e.g. button.timecircuits_sync_btn). Optional. */
  sync_entity?: string;

  /** Title shown above the card. Default: "Time Circuits". */
  title?: string;
  /** Font family for the LED digits. */
  font_family?: string;
  /** Theme override for the LED segments (see TimeCircuitsTheme). */
  theme?: Partial<TimeCircuitsTheme>;
}

export interface TimeCircuitsTheme {
  /** Card background (panel) */
  background: string;
  /** Outer border / bezel color */
  bezel: string;
  /** Row label text color */
  label_color: string;
  /** LED digit color - default lit */
  digit_color: string;
  /** LED digit color - dimmed (unlit segments background) */
  digit_dim: string;
  /** AM/PM indicator color when active */
  ampm_active: string;
  /** AM/PM indicator color when inactive */
  ampm_inactive: string;
  /** Toggle / button accent color */
  accent: string;
}

export const DEFAULT_THEME: TimeCircuitsTheme = {
  background: "#1a1a1a",
  bezel: "#3a3a3a",
  label_color: "#c8c8c8",
  digit_color: "#ff5500",
  digit_dim: "#2a1408",
  ampm_active: "#ff5500",
  ampm_inactive: "#3a1a0a",
  accent: "#ffb011",
};

export function resolveTheme(cfg?: Partial<TimeCircuitsTheme>): TimeCircuitsTheme {
  return { ...DEFAULT_THEME, ...(cfg || {}) };
}

/**
 * A time row holds three 4-digit groups: MD, YYYY, HHMM (as the firmware stores them).
 * The firmware always stores MMDD regardless of display order, but the *display* order
 * is controlled by the date-format select. We mirror that here.
 */
export interface ParsedTime {
  monthDay: string; // 4 chars, "MMDD" (raw stored order)
  year: string; // 4 chars
  hourMin: string; // 4 chars
}

export const DATE_FORMAT_MD = "MD"; // month/day
export const DATE_FORMAT_DM = "DM"; // day/month

/**
 * Parse a 12-digit state string into MD (raw MMDD), YYYY, HHMM segments.
 * Returns undefined if the string is not exactly 12 digits.
 */
export function parseTimeState(raw: string | undefined | null): ParsedTime | undefined {
  if (!raw) return undefined;
  const s = raw.trim();
  if (!/^\d{12}$/.test(s)) return undefined;
  return {
    monthDay: s.slice(0, 4),
    year: s.slice(4, 8),
    hourMin: s.slice(8, 12),
  };
}

/**
 * Reorder the stored MMDD string into the user-selected display order.
 * Returns a 4-char string in the display order.
 */
export function toDisplayOrder(md: string, format: string): string {
  if (md.length !== 4) return md;
  if (format === DATE_FORMAT_DM) return md.slice(2, 4) + md.slice(0, 2);
  return md; // MD
}

export function isAm(hourStr: string): boolean {
  const h = parseInt(hourStr.slice(0, 2), 10);
  return Number.isFinite(h) ? h < 12 : true;
}

export function pad2(n: number): string {
  return n < 10 ? "0" + n : String(n);
}