const LOG_API_URL = 'http://4.224.186.213/evaluation-service/logs';

const ALLOWED_STACK = ['backend', 'frontend'];
const ALLOWED_LEVEL = ['debug', 'info', 'warn', 'error', 'fatal'];
const ALLOWED_PACKAGE = {
  backend: ['cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service'],
  frontend: ['api', 'component', 'hook', 'page', 'state', 'style'],
  shared: ['auth', 'config', 'middleware', 'utils'],
};

let authToken = null;

function setAuthToken(token) {
  authToken = token;
}

function isValidPackageForStack(stack, pkg) {
  if (ALLOWED_PACKAGE.shared.includes(pkg)) return true;
  if (stack === 'backend' && ALLOWED_PACKAGE.backend.includes(pkg)) return true;
  if (stack === 'frontend' && ALLOWED_PACKAGE.frontend.includes(pkg)) return true;
  return false;
}

async function Log(stack, level, pkg, message) {
  const normalizedStack = String(stack).toLowerCase();
  const normalizedLevel = String(level).toLowerCase();
  const normalizedPackage = String(pkg).toLowerCase();

  if (!ALLOWED_STACK.includes(normalizedStack)) {
    console.error(`[Log] Invalid stack "${stack}"`);
    return null;
  }
  if (!ALLOWED_LEVEL.includes(normalizedLevel)) {
    console.error(`[Log] Invalid level "${level}"`);
    return null;
  }
  if (!isValidPackageForStack(normalizedStack, normalizedPackage)) {
    console.error(`[Log] Invalid package "${pkg}" for stack "${normalizedStack}"`);
    return null;
  }
  if (!authToken) {
    console.error('[Log] No auth token set.');
    return null;
  }

  try {
    const response = await fetch(LOG_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        stack: normalizedStack,
        level: normalizedLevel,
        package: normalizedPackage,
        message: String(message),
      }),
    });
    return await response.json();
  } catch (err) {
    console.error('[Log] Failed to send log to server:', err.message);
    return null;
  }
}

module.exports = { Log, setAuthToken };