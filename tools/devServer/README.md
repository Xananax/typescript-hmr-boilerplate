# DevServer-tools

A suite of tools that allow concurrent running of a server and its client files, both with hot reloading enabled.

The code is largely stolen from webpack-dev-middleware

## Usage

```js
import compileServer from './compileServer'

compileServer(/* options */,function(err){
	if(err){throw err;}
});

```

the callback is not necessary. The options are the same as the ones provided to the webpack configurator (in `./tools/webpack`)


compileServer will take care of:

- creating two webpack configs, extending the eventual passed options, one for the server, one for the client
- creating a compiler that watches both configurations' files
- creating a bound middleware suitable for usage in a connect/express server
- require'ing the generated server file

The server file *must* export a single function of signature:

```js
module.exports = function(compiler,webpackConfig,webpackMiddleware,cb?){
	// do whatever you want
	// for example:
	// app.use(webpackMiddleware);
	cb && cb();
}
``` 