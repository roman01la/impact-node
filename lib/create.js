'use strict';

module.exports = function (command, value) {

    switch (command) {

        case 'project':

            require('./create-project')(value);

            break;


        case 'entity':

            require('./create-entity')(value);

            break;
    }
};
