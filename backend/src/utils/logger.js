function redact(value) {
  if (!value || typeof value !== 'object') return value;
  const hidden = new Set(['password', 'passwordHash', 'token', 'authorization', 'livekitToken', 'jwt']);
  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => {
      if (hidden.has(key.toLowerCase())) return [key, '[redacted]'];
      if (item && typeof item === 'object' && !Array.isArray(item)) return [key, redact(item)];
      return [key, item];
    })
  );
}

function write(level, message, meta = {}) {
  const payload = {
    ts: new Date().toISOString(),
    level,
    message,
    ...redact(meta)
  };
  const line = JSON.stringify(payload);
  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.log(line);
}

export const logger = {
  info: (message, meta) => write('info', message, meta),
  warn: (message, meta) => write('warn', message, meta),
  error: (message, meta) => write('error', message, meta)
};

export function serializeError(error) {
  return {
    name: error?.name,
    message: error?.message,
    code: error?.code,
    statusCode: error?.statusCode,
    stack: process.env.NODE_ENV === 'production' ? undefined : error?.stack
  };
}
