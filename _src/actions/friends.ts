import {Store} from '../utils/ActionsReducers';
import assign from '../utils/assign';

const friends = Store(
	(id,payload)=>(
		{ id
		, name:payload.name
		, starred:false
		}
	)
,	({state,add,addMany,remove,update,toggle},edit)=>(
		{ state:addMany
			(
				state
			,	{ list:
					[ { name: '2Pac' }
					, { name: 'Dr.Dre' }
					, { name: 'Big Pun' }
					]
				}
			)
		, actions:
			{ add
			, remove
			, star:(state,payload)=>edit(state,payload.id,(el)=>assign(el,{starred: !el.starred}))
			}
		}
	)
);

export default friends;