# ActionsReducer


A helper to create actions.

Takes a structure like this one:

```js
const global = {
	notes:{ state:
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
		{ add(state,payload)
			{
				const len = state.notes.length ? state.notes.length : 1;
				const newId = (state.notes[len - 1] + 1) || 0;
				return (
					{ notes: state.notes.concat(newId)
					, notesById: 
						[ ...state.notesById
						,	{ id:newId
							, name:payload.name
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
		}
	}
}
```

And turns it into:

```js

const [reducer,actions,state] = ActionsReducer(global);

console.log(reducer)// function(state,action)=>state
console.log(actions)// {notesAdd:(payload,meta,err)=>action,notesRemove:(payload,meta,err)=>action}
console.log(state) // {notes:{notes,notesById}}

// add a note:
dispatch(actions.notesAdd({name:'something'}));

```
There's a `Store` helper that creates a structure similar to the one above. You'd use it like so:

```js
const [reducer,actions,state] = ActionsReducer({
	notes:Store(
		//optional. If not provided, objects will be created with the full contents
		// of `payload`
		function create(newId,payload,collection){
			return Object.assign({id:newId},payload);
		}
		// this returns the actual store. Also optional.
		// you can use it to create default elements, for example.
	,	function process(store,edit){ 
			const {state,add,addMany,remove,update,toggle} = store;
			return {
				state
			,	actions:{ add, addMany, remove, update, toggle }	
			}
		}
	)
});
```

Nested states are totally possible. If ActionsReducer is called on a non-nested object (in the example above, `notes` would be the top-level object), then the action names would be unchanged (they'd remain `add` and `remove` instead of `notesAdd` and `notesRemove`).

What about async states? Got you covered:

```js
const global = { 
	api:{ async:(payload,meta,getState,actions,dispatch)=>
		{
			const {app_id,app_secret,page_name} = payload;
			const access_token = `${app_id}|${app_secret}`;
			const url = `https://graph.facebook.com/${page_name}/?access_token=${access_token}`;
			return fetch(url).then(res=>res.json());
		}
	,	state:
		{ answer: false
		}
	,	actions:
			{ success(state,payload,meta)
				{
					return ({ answer:payload })
				}
			, error(state,payload,meta)
				{
					return ({answer:false});
				}
			}
	}
};

const [reducer,actions,state] = ActionsReducer(global);

// make a request:
dispatch(actions.api({app_id:'a',app_secret:'b',page_name:'me'}));
```