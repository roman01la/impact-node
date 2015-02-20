var fs = require('fs'),
    fse = require('fs-extra'),
    colors = require('colors');

var size = 32;

function capitalize (str) {

    return str.charAt(0).toUpperCase() + str.slice(1);
}

function errorHandler (err) {

    if (err) { throw err; }
}

module.exports = function (name) {

    fs.readFile(__dirname + '/templates/entity.js', 'utf-8', function (err, data) {

        errorHandler(err);

        fse.outputFile(process.cwd() + '/src/lib/game/entities/' + name + '.js',

            data
                .replace(/<%%= name %>/g, name)
                .replace(/<%%= nameCapitalized %>/g, capitalize(name))
                .replace(/<%%= width %>/g, size)
                .replace(/<%%= height %>/g, size),

            function (err) {

                errorHandler(err);

                console.log(name.yellow + ' entity has been created!'.green);
            });
    });
};
