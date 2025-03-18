import winston from "winston"

// Configuração do logger
export const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
  ),
  defaultMeta: { service: "educational-platform-api" },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
  ],
})

// Adicionar arquivo de log em produção
if (process.env.NODE_ENV === "production") {
  logger.add(new winston.transports.File({ filename: "error.log", level: "error" }))
  logger.add(new winston.transports.File({ filename: "combined.log" }))
}

