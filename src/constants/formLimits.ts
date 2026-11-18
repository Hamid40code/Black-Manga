/** Shared field limits for both the form controls and their validators. */
export const FORM_LIMITS = {
  username: { min: 3, max: 8 },
  password: { min: 8, max: 24 },
  email: { max: 254 },
} as const;
