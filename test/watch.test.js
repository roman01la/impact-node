'use strict';

var assert = require('assert');

var watchServer = require('../lib/watch'),
    clientWatcher = require('../lib/client-watcher');

var HTML = '</body>',
    PORT = 3000;

describe('watchServer', function() {

    describe('inject(html, port)', function() {

        it('should inject watcher script', function() {

            assert.equal(clientWatcher(PORT) + '</body>', watchServer.inject(HTML, PORT));
        });
    });
});
