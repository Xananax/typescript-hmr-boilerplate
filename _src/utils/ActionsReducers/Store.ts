import assign from '../assign';

function defaultCreate(newId,payload){
	return assign({id:newId},payload);
}

function defaultProcess(store,edit){
	const {state,add,addMany,remove,update,toggle} = store;
	return {
		state
	,	actions:
		{ add, addMany, remove, update, toggle }	
	}
}

export default function Store(create?:RxActRed.StoreCreator,process?:RxActRed.StoreProcessor){

	if(!process){process = defaultProcess;}

	if(!create){create = defaultCreate;}

	const state = 
		{
			ids:[]
		,	byId:[]
		}
	function add(state,payload,meta?)
		{
			const len = state.ids.length || 1;
			const newId = (state.ids[len - 1] + 1) || 0;
			return (
				{ ids: state.ids.concat(newId)
				, byId: 
					[ ...state.byId
					,	create(newId,payload,state.byId)
					]
				}
			);
		}

	function addMany(state,payload,meta){
		const list = payload.list;
		list.forEach(function(el){
			state = add(state,el,meta);
		})
		return state;
	}

	function remove(state,payload)
		{
			return (
				{ ids: state.ids.filter((id) => id !== payload.id)
				, byId: state.byId.filter(el => el.id !== payload.id)
				}
			);
		}

	function edit(state,id,fn)
		{
			return (
				{ byId:
					state.byId.map
						( el => 
							( el.id === id ) ? fn(el) : el
						)
				}
			)
		}

	function update(state,payload)
		{
			return edit(state,payload.id,(el)=>assign(el,payload)); 
		}

	function toggle(state,payload)
		{
			const propName = payload.prop;
			return edit(state,payload.id,(el)=>assign(el,{[propName]: !el[propName]}));
		}

	const props = {
		state, add, addMany, remove, update, toggle
	}

	return process(props,edit);
}