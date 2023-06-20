import { Request } from 'express';
import { IncomingMessage } from 'http';

export function parseCookies(request: Request | IncomingMessage): { [key: string]: string } | undefined {
    const list: Record<string, string> = {};
    const requestCookies = request.headers.cookie;
    requestCookies &&
        requestCookies.split(';').forEach(function (cookie) {
            const parts = cookie.split('=');
            const firstElement = parts.shift();
            if (firstElement) {
                list[firstElement.trim()] = decodeURI(parts.join('='));
            }
        });
    return list;
}
