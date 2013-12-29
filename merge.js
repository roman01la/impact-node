var fs = require('fs'),
    fse = require('fs-extra'),
    wrench = require('wrench');

// Move stuff in a right way
var overWriteConfig = {
  forceDelete: false,
  preserveFiles: true
};

// Get game & editor pages
fse.copy('impact/weltmeister.html', 'weltmeister.html', errorHandler);
fs.readFile('impact/index.html', 'utf8', function (err, data) {
  errorHandler(err);

  data = data.replace(/<canvas id="canvas"><\/canvas>/g,
    '<a href="/editor" target="blank_" class="btn">Editor</a><canvas id="canvas"></canvas>');
  data = data.split('</style>').join('.btn{display:block;position:absolute;padding:6px 10px;color:#1F1F1F;text-decoration:none;background:#666;border-radius:4px;border:1px solid #303030;box-shadow:inset 0 1px #888,0 1px 2px #222;top:0;left:0;margin:10px}</style>');

  fs.writeFile('index.html', data, errorHandler);
});

// Crete folder
fse.mkdirs('public', errorHandler);
fse.mkdirs('public/lib', errorHandler);

// Get Impact++ lib files
fse.copy('node_modules/impactplusplus/lib/plusplus', 'public/lib/plusplus', function (err) {
  errorHandler(err);

  wrench.copyDirSyncRecursive('impact/lib/weltmeister', 'public/lib/weltmeister', overWriteConfig);

  fse.copy('node_modules/impactplusplus/lib/weltmeister', 'public/lib/weltmeister', function (err) {
    errorHandler(err);

    // Get ImpactJS lib files
    wrench.copyDirSyncRecursive('impact/lib/game', 'public/lib/game', overWriteConfig);
    wrench.copyDirSyncRecursive('impact/lib/impact', 'public/lib/impact', overWriteConfig);

    // Change API endpoints
    fs.readFile('public/lib/weltmeister/config.js', 'utf8', function (err, data) {
      errorHandler(err);

      data = data.replace(/lib\/weltmeister\/api\/save.php/g, '/api/save');
      data = data.replace(/lib\/weltmeister\/api\/browse.php/g, '/api/browse');
      data = data.replace(/lib\/weltmeister\/api\/glob.php/g, '/api/glob');

      fs.writeFile('public/lib/weltmeister/config.js', data, errorHandler);
    });
  });
});

// Get Impact++ media files
fse.copy('node_modules/impactplusplus/media', 'public/media', function (err) {
  errorHandler(err);

  // Get ImpactJS media files
  wrench.copyDirSyncRecursive('impact/media', 'public/media', overWriteConfig);
});

// Handle errors
function errorHandler (err) {
  if (err) {
    throw err;
  }
}
