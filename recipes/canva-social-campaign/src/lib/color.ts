import type { Palette } from "./types";

const NEUTRALS = new Set([
  "#000000",
  "#ffffff",
  "#111111",
  "#222222",
  "#333333",
  "#eeeeee",
  "#f5f5f5",
  "#fafafa",
  "#0a0a0a",
]);

export function normalizeHex(input: string): string | null {
  const raw = input.trim().toLowerCase();
  const short = /^#([0-9a-f]{3})$/.exec(raw);
  if (short) {
    const [r, g, b] = short[1];
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  const long = /^#([0-9a-f]{6})$/.exec(raw);
  return long ? `#${long[1]}` : null;
}

export function rgbToHex(r: number, g: number, b: number): string {
  const h = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n)))
      .toString(16)
      .padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

export function hexToRgb(hex: string): [number, number, number] | null {
  const n = normalizeHex(hex);
  if (!n) return null;
  return [
    parseInt(n.slice(1, 3), 16),
    parseInt(n.slice(3, 5), 16),
    parseInt(n.slice(5, 7), 16),
  ];
}

export function luminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function saturation(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  const [r, g, b] = rgb.map((c) => c / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max === 0) return 0;
  return (max - min) / max;
}

export function contrastText(background: string): string {
  return luminance(background) > 0.45 ? "#121212" : "#ffffff";
}

export function mix(a: string, b: string, amount = 0.5): string {
  const aa = hexToRgb(a);
  const bb = hexToRgb(b);
  if (!aa || !bb) return a;
  return rgbToHex(
    aa[0] + (bb[0] - aa[0]) * amount,
    aa[1] + (bb[1] - aa[1]) * amount,
    aa[2] + (bb[2] - aa[2]) * amount,
  );
}

export function extractHexColors(html: string): string[] {
  const found = new Set<string>();
  const hexRe = /#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/g;
  for (const match of html.match(hexRe) ?? []) {
    const hex = normalizeHex(match);
    if (hex) found.add(hex);
  }
  const rgbRe =
    /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*[\d.]+)?\s*\)/g;
  let rgb: RegExpExecArray | null;
  while ((rgb = rgbRe.exec(html))) {
    found.add(rgbToHex(Number(rgb[1]), Number(rgb[2]), Number(rgb[3])));
  }
  return [...found];
}

export function buildPalette(
  colors: string[],
  themeColor?: string | null,
): Palette {
  const normalized = [themeColor, ...colors]
    .map((c) => (c ? normalizeHex(c) : null))
    .filter((c): c is string => Boolean(c));

  const unique = [...new Set(normalized)];
  const theme = themeColor ? normalizeHex(themeColor) : null;
  const fromPage =
    unique
      .filter((c) => !NEUTRALS.has(c))
      .filter((c) => {
        const L = luminance(c);
        return L > 0.08 && L < 0.92;
      })
      .sort((a, b) => saturation(b) - saturation(a))[0] ?? null;

  const accentCandidate =
    (theme && !NEUTRALS.has(theme) && saturation(theme) > 0.12
      ? theme
      : fromPage) ??
    theme ??
    "#1e3a5f";

  const lightBg = unique.find((c) => luminance(c) > 0.86) ?? "#ffffff";
  const darkBg = unique.find((c) => luminance(c) < 0.12) ?? "#111111";
  const accentIsDark = luminance(accentCandidate) < 0.35;
  const background = accentIsDark ? lightBg : darkBg;
  const foreground = contrastText(background);
  const accentText = contrastText(accentCandidate);
  const muted = mix(background, foreground, 0.12);

  return {
    background,
    foreground,
    accent: accentCandidate,
    accentText,
    muted,
  };
}
