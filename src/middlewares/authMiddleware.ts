import { RequestHandler } from 'express';
import { parseCookies } from '../utils/parseCookie';

export const authMiddleware: RequestHandler = (req, res, next) => {
    const cookies = parseCookies(req);
    if (!cookies || !cookies.userId) {
        res.status(401).send({ status: 'error', message: 'You are not authorized' });
        return;
    }
    next();
};
