const globalStore = globalThis as any;
if (!globalStore.otpStore) {
  globalStore.otpStore = {};
}
const otpStore: Record<string, { otp: string; expiresAt: number }> = globalStore.otpStore;

export async function setOtpInCache(email: string, otp: string) {
  otpStore[email] = {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
  };
}

export async function getOtpFromCache(email: string): Promise<string | null> {
  const record = otpStore[email];
  if (!record || Date.now() > record.expiresAt) return null;
  return record.otp;
}
