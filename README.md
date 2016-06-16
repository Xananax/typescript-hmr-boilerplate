# React + Typescript + Redux + hmr Starter Project

A boilerplate project to create universal apps with hot reloading enabled on both sides for development.


## Usage

If you plan on using typescript:

```sh
npm install -g typings && npm install && typings install
```

Otherwise, just:
```sh
npm install
```

Then, run the dev environment:

```sh
npm run task clean:create:dev
```
This runs an express server with hot reloading, and listens on the configured port (3000 by default).
The server has redux-devtools enabled, so you can show or hide the debug console with ctrl-h.

Or build:
```sh
npm run task clean:create:build
```
if you want to know what the commands do, run:
```sh
npm run task help:clean:create:build
```

If you want to change the default options, you'll want to have a look at the `./config` file at the root of the project. Check out `./tools/webpack/defaultOptions` for an idea on how to configure it.  