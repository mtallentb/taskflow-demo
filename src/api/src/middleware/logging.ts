import { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';

export const requestLogger = morgan('combined', {
  skip: (req: Request, res: Response) => {
    return req.url === '/health';
  }
});

export const requestId = (req: Request, res: Response, next: NextFunction) => {
  req.id = crypto.randomUUID();
  res.setHeader('X-Request-ID', req.id);
  next();
};

declare global {
  namespace Express {
    interface Request {
      id: string;
    }
  }
}