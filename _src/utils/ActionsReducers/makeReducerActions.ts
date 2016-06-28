/// <reference path="./ActionReducers.d.ts" />

import assign from '../assign';
import strToSnakeCase from '../strToSnakeCase';
import loop from '../loop';
import isFunction from '../isFunction';
import actionTypeToSyncActionCreator from './actionTypeToSyncActionCreator';
import strCapitalizeFirst from '../strCapitalizeFirst';
import combineProcessorsToReducer from './combineProcessorsToReducer';
import actionTypeToAsyncActionCreator from './actionTypeToAsyncActionCreator';
import isAsyncActionConfig from './isAsyncActionConfig';
import isActionsConfig from './isActionsConfig';
import combineReducersToReducer from './combineReducersToReducer';

function bindProcessor<T>(initialState,stateKey:string,actionType:string,processor:(state:T,payload:any,meta:any)=>T):RxActRed.ActionProcessor<T>{
	const boundProcessor = function(state:T=initialState,payload:any,meta:any){
		const ret = processor(state,payload,meta);
		if(!ret){return state;}
		return assign(state,{[stateKey]:ret});
	}
	return boundProcessor;
}

/**
 * 
 * 
 * @param  {string} reducerName
 * @param  {T} state
 * @param  {RxActRed.ActionReducerActions} actionsConf
 * @param  {RxActRed.Actions={}} actions
 * @returns RxActRed
 */
function _makeReducerActions<T>(reducerName:string,state:T,actionsConf,actions:RxActRed.Actions={},processors:RxActRed.ActionProcessors = {},stateKey?:string):RxActRed.ActionReducerTuple<any>{
	
	state = state || <T>{};
	stateKey = stateKey || reducerName;
	const mainType = reducerName ? strToSnakeCase(reducerName) : '';

	if(isActionsConfig(actionsConf)){
		const reducers:RxActRed.Reducers = {};
		const {state:_initialState,actions:_actionsConf} = actionsConf;
		const namesMap:RxActRed.NamesMap = {};
		const [_reducer,_actions,_state] = _makeReducerActions(reducerName,_initialState,_actionsConf);	
		state[stateKey] = _initialState;
		loop(_actions,function(actionCreator,actionName){
			actions[actionName] = actionCreator;
			const type = strToSnakeCase(actionName);
			namesMap[type] = reducerName;
			reducers[type] = _reducer;
		});
		const reducer = combineReducersToReducer(state,reducers,namesMap);
		return [reducer,actions,state];
	}

	if(isFunction(actionsConf)){
		processors[mainType] = bindProcessor(state,stateKey,mainType,actionsConf);
		const actionCreator = actionTypeToSyncActionCreator(mainType);
		actions[reducerName] = actionCreator;
		const reducer = combineProcessorsToReducer(state,processors);
		return [reducer,actions,state];
	}

	if(isAsyncActionConfig(actionsConf)){
		const asyncFn = actionsConf._;
		const action = actionTypeToAsyncActionCreator(mainType,asyncFn);
		actions[reducerName] = action;
		actions[`${reducerName}Start`] = action; 
		actions[`${reducerName}Started`] = action.started;
		actions[`${reducerName}Error`] = action.error;
		actions[`${reducerName}Success`] = action.success;
		const {success,error,started} = actionsConf;
		processors[action.success.type] = bindProcessor(state,stateKey,mainType,success);
		if(started){ 
			processors[action.started.type] = bindProcessor(state,stateKey,mainType,started); 
		}
		if(error){ 
			processors[action.error.type] = bindProcessor(state,stateKey,mainType,error);
		}
		const reducer = combineProcessorsToReducer(state,processors);
		return [reducer,actions,state];
	}

	loop(actionsConf,function(actionProcessor,actionName){
		const actionType = strToSnakeCase(actionName);
		const type = mainType ? `${mainType}_${actionType}` : actionType;
		const name = reducerName ? `${reducerName}${strCapitalizeFirst(actionName)}` : actionName;
		console.log('::',name)
		_makeReducerActions(name,state,actionProcessor,actions,processors,actionName);
	});

	if(stateKey=='ROOT'){
		console.log('sdfsddf',processors);
	}

	const reducer = combineProcessorsToReducer(state,processors);

	return [reducer,actions,state];
}

export default function makeReducerActions(actionsConf){
	
	return _makeReducerActions('ROOT',{},actionsConf);
	
}