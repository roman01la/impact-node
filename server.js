var express = require('express'),
    async = require('async'),
    glob = require('glob'),
    path = require('path'),
    fs = require('fs'),
    app = express(),
    port = 8080;

var root = __dirname + '/public';

app.configure(function() {
  app.use(express.static(root));
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(app.router);
});

// Game & editor routes
app.get('/', function (req, res) {
  render('index.html', res);
});

app.get('/editor', function (req, res) {
  render('weltmeister.html', res);
});

function render (template, res) {
  fs.readFile(template, function (err, html) {
    if (err) {
      throw err;
    }

    res.writeHeader(200, {'Content-Type': 'text/html'});
    res.write(html);
    res.end();
  });
}

// API routes
app.get('/api/glob', function (req, res) {
  async.reduce(req.query.glob, [], function (memo, item, callback) {
    glob(item, {cwd: root}, function (e, matches) {
      for (var i in matches) {
        memo.push(matches[i]);
      }

      callback(null, memo);
    });
  },
  function (err, result) {
    res.send(result);
  });
});

app.post('/api/save', function (req, res) {
  var path = req.body.path,
      data = req.body.data;

  if (path && data) {
    if (/\.js$/.test(path)) {
      fs.writeFile(root + '/' + path, data, function (err) {
        if (err) {
          res.send({error: 2, msg: 'Couldn\'t write to file: ' + path});
        } else {
          res.send({error: 0});
        }
      });
    } else {
      res.send({error: 3, msg: 'File must have a .js suffix'});
    }
  } else {
    res.send({error: 1, msg: 'No Data or Path specified'});
  }
});

app.get('/api/browse', function (req, res) {
  var dir = req.query.dir || '',
      type = req.query.type,
      types = {scripts: ['.js'], images: ['.png', '.gif', '.jpg', '.jpeg']},
      result = {parent: false, dirs: [], files: []};

  var filter = (type && types[type]) ? types[type] : false;

  result.parent = req.query.dir ? dir.substring(0, dir.lastIndexOf('/')) : false;

  if (dir[dir.length-1] === '/') {
    dir = dir.substring(0, dir.length - 1);
  }

  dir += '/';

  var dirpath = path.normalize(root + dir);

  var stats;

  fs.readdir(dirpath, function (err, files) {
    for (var i in files) {
      stats = fs.statSync(dirpath + files[i]);

      if (stats.isDirectory()) {
        result.dirs.push(dir + files[i]);
      } else if (stats.isFile()) {
        if (filter) {
          if (filter.indexOf(path.extname(files[i])) >= 0) {
            result.files.push(dir + files[i]);
          }
        } else {
          result.files.push(dir + files[i]);
        }
      }
    }

    res.send(result);
  });
});

app.listen(port);

console.log('Impact server is listening on port', port);
