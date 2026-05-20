export const fontFamily = {
  regular: "Poppins-Regular",
  medium: "Poppins-Medium",
  semibold: "Poppins-SemiBold",
  bold: "Poppins-Bold",
} as const;

export const typeScale = {
  h1: { fontSize: 32, lineHeight: 38, fontFamily: fontFamily.bold },
  h2: { fontSize: 24, lineHeight: 31, fontFamily: fontFamily.semibold },
  h3: { fontSize: 20, lineHeight: 26, fontFamily: fontFamily.semibold },
  h4: { fontSize: 16, lineHeight: 22, fontFamily: fontFamily.medium },
  bodyLarge: { fontSize: 16, lineHeight: 26, fontFamily: fontFamily.regular },
  bodyMedium: { fontSize: 14, lineHeight: 22, fontFamily: fontFamily.regular },
  bodySmall: { fontSize: 13, lineHeight: 21, fontFamily: fontFamily.regular },
  caption: { fontSize: 11, lineHeight: 15, fontFamily: fontFamily.regular },
} as const;
