/// <reference path="./ActionReducers.d.ts" />

import assign from '../assign';

/**
 * Takes a bunch of processors and returns a single reducer.
 * A processor is a reducer that returns a object to be merged with the state.
 * it does *not* need to return a modified state
 * 
 * @param  {any} initialState
 * @param  {RxActRed.ActionProcessors} processors
 * @param  {RxActRed.ActionProcessor<T>} errorReducer?
 * @returns RxActRed
 */
export default function combineProcessorsToReducer<T>(initialState:T,processors:RxActRed.ActionProcessors,errorReducer?:RxActRed.ActionProcessor<T>):RxActRed.Reducer<T>{
	const hasErrorReducer = !!errorReducer;
	return function reducer(state:T=initialState,action:RxActRed.Action):T{
		const {type,payload,meta,error} = action;
		const actionProcessor = (error && hasErrorReducer) ? errorReducer : processors[type];
		console.log('sdd',processors,processors);
		if(!actionProcessor){return state;}
		const ret = actionProcessor(state,payload,meta,type);
		if(!ret){return state;}
		return assign(state,ret); 
	}
}