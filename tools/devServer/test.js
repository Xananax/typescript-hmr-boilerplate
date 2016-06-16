const MemoryFS = require('memory-fs');

const fs = new MemoryFS();
const sandbox = require('./sandbox')(fs);

fs.writeFileSync("/a.js",`
const fs = require("fs");
const React = require("react");
const ReactDom = require('react-dom');
const a = require("path")
console.log('hello World!');
const b = fs.readFileSync('/s.js','utf8')
const c = fs.readFileSync('/home/xananax/mhx_import.cfg','utf8');
console.log(b)
const A = React.createClass({
	render(){
		return React.createElement('div','hello')
	}
})
console.log(ReactDom.server.renderToString(React.createElement(A)))
console.log(c)
`);

fs.writeFileSync("/s.js",`
console.log('hello World!!!!');
`);


fs.writeFileSync('/test.js', `require('./a')`);
sandbox.execute('require("/test.js");');