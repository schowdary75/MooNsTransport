type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogPayload {
  level: LogLevel;
  time: string;
  msg: string;
  userId?: string;
  route?: string;
  durationMs?: number;
  [key: string]: any;
}

function formatLog(level: LogLevel, msg: string, meta: Record<string, any> = {}): string {
  const payload: LogPayload = {
    level,
    time: new Date().toISOString(),
    msg,
    ...meta
  };
  return JSON.stringify(payload);
}

export const logger = {
  info: (msg: string, meta?: Record<string, any>) => {
    console.log(formatLog('info', msg, meta));
  },
  warn: (msg: string, meta?: Record<string, any>) => {
    console.warn(formatLog('warn', msg, meta));
  },
  error: (msg: string, meta?: Record<string, any>) => {
    console.error(formatLog('error', msg, meta));
  },
  debug: (msg: string, meta?: Record<string, any>) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(formatLog('debug', msg, meta));
    }
  }
};
