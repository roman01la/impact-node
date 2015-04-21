'use strict';

var helpers = require('./lib/helpers');

var args = process.argv,
    task = args[2];

var pkg = require('./package.json');

var v = pkg.version,
    help = '\nUsage:\n\nimpact-node create:project {path to impact dir}\nimpact-node create:entity {name}\nimpact-node serve\nimpact-node serve -p 9000\nimpact-node serve --watch\nimpact-node build';

if ((/create:/).test(task)) {

    var createWhat = args[2].split(':')[1];
    return require('./lib/create')(createWhat, args[3]);
}

switch (task) {

    case 'serve':

        require('./lib/server')
            .run(helpers.getVal(args, '-p'), helpers.getVal(args, '--watch'));

        break;


    case 'build':

        require('./lib/build')();

        break;

    case '-v':

        console.log(v);

        break;

    case '-h':

        console.log(help);

        break;

    default:

        console.log(help);

        break;
}
