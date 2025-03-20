import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';

dotenv.config();
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());

app.use(
	cors({
		origin: process.env.CORS_ORIGIN,
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		allowedHeaders: ['Content-Type', 'x-auth-token']
	})
);

import getRoutes from '../src/routes/getRoutes';
import postRoutes from '../src/routes/postRoutes';
import adminRoutes from '../src/routes/adminRoutes';
import putRoutes from '../src/routes/putRoutes';
import deleteRoutes from '../src/routes/deleteRoutes';

app.use(getRoutes);
app.use('/post', postRoutes);
app.use('/admin', adminRoutes);
app.use('/put', putRoutes);
app.use('/delete', deleteRoutes);

import errorHandler from '../src/middlewares/errorHandler';
app.use(errorHandler);

export default app;
