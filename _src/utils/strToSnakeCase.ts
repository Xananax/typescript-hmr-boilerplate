export default function strToSnakeCase(str:string):string{
	return str.replace
		( /\.?([A-Z]+)/g
		, (x,y)=>"_" + y.toLowerCase()
		)
		.replace(/^_/, "")
		.toUpperCase();
}
