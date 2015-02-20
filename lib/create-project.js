var fs = require('fs'),
    fse = require('fs-extra'),
    wrench = require('wrench'),
    colors = require('colors');

var config = {
    forceDelete: false,
    preserveFiles: true
};

function errorHandler (err) {

    if (err) { throw err; }
}

function getPath (corePath) {

    var current = process.cwd();

    return {

        core: function (path) { return corePath + path; },
        current: function (path) { return current + path; }
    }
}

module.exports = function (corePath) {

    try {

        var path = getPath(corePath);

        fse.copy(path.core('/weltmeister.html'), path.current('/weltmeister.html'), errorHandler);

        fs.readFile(path.core('/index.html'), 'utf8', function (err, data) {

            errorHandler(err);

            data = data.replace(
                /<canvas id="canvas"><\/canvas>/g,
                '<a href="/editor" target="blank_" class="btn">Editor</a><canvas id="canvas"></canvas>'
            );

            data = data.split('</style>')
                .join('.btn{display:block;position:absolute;padding:6px 10px;color:#1F1F1F;text-decoration:none;background:#666;border-radius:4px;border:1px solid #303030;box-shadow:inset 0 1px #888,0 1px 2px #222;top:0;left:0;margin:10px}</style>');

            fs.writeFile(path.current('/index.html'), data, errorHandler);
        });

        fse.mkdirs(path.current('/src'), errorHandler);
        fse.mkdirs(path.current('/src/lib'), errorHandler);

        wrench.copyDirSyncRecursive(path.core('/lib/weltmeister'), path.current('/src/lib/weltmeister'), config);

        wrench.copyDirSyncRecursive(path.core('/lib/game'), path.current('/src/lib/game'), config);
        wrench.copyDirSyncRecursive(path.core('/lib/impact'), path.current('/src/lib/impact'), config);

        fs.readFile(path.current('/src/lib/weltmeister/config.js'), 'utf8', function (err, data) {

            errorHandler(err);

            data = data.replace(/lib\/weltmeister\/api\/save.php/g, '/api/save');
            data = data.replace(/lib\/weltmeister\/api\/browse.php/g, '/api/browse');
            data = data.replace(/lib\/weltmeister\/api\/glob.php/g, '/api/glob');

            fs.writeFile(path.current('/src/lib/weltmeister/config.js'), data, errorHandler);
        });

        wrench.copyDirSyncRecursive(path.core('/media'), path.current('/src/media'), config);

        console.log('Done! Run '.green + 'impact-node serve '.yellow + 'to start development server'.green);

    } catch (error) {

        throw error;
    }
};
