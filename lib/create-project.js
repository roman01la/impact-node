var fs = require('fs'),
    fse = require('fs-extra'),
    wrench = require('wrench'),
    colors = require('colors'),
    helpers = require('./helpers');

var config = {
    forceDelete: false,
    preserveFiles: true
};

module.exports = function (corePath) {

    try {

        var path = helpers.getPath(corePath);

        fse.copy(path.core('/weltmeister.html'), path.current('/weltmeister.html'), helpers.errorHandler);

        fs.readFile(path.core('/index.html'), 'utf8', function (err, data) {

            helpers.errorHandler(err);

            data = data.replace(
                /<canvas id="canvas"><\/canvas>/g,
                '<a href="/editor" target="blank_" class="btn">Editor</a><canvas id="canvas"></canvas>'
            );

            data = data.split('</style>')
                .join('.btn{display:block;position:absolute;padding:6px 10px;color:#242424;text-decoration:none;background:#fafafa;border-radius:2px;top:0;left:0;margin:10px;line-height:1em;}</style>');

            fs.writeFile(path.current('/index.html'), data, helpers.errorHandler);
        });

        fse.mkdirs(path.current('/src'), helpers.errorHandler);
        fse.mkdirs(path.current('/src/lib'), helpers.errorHandler);

        wrench.copyDirSyncRecursive(path.core('/lib/weltmeister'), path.current('/src/lib/weltmeister'), config);

        wrench.copyDirSyncRecursive(path.core('/lib/game'), path.current('/src/lib/game'), config);
        wrench.copyDirSyncRecursive(path.core('/lib/impact'), path.current('/src/lib/impact'), config);

        fs.readFile(path.current('/src/lib/weltmeister/config.js'), 'utf8', function (err, data) {

            helpers.errorHandler(err);

            data = data.replace(/lib\/weltmeister\/api\/save.php/g, '/api/save');
            data = data.replace(/lib\/weltmeister\/api\/browse.php/g, '/api/browse');
            data = data.replace(/lib\/weltmeister\/api\/glob.php/g, '/api/glob');

            fs.writeFile(path.current('/src/lib/weltmeister/config.js'), data, helpers.errorHandler);
        });

        wrench.copyDirSyncRecursive(path.core('/media'), path.current('/src/media'), config);

        console.log('Done! Run '.green + 'impact-node serve '.yellow + 'to start development server'.green);

    } catch (error) {

        throw error;
    }
};
