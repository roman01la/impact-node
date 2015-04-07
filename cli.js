'use strict';

var helpers = require('./lib/helpers'),
    Insight = require('insight');

var args = process.argv,
    task = args[2];

var pkg = require('./package.json');

var v = '1.2.5',
    help = '\nUsage:\n\nimpact-node create:project {path to impact dir}\nimpact-node create:entity {name}\nimpact-node serve\nimpact-node serve -p 9000\nimpact-node serve -watch\nimpact-node build',
    insightMsg = '\n==========================================================================\n' +
                'May ' + pkg.name + ' anonymously report usage statistics to improve the tool over time?' +
                '\n==========================================================================\n';

var insight = new Insight({

    trackingCode: 'UA-21506179-30',
    pkg: pkg
});

function init() {

    if ((/create:/).test(task)) {

        var createWhat = args[2].split(':')[1];
        insight.track('create', createWhat);
        return require('./lib/create')(createWhat, args[3]);
    }

    switch (task) {

        case 'serve':

            insight.track('serve');
            require('./lib/server')
                .run(helpers.getVal(args, '-p'), helpers.getVal(args, '-watch'));

            break;


        case 'build':

            insight.track('build');
            require('./lib/build')();

            break;

        case '-v':

            insight.track('version');
            console.log(v);

            break;

        case '-h':

            insight.track('help');
            console.log(help);

            break;

        default:

            console.log(help);

            break;
    }
}

if (insight.optOut === undefined) {

    insight.askPermission(insightMsg, init);
}
else {

    init();
}
