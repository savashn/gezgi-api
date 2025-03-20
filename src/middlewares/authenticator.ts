import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface DecodedToken {
	id: number;
	user: string;
	isAdmin: boolean;
}

declare module 'express-serve-static-core' {
	interface Request {
		user?: {
			id: number;
			user: string;
			isAdmin: boolean;
		};
	}
}

export async function allUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
	const token = req.header('x-auth-token');

	if (!token) {
		req.user = undefined;
		next();
		return;
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

		if (typeof decoded === 'object' && decoded !== null && 'id' in decoded) {
			req.user = decoded as DecodedToken;
		} else {
			req.user = undefined;
		}
	} catch (err) {
		console.log('Invalid JWT:', err);
		req.user = undefined;
	}

	next();
}

export async function auth(req: Request, res: Response, next: NextFunction): Promise<void> {
	const token = req.header('x-auth-token');

	if (!token) {
		res.status(401).send('User is not allowed');
		return;
	}

	try {
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
		req.user = decodedToken;
		next();
	} catch (err) {
		console.log(err);
		res.status(400).send('Broken token');
	}
}

export async function admin(req: Request, res: Response, next: NextFunction): Promise<void> {
	const token = req.header('x-auth-token');

	if (!token) {
		res.status(401).send('User is not allowed');
		return;
	}

	try {
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;

		if (decodedToken.isAdmin === false) {
			res.status(401).send('Only admin is allowed');
			return;
		}

		req.user = decodedToken;
		next();
	} catch (err) {
		console.log(err);
		res.status(400).send('Broken token');
	}
}
