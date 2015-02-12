var express = require('express'),
    bodyParser = require('body-parser'),
    async = require('async'),
    glob = require('glob'),
    path = require('path'),
    fs = require('fs'),
    fse = require('fs-extra'),
    colors = require('colors');

var root = process.cwd() + '/src';

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(root));

app.get('/', function (req, res) {

    render('index.html', res);
});

app.get('/editor', function (req, res) {

    render('weltmeister.html', res);
});

function render (template, res) {

  fs.readFile(template, function (err, html) {

    if (err) { throw err; }

    res.writeHeader(200, {'Content-Type': 'text/html'});
    res.write(html);
    res.end();
  });
}

app.get('/api/glob', function (req, res) {

    async.reduce(req.query.glob, [], function (memo, item, callback) {

        glob(item, {cwd: root}, function (e, matches) {

            for (var i in matches) { memo.push(matches[i]); }

            callback(null, memo);
        });
    },
    function (err, result) { res.send(result); });
});

app.post('/api/save', function (req, res) {

    var path = req.body.path,
        data = req.body.data;

    path && data ?

        /\.js$/.test(path) ?

            fse.outputFile(root + '/' + path, data, function (err) {

                err ? res.send({error: 2, msg: 'Couldn\'t write to file: ' + path}) :
                    res.send({error: 0});
            })

            :

            res.send({error: 3, msg: 'File must have a .js suffix'})

        :

        res.send({error: 1, msg: 'No Data or Path specified'});
});

app.get('/api/browse', function (req, res) {

    var dir = req.query.dir || '',
        type = req.query.type,
        types = {scripts: ['.js'], images: ['.png', '.gif', '.jpg', '.jpeg']},
        result = {parent: false, dirs: [], files: []},
        filter, stats, dirpath;

    filter = (type && types[type]) ? types[type] : false;

    result.parent = req.query.dir ? dir.substring(0, dir.lastIndexOf('/')) : false;

    dir[dir.length - 1] === '/' && (dir = dir.substring(0, dir.length - 1));

    dir += '/';

    dirpath = path.normalize(root + dir);

    fs.readdir(dirpath, function (err, files) {

        for (var i in files) {

            stats = fs.statSync(dirpath + files[i]);

            stats.isDirectory() ? result.dirs.push(dir + files[i]) :

            stats.isFile() &&
                filter ? filter.indexOf(path.extname(files[i])) >= 0 && result.files.push(dir + files[i])
                    : result.files.push(dir + files[i]);
        }

        res.send(result);
    });
});

module.exports = {

    run: function (port, domain) {

        var PORT = Number(port) || 3000;

        app.listen(PORT);

        console.log('impact-node server is listening at '.green +
                    ('http://localhost:' + PORT).yellow +
                    ' Editor: '.green +
                    ('http://localhost:' + PORT + '/editor').yellow);
    }
};
