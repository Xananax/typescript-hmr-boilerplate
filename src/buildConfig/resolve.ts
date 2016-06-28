export default function resolve(extensions:string[]){
	return (
		{ extensions:extensions.map(ext=>`.${ext.replace(/^\.+/,'')}`)
		, modulesDirectories:
			[ 'node_modules'
			, 'shared'
			]
		}
	)
}