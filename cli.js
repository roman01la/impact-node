var args = process.argv,
    task = args[2];

(/create:/).test(task) && require('./lib/create')(args[2].split(':')[1], args[3]);

switch (task) {

    case 'serve':

        require('./lib/server')
            .run(getVal(args, '-p'), getVal(args, '-watch'));

        break;


    case 'build':

        require('./lib/build')();

        break;
}

function getVal (args, key) {

    for (var i = 0, ln = args.length; i < ln; i++) {

        if (args[i] === key) { return [key, args[i + 1]]; }
    }

    return [];
}
