import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedData = schema.parse(req.body);
      req.body = parsedData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((e: any) => e.message).join(', ');
        res.status(400).json({
          success: false,
          message: `Schema Validation Error: ${errorMessages}`,
          errors: error.flatten().fieldErrors,
        });
        return;
      }
      next(error);
    }
  };
};
