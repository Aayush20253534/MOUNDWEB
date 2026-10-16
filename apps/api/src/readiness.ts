/** Fail closed: no processing of personal data before compliance and integrations are configured. */
export function submissionsReady(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.SUBMISSIONS_ENABLED === "true" &&
    !!env.DATABASE_URL &&
    !!env.RESEND_API_KEY &&
    !!env.RESEND_FROM_EMAIL &&
    !!env.RESEND_TO_EMAIL &&
    !!env.CLIENT_ORIGIN &&
    !!env.APPROVED_PRIVACY_NOTICE_VERSION &&
    env.APPROVED_PRIVACY_NOTICE_VERSION !== "pending";
}
export function publicSubmissionStatus(env: NodeJS.ProcessEnv = process.env) {
  return {
    enabled: submissionsReady(env),
    noticeVersion: submissionsReady(env) ? env.APPROVED_PRIVACY_NOTICE_VERSION : null,
  };
}
