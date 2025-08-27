import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { requestLogger, requestId } from './middleware/logging';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { tasksRouter } from './routes/tasks';
import { healthRouter } from './routes/health';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(requestId);
app.use(requestLogger);

app.use('/api/v1/tasks', tasksRouter);
app.use('/health', healthRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export { app };