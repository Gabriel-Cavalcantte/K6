import pino from 'pino';
import pinoHttp from 'pino-http';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname'
    }
  }
});

export const httpLogger = pinoHttp({
  logger,
  customPropsFormatter: (req, res, val) => {
    return {
      reqId: req.id,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTime: val.responseTime
    };
  }
});

export default logger;
