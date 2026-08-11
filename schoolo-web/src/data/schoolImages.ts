const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export const SCHOOL_IMAGE_PATHS: Record<string, string> = {
  s1: `${base}/school1.png`,
  s2: `${base}/school2.png`,
  s3: `${base}/school3.png`,
  s4: `${base}/school4.png`,
  s5: `${base}/school5.png`,
};

export function getSchoolImagePath(key: string): string {
  return SCHOOL_IMAGE_PATHS[key] ?? `${base}/school1.png`;
}
