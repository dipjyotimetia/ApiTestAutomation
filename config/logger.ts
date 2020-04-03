import { createLogger, format, transports } from 'winston';
const { combine } = format;

import { existsSync, mkdirSync } from 'fs';
import { join, basename } from 'path';

const env = process.env.NODE_ENV || 'development';
const logDir = 'log';

if (!existsSync(logDir)) {
    mkdirSync(logDir);
}

const filename = join(logDir, 'results.log');

const logger = name => createLogger({
    level: env !== 'PROD' ? 'info' : 'debug',
    format: combine(
        format.label({ label: basename(name) }),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
    ),
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.printf(
                    info =>
                        `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
                )
            ),
        }),
        new transports.File({
            filename,
            format: format.combine(
                format.printf(
                    info =>
                        `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
                )
            ),
        }),
    ],
    exitOnError: false,
});

export default logger;