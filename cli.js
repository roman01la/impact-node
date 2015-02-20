var helpers = require('./lib/helpers');

var args = process.argv,
    task = args[2];

(/create:/).test(task) && require('./lib/create')(args[2].split(':')[1], args[3]);

switch (task) {

    case 'serve':

        require('./lib/server')
            .run(helpers.getVal(args, '-p'), helpers.getVal(args, '-watch'));

        break;


    case 'build':

        require('./lib/build')();

        break;
}
