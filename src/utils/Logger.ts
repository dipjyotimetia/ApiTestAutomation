import pino from 'pino';

const logger = process.env.NODE_ENV !== 'production' 
  ? pino({
      level: process.env.LOG_LEVEL || 'info',
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname'
        }
      },
      formatters: {
        level(label) {
          return { level: label };
        }
      }
    })
  : pino({
      level: process.env.LOG_LEVEL || 'info',
      formatters: {
        level(label) {
          return { level: label };
        }
      }
    });

export default logger;