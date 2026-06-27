// نظام التصميم للموبايل — مطابق لهوية النظام (الويب/الديسكتوب). اللون الأساسي #1A5276.

export const colors = {
  // الهوية (مطابقة للنظام)
  primary: "#1A5276",
  primaryDark: "#154360",
  primaryLight: "#D6EAF8",
  // الأسطح
  bg: "#F0F4F8",
  card: "#FFFFFF",
  surface: "#FFFFFF",
  sidebar: "#0D2137",
  // النصوص
  text: "#0D1B2A",
  textSecondary: "#5A6A7E",
  muted: "#94A3B8",
  // الحدود
  border: "#D5DCE8",
  borderLight: "#EAF0F6",
  // الحالات
  success: "#1A7F5A",
  successLight: "#D1FAE5",
  danger: "#B91C1C",
  dangerLight: "#FEE2E2",
  warning: "#B45309",
  warningLight: "#FEF3C7",
  info: "#1D4ED8",
  infoLight: "#DBEAFE",
  white: "#FFFFFF",
} as const;

/** تدرّجات لونية للترويسات. */
export const gradients = {
  primary: ["#1F6390", "#1A5276", "#154360"] as const,
  sidebar: ["#163349", "#0D2137"] as const,
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 } as const;

// نصف القطر مُصغّر 30% عن السابق (8/12/16/22) لشكل أكثر حِدّة وعصرية. pill يبقى دائريًا.
export const radius = { sm: 6, md: 8, lg: 11, xl: 15, pill: 999 } as const;

/** أحجام الخطوط. */
export const font = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  display: 34,
} as const;

export const shadow = {
  sm: {
    shadowColor: "#0D1B2A",
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  md: {
    shadowColor: "#0D1B2A",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  lg: {
    shadowColor: "#0D1B2A",
    shadowOpacity: 0.16,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 9,
  },
} as const;

/** تنسيق الأرقام بالعربية (IQ). */
export const fmt = (n: number | null | undefined): string => (n ?? 0).toLocaleString("ar-IQ");

/** تنسيق مبلغ بالدينار العراقي. */
export const fmtMoney = (n: number | null | undefined): string => `${fmt(Math.round(n ?? 0))} د.ع`;

export const ROLE_LABEL: Record<string, string> = { ADMIN: "مدير", CASHIER: "موظف" };
