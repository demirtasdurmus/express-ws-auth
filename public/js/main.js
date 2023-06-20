const messages = document.querySelector('#messages');
const login = document.querySelector('#login');
const checkAuth = document.querySelector('#checkAuth');
const logout = document.querySelector('#logout');
const wsButton = document.querySelector('#wsButton');
const wsSendButton = document.querySelector('#wsSendButton');

function showMessage(message) {
    messages.textContent += `\n--------\n${message}`;
    messages.scrollTop = messages.scrollHeight;
}

function handleResponse(response) {
    return response.ok
        ? response.json().then((data) => JSON.stringify(data, null, 2))
        : Promise.reject(new Error(response.statusText));
}

let socket;

login.onclick = function () {
    fetch('/api/auth/login', { method: 'POST', credentials: 'same-origin' })
        .then(handleResponse)
        .then(showMessage)
        .catch(function (err) {
            showMessage(err.message);
        });
};

checkAuth.onclick = function () {
    fetch('/api/auth/check-auth', { method: 'POST', credentials: 'same-origin' })
        .then(handleResponse)
        .then(showMessage)
        .catch(function (err) {
            showMessage(err.message);
        });
};

logout.onclick = function () {
    fetch('/api/auth/logout', { method: 'DELETE', credentials: 'same-origin' })
        .then(handleResponse)
        .then(showMessage)
        .catch(function (err) {
            showMessage(err.message);
        });
};

wsButton.onclick = function () {
    if (socket) {
        socket.onerror = socket.onopen = socket.onclose = null;
        socket.close();
    }

    socket = new WebSocket(`ws://${location.host}`);
    socket.onerror = function () {
        showMessage('WebSocket error');
    };
    socket.onopen = function () {
        showMessage('WebSocket connection established');
    };
    socket.onmessage = function (event) {
        showMessage(`Received: ${event.data}`);
    };
    socket.onclose = function () {
        showMessage('WebSocket connection closed');
        socket = null;
    };
};

wsSendButton.onclick = function () {
    if (!socket) {
        showMessage('No WebSocket connection');
        return;
    }

    socket.send('Hello World!');
    showMessage('Sent a message to Server: "Hello World!"');
};
