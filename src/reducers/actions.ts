import assign from '../utils/assign';
import {Store,ActionsReducers} from '../utils/ActionsReducers';

export default ActionsReducers({
	friends:Store(
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
	)
,	notes:
		{ state:
			{ friends:
				[0, 1, 2]
			, friendsById:
				[
					{ id: 0
					, name: '2Pac'
					}
				,	{ id: 1
					, name: 'Dr.Dre'
					}
				,	{ id: 2
					, name: 'Big Pun'
					}
				]
			}
		, actions:
			{ add(state,payload)
				{
					const len = state.friends.length ? state.friends.length : 1;
					const newId = (state.friends[len - 1] + 1) || 0;
					return (
						{ friends: state.friends.concat(newId)
						, friendsById: 
							[ ...state.friendsById
							,	{ id:newId
								, name:payload.name
								, starred:false
								}
							]
						}
					);
				}
			, remove(state,payload)
				{
					return (
						{ friends: state.friends.filter((id) => id !== payload.id)
						, friendsById: state.friendsById.filter((friend) => friend.id !== payload.id)
						}
					);
				}
			, star(state,payload)
				{
					return (
						{ friendsById:
							state.friendsById.map
								( friend => 
									( friend.id === payload.id ) ? 
										assign(friend,{starred: !friend.starred}) : 
										friend 
								)
						}
					)
				}
			}
		}
,	api:{
		async:(payload,meta,getState,actions,dispatch)=>{
			const {app_id,app_secret,page_name} = payload;
			function sendErr(field){
				return actions.error(`${field} is required`,{field});
			}
			if(!app_id){return sendErr('app_id');}
			if(!app_secret){return sendErr('app_secret');}
			if(!page_name){return sendErr('page_name');}
			const access_token = `${app_id}|${app_secret}`;
			const url = `https://graph.facebook.com/${page_name}/?access_token=${access_token}`;
			return fetch(url).then(res=>res.json());
		}
	,	state:
		{ answer: false
		, app_id:true
		, app_secret:true
		, page_name:true
		}
	,	actions:
			{ success(state,payload,meta)
				{
					return (
						{ answer:payload
						, app_id:true
						, app_secret:true
						, page_name:true
						}
					)
				}
			, error(state,payload,meta)
				{
					const {field} = meta;
					return {[field]:false}
				}
			}
	}
});