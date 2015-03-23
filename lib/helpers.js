'use strict';

module.exports = {

    errorHandler: function (err) {

        if (err) { throw err; }
    },

    capitalize: function (str) {

        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    getPath: function (corePath) {

        var current = process.cwd();

        return {

            core: function (path) { return corePath + path; },
            current: function (path) { return current + path; }
        };
    },

    getVal: function (args, key) {

        for (var i = 0, ln = args.length; i < ln; i++) {

            if (args[i] === key) { return [key, args[i + 1]]; }
        }

        return [];
    }
};
