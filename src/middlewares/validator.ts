import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const validator = (schema: z.ZodTypeAny) => {
	return (req: Request, res: Response, next: NextFunction): void => {
		const result = schema.safeParse(req.body);

		if (!result.success) {
			res.status(400).json({
				success: false,
				message: 'Validation failed',
				errors: result.error.errors
			});
			return;
		}

		req.body = result.data;
		next();
	};
};

export default validator;
