'use strict';

var assert = require('assert');

var clientWatcher = require('../lib/client-watcher');

var PORT = 3000;

var HTML = '<script src="/socket.io/socket.io.js"></script>' +
        '<script>(function() {' +
            'var socket = io.connect("http://localhost:' + PORT + '");' +
            'socket.on("refresh", function (data) {' +
                'location.reload();' +
            '});' +
        '}());</script>';

describe('clientWatcher(port)', function() {

    it('should inject port number into watch script', function() {

        assert.equal(HTML, clientWatcher(PORT));
    });
});
