enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4
}

// Set default level based on environment
const currentLevel = __DEV__ ? LogLevel.DEBUG : LogLevel.ERROR;

const logger = {
  debug: (message: string, ...args: any[]) => {
    console.debug(`[DEBUG] ${message}`, ...args);
  },
  info: (message: string, ...args: any[]) => {
    console.info(`[INFO] ${message}`, ...args);
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(`[WARN] ${message}`, ...args);
  },
  error: (message: string, ...args: any[]) => {
    console.error(`[ERROR] ${message}`, ...args);
  }
};

export default logger; 