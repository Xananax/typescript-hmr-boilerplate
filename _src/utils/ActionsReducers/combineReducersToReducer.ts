/// <reference path="./ActionReducers.d.ts" />
import assign from '../assign';


/**
 * Takes reducers and combines them in a single reducer.
 * 
 * Contrary to redux's own `combineReducers` function, the action passed to the combined reducer
 * doesn't go through all nested reducers; Which reducer to use is decided by the action name.
 * 
 * Therefore, for an action 'SOME_ACTION', it is necessary to have a reducer called 'SOME_ACTION'.
 * 
 * Then, the function uses the `namesMap` argument to know where to merge state, which means 
 * namesMap should contain an object like so: `{SOME_ACTION:'statePoint'}`, which will instruct
 * the function to create a new state with a key `statePoint` containing the results from the reducer.
 * 
 * @param  {any} initialState
 * @param  {RxActRed.Reducers} reducers
 * @param  {RxActRed.NamesMap} namesMap
 * @returns RxActRed
 */
export default function combineReducersToReducer<T>(initialState:T,reducers:RxActRed.Reducers,namesMap:RxActRed.NamesMap):RxActRed.Reducer<T>{
	return function reducer(state:T=initialState,action):T{
		if(!action){return state;}
		const type = action.type;
		const reduce = reducers[type];
		if(!reduce){return state};
		const name = namesMap[type];
		const oldState = state[name];
		const newState = reduce(oldState,action);
		if(!newState || oldState == newState){return state;}
		const _state = assign(state,{[name]:newState});
		return _state;
	}
}