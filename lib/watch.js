var chokidar = require('chokidar'),
    EventEmitter = require('events').EventEmitter;

var root = process.cwd();

var clientWatcher = require('./client-watcher');

var watchServer = function (server) {

    var socketEvents = new EventEmitter();

    var io = require('socket.io').listen(server, {log: false});

    io.sockets.on('connection', function (socket) {

        var refresh = refreshListener.bind(this, socket);

        socketEvents.on('refresh', refresh);

        socket.on('disconnect', function() {

            socketEvents.removeListener('refresh', refresh);
        });
    });

    chokidar.watch(root, {ignored: /[\/\\]\./})
        .on('all', function (event, path) {

            socketEvents.emit('refresh', {});
        });
};

function refreshListener (socket, eventArgs) {

    socket.emit('refresh', eventArgs);
}

function injectWatcher (html, port) {

    return html.replace(/<\/body>/, clientWatcher(port) + '</body>');
}

module.exports = {

    run: watchServer,
    inject: injectWatcher
};
