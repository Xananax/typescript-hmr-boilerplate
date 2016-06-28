import {ActionsReducers} from '../utils/ActionsReducers';
import express from 'express';
import assign from '../utils/assign';
import getFetch from '../utils/getFetch';

//const fetch = getFetch();

const fetch = function(a){
	return new Promise(function(resolve,reject){
		setTimeout(()=>resolve(a),400);
	});
}

const state =
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

const actions = 
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
	}

Object.keys(actions).forEach(function(actionName){
	const action = actions[actionName];
	function actionDispatcher(dispatch,getState){

	}
	function reducer(){

	}
});

const app = express();
export default app;