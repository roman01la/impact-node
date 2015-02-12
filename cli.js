var args = process.argv,
    task = args[2];

switch (task) {


    case 'init':

        require('./lib/init')(args[3]);

        break;


    case 'serve':

        require('./lib/server')
            .run(getVal(args, '-p'));

        break;


    case 'build':

        require('./lib/build')();

        break;
}

function getVal(args, key) {

    for (var i = 0, ln = args.length; i < ln; i++) {

        if (args[i] === key) { return args[i + 1]; }
    }
}
