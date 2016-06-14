import { combineReducers } from 'redux';

import actionsReducers from './actions';

const [reducer,actions,state] = actionsReducers; 


/*
const ac1 = actions['friendsAdd']({name:'aliBaba'});
const ac2 = actions['friendsStar']({id:0});
const state1 = reducer(state,<RxActRed.Action>ac1)
const state2 = reducer(state1,<RxActRed.Action>ac2)

console.log(state1);
console.log(state2);
*/

export 
	{ actions
	, reducer
	, state
	};
