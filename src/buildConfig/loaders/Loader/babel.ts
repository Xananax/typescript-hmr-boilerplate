import extend from 'extend';

const defaults =
	{ presets:
		[ "es2015"
		, "react"
		, "stage-1"
		]
	, ignore: 
		[ '**/node_modules/**' ]
	/** /
	, extensions:
		[ ".jsx"
		, ".js"
		, ".tsx"
		, ".ts"
		]
	, plugins:
		[ "transform-react-require" 
		]
	/**/
	}

export default function babelConfig(conf){
	return extend(true,{},defaults,conf);
}