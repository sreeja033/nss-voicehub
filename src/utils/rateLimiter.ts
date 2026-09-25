/**
 * Rate Limiting Utility for Report Submissions
 * Enforces a strict maximum of 5 submissions per hour per session/device,
 * and 8 per hour for verified registered community members.
 * Coordinated with server-side /api/reports/record-submission and Supabase database triggers.
 */

const STORAGE_KEY = 'nss_report_submissions_history';
const SESSION_TOKEN_KEY = 'nss_session_token';
const ONE_HOUR_MS = 60 * 60 * 1000;

export const ANON_RATE_LIMIT = 5;
export const MEMBER_RATE_LIMIT = 8;

/**
 * Returns the persistent session token for this device/browser,
 * creating a secure random token if one does not exist yet.
 */
export function getSessionToken(): string {
  if (typeof window === 'undefined') return 'server-session';
  let token = localStorage.getItem(SESSION_TOKEN_KEY);
  if (!token) {
    token = 'sess_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
    try {
      localStorage.setItem(SESSION_TOKEN_KEY, token);
    } catch {}
  }
  return token;
}

interface SubmissionRecord {
  key: string;
  timestamp: number;
}

function getSubmissionRecords(): SubmissionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const cutoff = Date.now() - ONE_HOUR_MS;
      return parsed.filter((r) => typeof r.timestamp === 'number' && r.timestamp > cutoff);
    }
  } catch {}
  return [];
}

function saveSubmissionRecords(records: SubmissionRecord[]) {
  try {
    const cutoff = Date.now() - ONE_HOUR_MS;
    const filtered = records.filter((r) => r.timestamp > cutoff);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch {}
}

/**
 * Checks local rate limit cache.
 */
export function checkReportRateLimit(
  identifier: string,
  isLoggedInMember: boolean = false
): { allowed: boolean; remaining: number; resetMinutes: number; message?: string } {
  if (!identifier) {
    return { allowed: true, remaining: ANON_RATE_LIMIT, resetMinutes: 60 };
  }

  const limit = isLoggedInMember ? MEMBER_RATE_LIMIT : ANON_RATE_LIMIT;
  const records = getSubmissionRecords();
  const userRecords = records.filter((r) => r.key === identifier);

  if (userRecords.length >= limit) {
    const oldest = Math.min(...userRecords.map((r) => r.timestamp));
    const waitMs = Math.max(0, oldest + ONE_HOUR_MS - Date.now());
    const resetMinutes = Math.max(1, Math.ceil(waitMs / (60 * 1000)));

    return {
      allowed: false,
      remaining: 0,
      resetMinutes,
      message: `You've reached the limit of ${limit} report submissions per hour. Please wait ${resetMinutes} minute(s) before submitting again.`,
    };
  }

  return {
    allowed: true,
    remaining: limit - userRecords.length,
    resetMinutes: 60,
  };
}

/**
 * Checks rate limit with backend server authority (/api/reports/check-rate-limit).
 */
export async function checkServerRateLimit(
  sessionToken: string,
  userId?: string
): Promise<{ allowed: boolean; remaining: number; resetMinutes: number; message?: string }> {
  try {
    const res = await fetch('/api/reports/check-rate-limit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionToken, userId }),
    });
    const data = await res.json();
    return {
      allowed: data.allowed !== false,
      remaining: typeof data.remaining === 'number' ? data.remaining : 5,
      resetMinutes: data.resetMinutes || 60,
      message: data.message || data.error,
    };
  } catch {
    // Fall back to local check if offline
    return checkReportRateLimit(userId || sessionToken, Boolean(userId));
  }
}

/**
 * Records a successful report submission under the given identifier locally.
 */
export function recordReportSubmission(identifier: string) {
  if (!identifier) return;
  const records = getSubmissionRecords();
  records.push({
    key: identifier,
    timestamp: Date.now(),
  });
  saveSubmissionRecords(records);
}
