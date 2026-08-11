export const SCHOOL_IMAGE_PATHS: Record<string, string> = {
  s1: '/skoolu-web/school1.png',
  s2: '/skoolu-web/school2.png',
  s3: '/skoolu-web/school3.png',
  s4: '/skoolu-web/school4.png',
  s5: '/skoolu-web/school5.png',
};

export function getSchoolImagePath(key: string): string {
  return SCHOOL_IMAGE_PATHS[key] ?? '/skoolu-web/school1.png';
}
