import { RequestHandler } from 'express';

export const loginController: RequestHandler = (req, res) => {
    const userId = Math.random().toString().split('.')[1];
    res.status(200)
        .cookie('userId', userId, { httpOnly: true })
        .send({ status: 'ok', message: 'You have successfully logged in' });
};

export const checkAuthController: RequestHandler = (req, res) => {
    res.status(200).send({ status: 'ok', message: 'You are authorized' });
};

export const logoutController: RequestHandler = (req, res) => {
    res.clearCookie('userId').status(200).send({ status: 'ok', message: 'You have successfully logged out' });
};
