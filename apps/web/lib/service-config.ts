function readEnv(name: string) {
  const value = process.env[name];
  return value && value.trim().length > 0 ? value.trim() : undefined;
}

export const serviceConfig = {
  databaseUrl: readEnv('DATABASE_URL'),
  otpApiUrl: readEnv('OTP_API_URL') ?? readEnv('NEXT_PUBLIC_OTP_API_URL'),
  nominatimUrl: readEnv('NOMINATIM_URL'),
  razorpayKeyId: readEnv('RAZORPAY_KEY_ID') ?? readEnv('NEXT_PUBLIC_RAZORPAY_KEY_ID'),
  razorpayKeySecret: readEnv('RAZORPAY_KEY_SECRET'),
  razorpayWebhookSecret: readEnv('RAZORPAY_WEBHOOK_SECRET'),
  clerkSecretKey: readEnv('CLERK_SECRET_KEY'),
  upstashRedisUrl: readEnv('UPSTASH_REDIS_REST_URL'),
} as const;

export function hasLiveOtp() {
  return Boolean(serviceConfig.otpApiUrl);
}

export function hasLiveRazorpay() {
  return Boolean(serviceConfig.razorpayKeyId && serviceConfig.razorpayKeySecret);
}

export function hasLiveClerk() {
  return Boolean(serviceConfig.clerkSecretKey);
}

export function hasLiveDatabase() {
  return Boolean(serviceConfig.databaseUrl);
}
