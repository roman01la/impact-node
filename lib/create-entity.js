var fs = require('fs'),
    fse = require('fs-extra'),
    colors = require('colors'),
    helpers = require('./helpers');

var size = 32;

module.exports = function (name) {

    fs.readFile(__dirname + '/templates/entity.js', 'utf-8', function (err, data) {

        helpers.errorHandler(err);

        fse.outputFile(process.cwd() + '/src/lib/game/entities/' + name + '.js',

            data
                .replace(/<%%= name %>/g, name)
                .replace(/<%%= nameCapitalized %>/g, helpers.capitalize(name))
                .replace(/<%%= width %>/g, size)
                .replace(/<%%= height %>/g, size),

            function (err) {

                helpers.errorHandler(err);

                console.log(name.yellow + ' entity has been created!'.green);
            });
    });
};
