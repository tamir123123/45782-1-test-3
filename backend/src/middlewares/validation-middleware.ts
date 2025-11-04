// src/middlewares/validation-middleware.ts
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validate = (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const errors = error.details.map(detail => ({ field: detail.context?.key, message: detail.message }));
        return res.status(400).json({ message: 'Validation failed', errors });
    }
    req.body = value;
    next();
};

export const validateParams = (paramName: string, schema: Joi.StringSchema) => (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.params[paramName]);
    if (error) {
        return res.status(400).json({ message: `Invalid parameter '${paramName}': ${error.details[0].message}` });
    }
    req.params[paramName] = value;
    next();
};