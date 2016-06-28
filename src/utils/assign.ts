export default function assign<A>(a:A):A;
export default function assign<A,B>(a:A,b:B):A&B;
export default function assign<A,B,C>(a:A,b:B,c:C):A&B&C;
export default function assign(a,b?,c?){
	return Object.assign({},a,b,c);
}