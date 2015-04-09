'use strict';

var fs = require('fs'),
    fse = require('fs-extra'),
    Q = require('q'),
    wrench = require('wrench'),
    helpers = require('./helpers');

var readFile = Q.nfbind(fs.readFile),
    writeFile = Q.nfbind(fs.writeFile),
    copy = Q.nfbind(fse.copy),
    mkdirs = Q.nfbind(fse.mkdirs);

require('colors');

var config = {
    forceDelete: false,
    preserveFiles: true
};

function replace (data) {

    data = data.replace(
        /<canvas id="canvas"><\/canvas>/g,
        '<a href="/editor" target="blank_" class="btn">Editor</a><canvas id="canvas"></canvas>'
    );

    data = data.split('</style>')
        .join('.btn{display:block;position:absolute;padding:6px 10px;color:#242424;text-decoration:none;background:#fafafa;border-radius:2px;top:0;left:0;margin:10px;line-height:1em;}</style>');

    return data;
}

module.exports = function (corePath) {

    var path = helpers.getPath(corePath);

    Q.all([

        copy(path.core('/weltmeister.html'), path.current('/weltmeister.html'))
            .then(function() { return readFile(path.core('/index.html'), 'utf8'); })
            .then(replace)
            .then(function (data) { return writeFile(path.current('/index.html'), data); }),

        mkdirs(path.current('/src')),
        mkdirs(path.current('/src/lib'))
    ])
    .then(function() {

        wrench.copyDirSyncRecursive(path.core('/lib/weltmeister'), path.current('/src/lib/weltmeister'), config);
        wrench.copyDirSyncRecursive(path.core('/lib/game'), path.current('/src/lib/game'), config);
        wrench.copyDirSyncRecursive(path.core('/lib/impact'), path.current('/src/lib/impact'), config);
        wrench.copyDirSyncRecursive(path.core('/media'), path.current('/src/media'), config);

        return (

            readFile(path.current('/src/lib/weltmeister/config.js'), 'utf8')
                .then(function (data) {

                    data = data.replace(/lib\/weltmeister\/api\/save.php/g, '/api/save');
                    data = data.replace(/lib\/weltmeister\/api\/browse.php/g, '/api/browse');
                    data = data.replace(/lib\/weltmeister\/api\/glob.php/g, '/api/glob');

                    return data;
                })
                .then(function (data) { return writeFile(path.current('/src/lib/weltmeister/config.js'), data); }));
    })
    .then(function() {

        return console.log('Done! Run '.green + 'impact-node serve '.yellow + 'to start development server'.green);
    })
    .catch(helpers.errorHandler);
};
