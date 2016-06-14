export default function isFunction(arg:any):arg is Function{
	return (arg && (typeof arg == 'function'));
}