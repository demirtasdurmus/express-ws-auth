import internal from 'stream';
import { IncomingMessage, createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { app } from './app';
import { parseCookies } from './utils/parseCookie';

const PORT = process.env.PORT || 3000;

/*
 * 1. Create an http server using node's http module and pass the express app as a request handler
 */
const server = createServer(app);

/*
 * 2. Create a WebSocketServer instance by completely detaching it from the http server
 *    and set the clientTracking option to false
 */
const ws = new WebSocketServer({ noServer: true, clientTracking: false });

/*
 * 3. Listen for the upgrade event on the http server and handle the upgrade to WebSocket
 *    connection
 */
server.on('upgrade', (request: IncomingMessage, socket: internal.Duplex, head: Buffer) => {
    socket.on('error', console.error);

    /*
     * 4. Parse the cookies from the request using the parseCookies function
     *    and destroy the socket if the userId is not present in the cookies
     */
    const cookies = parseCookies(request);
    if (!cookies || !cookies.userId) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n', 'utf8', () => {
            socket.end();
        });
        socket.destroy();
        return;
    }

    socket.removeListener('error', console.error);

    /*
     * 5. Use the handleUpgrade method of the WebSocketServer instance and pass the request,
     *    socket, head and a callback function as arguments. The callback function will be
     *    called after the handshake is complete and the connection is established
     */
    ws.handleUpgrade(request, socket, head, (socket) => {
        ws.emit('connection', socket, request);
    });
});

/*
 * 6. Listen for the connection event on the WebSocketServer instance and handle the connection
 */
ws.on('connection', (socket: WebSocket, request: IncomingMessage) => {
    socket.on('error', console.error);

    /*
     * 7. Parse the cookies from the request using the parseCookies function
     *    and set the userId variable to the userId from the cookies
     */
    let userId = '';
    const cookies = parseCookies(request);
    if (cookies && cookies.userId) {
        userId = cookies.userId;
    }

    /*
     * 8. Send a message to the client with the userId
     */
    socket.send('You have successfully connected to the server, userId: ' + userId);

    /*
     * 9. Listen for the message event on the socket and send a message back to the client
     */
    socket.on('message', (data) => {
        socket.send('Hey I am the Server;\nand I received your message' + data + ' userId: ' + userId);
    });

    /*
     * 10. Listen for the close event on the socket and log a message
     */
    socket.on('close', () => {
        console.log('Socket closed');
    });
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
