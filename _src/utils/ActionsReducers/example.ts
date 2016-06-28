import assign from '../assign';
import makeReducerActions,{ActionsCreators} from './A';

const fetch = function fakeFetch(str):ActionsCreators.Thenable<{json():Object}>{
	return new Promise(function(resolve,reject){
		setTimeout(function() {
			if(str==makeUrl('a','b','c')){
				return resolve({
					json(){return {data:'ok'}}
				});
			}
			if(str==makeUrl('d','e','f')){
				return reject(new Error('wrong parameters'));
			}
		}, 300);
	})
}

function makeUrl(page_name:string,app_id:string,app_secret:string){
	const access_token = `${app_id}|${app_secret}`;
	const url = `https://place.com/${page_name}/?access_token=${access_token}`;	
	return url;
}

const [reducer,actions,state] = makeReducerActions(
	{ api:
		{ state:
			{ answer: false
			, app_id:true
			, app_secret:true
			, page_name:true
			}
		,	actions:
				{ call:
					{ _:(payload,meta,getState,actions,dispatch)=>
						{
							const {app_id,app_secret,page_name} = payload;
							function sendErr(field){
								return actions.error(`${field} is required`,{field});
							}
							if(!app_id){return sendErr('app_id');}
							if(!app_secret){return sendErr('app_secret');}
							if(!page_name){return sendErr('page_name');}
							const url = makeUrl(page_name,app_id,app_secret);
							return fetch(url).then(res=>res.json());
						}
					, success(state,payload,meta)
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
		}
	, notes:
		{ state:
			{ notes:
				[0, 1, 2]
			, notesById:
				[
					{ id: 0
					, name: 'ddddddddddd'
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
			{ something:
				{ drop(state,payload)
					{
						return ({somethingCalled:state.somethingCalled ? state.somethingCalled++ : 1});
					}
				}
			, blah:
				{ state:
					{ something:'a'
					}
				, actions:
					{ operate(state,payload)
						{
							return {something:'b'}
						}

					}
				}
			, add(state,payload)
				{
					const len = state.notes.length ? state.notes.length : 1;
					const newId = (state.notes[len - 1] + 1) || 0;
					return (
						{ notes: state.notes.concat(newId)
						, notesById: 
							[ ...state.notesById
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
						{ notes: state.notes.filter((id) => id !== payload.id)
						, notesById: state.notesById.filter((note) => note.id !== payload.id)
						}
					);
				}
			, star(state,payload)
				{
					return (
						{ notesById:
							state.notesById.map
								( note => 
									( note.id === payload.id ) ? 
										assign(note,{starred: !note.starred}) : 
										note 
								)
						}
					)
				}
			}
		}
	}
)

//const reducer = combineProcessorsToReducer(state,processors);

let currentState = state;

function dispatch(action){
	console.log('--------------------------------')
	const ret = reducer(currentState,action);
	console.log('received:',action.type);
	if(typeof ret == 'function'){
		return ret(dispatch,()=>currentState,action);
	}else{
		currentState = ret;
		console.log('current state:');
		console.log(currentState['notes'])
	}
}

/** 
 ** / 
/**/
//console.log(reducer.toString());
console.log('----')
console.log(actions);
//console.log('----')
//console.log(state);

//dispatch(actions['notesAdd']({name:'blah'}));
//dispatch(actions['apiCall']({page_name:'a',app_id:'b',app_secret:'c'}));
