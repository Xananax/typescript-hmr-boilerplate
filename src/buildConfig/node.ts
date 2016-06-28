export default function buildNode(){
	return (
		{ console: true
		, global: true
		, process: true
		, Buffer: true
		, __filename: false
		, __dirname: false
		, setImmediate: true
		}
	);
} 