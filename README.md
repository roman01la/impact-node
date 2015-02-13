[![npm version](https://badge.fury.io/js/impact-node.svg)](http://badge.fury.io/js/impact-node)

impact-node
===========

This package includes Node.js server for ImpactJS backend.

![impact-node logo composed of Node.js and Impact logos](impact-node_logo.png)

## Installation

`npm install -g impact-node`

## Usage

### Initialize project

`impact-node init /absolute/path/to/impact/dir`

This will copy ImpactJS core into current directory and initialize project, thus you can keep ImpactJS somewhere on your disk.

### Run development server

`impact-node serve`

This will run the server at [http://localhost:3000/](localhost:3000).

- Game view: [http://localhost:3000/](localhost:3000/)
- Weltmeister level editor: [http://localhost:3000/editor/](localhost:3000/editor/)

You can run server on different port.

`impact-node serve -p 9000`

And in watch mode. Game view will be updated when project's files changed.

`impact-node serve -watch`

### Build

`impact-node build`

This will compress code into a single file ready for production.
Outputs `build/game.js`.
