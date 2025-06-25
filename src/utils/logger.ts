import fs from 'fs'
import path from 'path'

import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

const logDir = path.resolve(__dirname, '../../logs')
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir)

const logFormat = winston.format.printf(
  ({ timestamp, level, message, stack }) =>
    `${timestamp} [${level}]: ${stack || message}`,
)

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    logFormat,
  ),
  transports: [
    new DailyRotateFile({
      filename: path.join(logDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '14d',
    }),
    new DailyRotateFile({
      filename: path.join(logDir, 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
    }),
  ],
})

if (process.env.NODE_ENV !== 'prod') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), logFormat),
    }),
  )
}

export default logger
