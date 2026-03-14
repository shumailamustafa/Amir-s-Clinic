import { execSync } from 'child_process';

/**
 * Pre-build check script to ensure zero errors before production builds.
 * This runs TypeScript type checking, ESLint, and env variable validation.
 */

const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
];

function checkEnv() {
  console.log('🔍 Checking environment variables...');
  const missing = requiredEnvVars.filter(env => !process.env[env]);
  if (missing.length > 0) {
    console.warn('⚠️ Missing environment variables:', missing.join(', '));
    console.warn('⚠️ Note: If you are building for the first time or in CI, ensure these are set.');
    if (process.env.NODE_ENV === 'production') {
      console.error('❌ Build failed: Required environment variables are missing for production build.');
      process.exit(1);
    } else {
      console.warn('⚠️ Continuing anyway as this might be a local test build...');
    }
  }
}

function runStep(name: string, command: string) {
  if (process.env.SKIP_PRE_CHECK === 'true') {
     console.log(`⏩ Skipping ${name} (SKIP_PRE_CHECK is set)`);
     return;
  }
  console.log(`🔍 Running ${name}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${name} passed.`);
  } catch (error: any) {
    console.error(`❌ ${name} failed with status ${error.status}. Fix all issues before building.`);
    process.exit(1);
  }
}

async function main() {
  console.log('🚀 Starting pre-build validation...');
  
  // 1. Env check
  checkEnv();

  // 2. Type check
  runStep('TypeScript Type Check', 'pnpm type-check');

  // 3. Lint
  runStep('ESLint Check', 'pnpm lint');

  console.log('🎯 All checks passed! Proceeding to build...');
}

main().catch(err => {
  console.error('💥 Pre-build validation crashed:', err);
  process.exit(1);
});
