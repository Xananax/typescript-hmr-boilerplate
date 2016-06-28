export default function getDebugSessionKey():string{
	if(typeof window == 'undefined'){return null;}
	// By default we try to read the key from ?debug_session=<key> in the address bar
	const matches = window.location.href.match(/[?&]debug_session=([^&]+)\b/);
	return (matches && matches.length) ? matches[1] : null;
};