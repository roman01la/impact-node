'use strict';

var UglifyJS = require('uglify-js'),
    Q = require('q'),
    fs = require('fs'),
    fse = require('fs-extra'),
    path = require('path'),
    helpers = require('./helpers');

var outputFile = Q.nfbind(fse.outputFile),
    readFile = Q.nfbind(fs.readFile),
    writeFile = Q.nfbind(fs.writeFile),
    copy = Q.nfbind(fse.copy);

require('colors');

var currDir = process.cwd(),
    root = currDir + '/src',
    lib = root + '/lib/';

var pattern = 'ig\\s*\\.\\s*module\\s*\\((.*?)\\)\\s*(\\.\\s*requires\\s*\\((.*?)\\)\\s*)?\\.\\s*defines\\s*\\(',
    header = '/*! Built with IMPACT - impactjs.com */\n\n';

var regexp = new RegExp(pattern),
    regexpg = new RegExp(pattern, 'g');

var impactCore = lib + 'impact/impact.js',
    main = lib + 'game/main.js',
    output = currDir + '/build/game.js';

var loaded = {};

function excludeDomReady (module) {

    return module !== 'dom.ready';
}

function moduleToPath (module) {

    return module.replace(/\./g, '/');
}

function removeQuotes (module) {

    return module.replace(/[\s\'"]|\/\/.*|\/\*.*\*\//g, '');
}

function unwrap (path) {

    if (loaded[path]) { return ''; }

    loaded[path] = true;

    process.stdout.write('Files compiled: ' + Object.keys(loaded).length + '\r');

    var code = UglifyJS.minify(path).code;

    return code.replace(regexpg, explode(code.match(regexp), path));
}

function unwrapR (module) {

    return unwrap(lib + module + '.js');
}

function explode (matches) {

    var imports = matches[3] || '',
        importedCode = '';

    if (imports) {

        importedCode = imports
            .split(',')
            .map(removeQuotes)
            .filter(excludeDomReady)
            .map(moduleToPath)
            .map(unwrapR)
            .join('');
    }

    return importedCode + 'ig.baked=true;' +
        'ig.module(' + matches[1] + ')' +
        (imports ? '.requires(' + imports + ')' : '') +
        '.defines(';
}

function replace (data) {

    data = data.replace(/<head>[^]+<\/head>/,
        '<head>' +
            '\n<title>Impact Game</title>' +
            '\n<meta name="viewport" content="width=device-width">' +
            '\n<link rel="stylesheet" href="styles.css" />' +
        '\n</head>'
    );
    data = data.replace(/<body[^]+<\/body>/,
        '<body>' +
            '\n<canvas id="canvas"></canvas>' +
            '\n<script src="game.js"></script>' +
        '\n</body>'
    );

    return data;
}

function build() {

    try {

        var minCode = UglifyJS.minify(

            [impactCore, main]
                .map(unwrap)
                .reduce(function (concat, code) { return concat + code; }),

            {fromString: true}).code;

    } catch (error) {

        throw error;
    }

    var currPath = helpers.getPath().current('/index.html');

    outputFile(output, header + minCode)
        .then(function() { return copy(path.join(root, 'media/'), path.join(currDir, 'build/media/')); })
        .then(function() { return readFile(currPath, 'utf-8'); })
        .then(replace)
        .then(function (data) { return writeFile(path.join(process.cwd(), 'build/index.html'), data); })
        .then(function() { return copy(path.join(__dirname, '/templates/styles.css'), path.join(currDir, 'build/styles.css')); })
        .then(function() {

            return process.stdout.write(('\nBuild successful! Output size: ' +
                (Math.round(fs.statSync(output).size / 10) / 100 + ' kB\n').yellow).green);
        })
        .catch(helpers.errorHandler);
}

module.exports = build;
