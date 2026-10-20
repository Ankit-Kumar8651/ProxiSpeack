import 'dotenv/config';

const isProd = process.env.NODE_ENV === 'production';

export const config = {
  port: Number(process.env.PORT) || 4000,
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'dev-only-secret-change-me',
  jwtExpiresIn: '12h',
  mongoUri: (process.env.MONGODB_URI || '').trim(),
  adminUserId: (process.env.ADMIN_USER_ID || 'admin').toLowerCase(),
  adminEmail: (process.env.ADMIN_EMAIL || 'admin@proxispeak.com').toLowerCase(),
  adminPassword: process.env.ADMIN_PASSWORD || 'Admin@12345',
  adminInviteCode: (process.env.ADMIN_INVITE_CODE || '').trim(),
  isProd,
};

if (!process.env.JWT_SECRET) {
  console.warn('[config] JWT_SECRET is not set - using an insecure development secret.');
  if (isProd) throw new Error('JWT_SECRET must be set in production.');
}
