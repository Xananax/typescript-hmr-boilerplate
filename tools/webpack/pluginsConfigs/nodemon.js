/**
 * This is currently not used in this config
 */
module.exports = 
	{ execMap:
		{ js: 'node' }
	, script: require('path').join(__dirname, 'build/backend')
	, ignore: ['*']
	, watch: ['nothing/']
	, ext: 'noop'
	}