module.exports = function (port) {

    return  '<script src="/socket.io/socket.io.js"></script>' +
            '<script>(function() {' +
                'var socket = io.connect("http://localhost:' + port + '");' +
                'socket.on("refresh", function (data) {' +
                    'location.reload();' +
                '});' +
            '}());</script>';
};
