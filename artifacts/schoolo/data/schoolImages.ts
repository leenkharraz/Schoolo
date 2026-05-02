export const SCHOOL_IMAGE_MAP = {
  s1: require("../assets/images/school1.png"),
  s2: require("../assets/images/school2.png"),
  s3: require("../assets/images/school3.png"),
  s4: require("../assets/images/school4.png"),
  s5: require("../assets/images/school5.png"),
} as const;

export type SchoolImageKey = keyof typeof SCHOOL_IMAGE_MAP;
