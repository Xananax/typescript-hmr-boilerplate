export default function loop(obj:any,fn:(val:any,name:string)=>void):void{
	obj && (typeof obj == 'object') && Object.keys(obj).forEach(function(name){
		const curr = obj[name];
		fn(curr,name);
	});
}