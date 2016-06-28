/// <reference path="./ActionReducers.d.ts" />

import assign from '../assign';
import isFunction from '../isFunction';
import strToSnakeCase from '../strToSnakeCase';
import actionTypeToAsyncActionCreator from './actionTypeToAsyncActionCreator';
import combineProcessorsToReducer from './combineProcessorsToReducer';

export default function makeAsyncReducerActions<T>(reducerName:string,asyncFn:RxActRed.AsyncActionProcessor<T>,state:T,actionsConf:RxActRed.ActionReducerActions,actions:RxActRed.Actions={}):RxActRed.ActionReducerTuple<T>{

	state = state || <T>{}; 
	const mainType = reducerName ? strToSnakeCase(reducerName) : '';

	const start = actionTypeToAsyncActionCreator(mainType,asyncFn);
	
	actions[`${reducerName}Start`] = start.start;
	actions[reducerName] = start;
	actions[`${reducerName}Started`] = start.started;
	actions[`${reducerName}Error`] = start.error;
	actions[`${reducerName}Success`] = start.success;

	const reducers:RxActRed.ActionProcessors = {};

	if(isFunction(actionsConf)){
		reducers[start.success.type] = actionsConf;
	}else{
		const {success,error,started} = actionsConf;
		reducers[start.success.type] = success;
		reducers[start.started.type] = started;
		reducers[start.error.type] = error;
	}

	const reducer = combineProcessorsToReducer(state,reducers);
	
	return [reducer,actions,state]
}