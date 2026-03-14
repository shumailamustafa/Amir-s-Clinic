import pino from 'pino';

export function createLogger(context: string) {
  const isDev = process.env.NODE_ENV === 'development';

  const transport = isDev
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss',
          ignore: 'pid,hostname',
          messageFormat: `({context}): {msg}`,
        },
      }
    : undefined;

  return pino({
    level: process.env.LOG_LEVEL || (isDev ? 'debug' : 'info'),
    base: { context },
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
      level: (label) => {
        return { level: label.toUpperCase() };
      },
    },
    transport,
  });
}
