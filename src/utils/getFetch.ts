let fetch;
if( __CLIENT__ ){
	require('whatwg-fetch');
	fetch = window.fetch; 
}else{
	fetch = require('node-fetch');
}
;

console.log(fetch);

export default fetch;