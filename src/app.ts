import express, { Application } from 'express';
import { testRoutes } from './routes/testRoutes';
import { authRoutes } from './routes/authRoutes';

const app: Application = express();

app.use(express.static('public'));
app.use('/api/test', testRoutes);
app.use('/api/auth', authRoutes);

export { app };
