'use strict';

var Q = require('q'),
    fse = require('fs-extra'),
    fs = require('fs');

module.exports = {

    outputFile: Q.nfbind(fse.outputFile),
    readFile: Q.nfbind(fs.readFile),
    writeFile: Q.nfbind(fs.writeFile),
    copy: Q.nfbind(fse.copy),
    mkdirs: Q.nfbind(fse.mkdirs)
};
