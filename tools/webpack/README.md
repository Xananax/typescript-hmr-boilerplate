# webpackConfigurator

A suite of tools to create webpack configurations.

All the useful functions are in `./utils`.

Plugins configurations such as babel are in `./pluginsConfigs`.

## Utils

### getOptions(CONSTS:any)=>PARSED_CONSTS

returns a configuration object that is used to create a webpack configuration.

To see what `CONSTS` might look like, have a look at `./defaultOptions.js`.

All values can be set through environment variables.

`getOptions` takes care of making a cohesive configuration object by concatenating a few values and doing some other menial tasks.

The most important flags you'll want to pay attention to are:

- `PROD` which sets the environment to `production` (can also be set by setting `ENV` to `'development'`). Defaults to false
- `BUILD_TYPE` which decides if the build is a server build (node) or a browser build. To set to server, set it to `'server'`. defaults to `'client'`   

### getConfig(PARSED_CONSTS:any)=>WebpackConfiguration

Takes a complete `CONSTS` object and returns a suitable webpack configuration object, that you can use either on the command line, or as an argument to `webpack`.

----

## Other Customizations

Complex customization is not doable through just setting `CONSTS`, so you might want to dig into how the configuration is created.

For this, you can open...

- `./utils/getConfig.js` for the final config
- `./utils/getLoaders.js` for the loaders setup
- `./utils/getPlugins.js` for the plugins setup