import { Router, Request, Response } from 'express';
import { ApiResponse } from '@shared/types';

const router = Router();

interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
}

router.get('/', (req: Request, res: Response) => {
  const healthStatus: HealthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  };

  const response: ApiResponse<HealthStatus> = {
    success: true,
    data: healthStatus
  };

  res.json(response);
});

export { router as healthRouter };