import { Request, Response } from "express";
import winston, { format } from "winston";
import WinstonCloudwatch from "winston-cloudwatch";
export const customeLogger = winston.createLogger({
  //test to see how it work
  transports: [
    new winston.transports.File({
      filename: "product.log",
      level: "info",
      format: format.combine(format.timestamp(), format.json()),
    }),
    new winston.transports.File({
      filename: "product-error.log",
      level: "error",
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
  //   exitOnError: process.exit(0),
});

const createLogger = ({
  awsRegion = "us-east-1",
  logGroupName,
  service,
  level,
}: {
  level: string;
  service: string;
  logGroupName: string;
  awsRegion?: string;
}) => {
  const options = {
    console: {
      level: level,
      handleExceptionName: true,
      json: false,
      colorize: true,
    },
    cloudwatch: {
      level: level,
      logGroupName: logGroupName,
      logStreamName: `${service}-${new Date().toISOString()}`,
      awsRegion: awsRegion,
    },
  };
  const cloudWatchTransport = new WinstonCloudwatch(options.cloudwatch);

  const logger = winston.createLogger({
    level, //level = level:level
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.Console(options.console),
      cloudWatchTransport,
    ],
  });

  return logger;
};

export const logRequest = (
  logger: winston.Logger,
  req: Request,
  additionInfo: object = {}
) => {
  logger.info(
    `Requesting -${{
      method: req.method,
      url: req.url,
      headers: req.header,
      body: req.body,
      ...additionInfo,
    }}`
  );
};

export const logResponse = (
  logger: winston.Logger,
  res: Response,
  additionInfo: object = {}
) => {
  logger.info("Outgoing Response", {
    statusCode: res.statusCode,
    headers: res.getHeaders(),
    ...additionInfo,
  });
};

export const logError = (
  logger: winston.Logger,
  error: Error,
  additionInfo: object = {}
) => {
  logger.error(`Error`, {
    message: error.message,
    stack: error.stack,
    ...additionInfo,
  });
};

export default createLogger;
