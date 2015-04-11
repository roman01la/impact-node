'use strict';

var helpers = require('./helpers'),
    path = require('path'),
    fsq = require('./fsq');

require('colors');

var size = 32;

function replace (data, name) {

    return (

        data
            .replace(/<%%= name %>/g, name)
            .replace(/<%%= nameCapitalized %>/g, helpers.capitalize(name))
            .replace(/<%%= width %>/g, size)
            .replace(/<%%= height %>/g, size));
}

module.exports = function (name) {

    fsq.readFile(path.join(__dirname, '/templates/entity.js'), 'utf-8')
        .then(function (data) { return replace(data, name); })
        .then(function (data) {

            return fsq.outputFile(process.cwd() + '/src/lib/game/entities/' + name + '.js', data);
        })
        .then(function() { return console.log(name.yellow + ' entity has been created!'.green); })
        .catch(helpers.errorHandler);
};
