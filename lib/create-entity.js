'use strict';

var fs = require('fs'),
    fse = require('fs-extra'),
    helpers = require('./helpers'),
    path = require('path');

require('colors');

var size = 32;

module.exports = function (name) {

    fs.readFile(path.join(__dirname, '/templates/entity.js'), 'utf-8', function (err, data) {

        helpers.errorHandler(err);

        fse.outputFile(process.cwd() + '/src/lib/game/entities/' + name + '.js',

            data
                .replace(/<%%= name %>/g, name)
                .replace(/<%%= nameCapitalized %>/g, helpers.capitalize(name))
                .replace(/<%%= width %>/g, size)
                .replace(/<%%= height %>/g, size),

            function (error) {

                helpers.errorHandler(error);

                console.log(name.yellow + ' entity has been created!'.green);
            });
    });
};
