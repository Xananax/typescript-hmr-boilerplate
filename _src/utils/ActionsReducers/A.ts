/// <reference path="./ActionReducers.d.ts" />

import assign from '../assign';
import fetch from '../getFetch';
import strToSnakeCase from '../strToSnakeCase';
import loop from '../loop';
import isFunction from '../isFunction';
import strCapitalizeFirst from '../strCapitalizeFirst';

export namespace ActionsCreators {

	export interface Thenable<T>{
		then<V>(fn:(val:T)=>V):Thenable<V>;
		catch<V>(fn:(val:Error)=>V):Thenable<V>;
	}

	interface Dispatch{
		(action:Action|AsyncAction):any;
	}

	interface GetState{
		():any
	}

	export interface Action{
		type:string;
		error:boolean;
		payload:any;
		meta:any;
	}

	export interface ActionError extends Action{
		error:boolean;
		payload:Error;
	}

	export interface AsyncAction{
		(dispatch:Dispatch,getState:GetState):Thenable<any>
	}

	export type AnyAction = Action | AsyncAction;

	export interface ActionCreator{
		(payload?:any,meta?:any,err?:Error):AnyAction
		type:string;
	}

	export interface ActionCreatorSync extends ActionCreator{
		(payload?:any,meta?:any,err?:Error):Action;
		start:ActionCreatorSync;
	}


	export interface ActionCreatorAsync extends ActionCreator{
		(payload?:any,meta?:any,err?:Error):AsyncAction
		start:ActionCreatorAsync;
		started:ActionCreatorSync;
		error:ActionCreatorSync;
		success:ActionCreatorSync;
	}

	export interface ActionDispatcher<T>{
		(payload?:any,meta?:any,err?:Error):T;
	}

	export interface AsyncActions{
		success:RxActRed.ActionDispatcher<Action>;
		started:RxActRed.ActionDispatcher<Action>;
		error:RxActRed.ActionDispatcher<Thenable<any>>;
	}

	export interface Reducer<T>{
		(state:T,action:Action):T
	}

	export interface ActionProcessor<T>{
		(state:T,payload?:any,meta?:any,type?:string):T
	}

	export interface AsyncActionProcessor<T>{
		(payload:any,meta?:any,getState?:GetState,actions?:AsyncActions,dispatch?:Dispatch):Thenable<T>
	}

	export interface AsyncActionConfig{
		_:AsyncActionProcessor<any>
		success?:ActionProcessor<any>;
		error?:ActionProcessor<any>;
		started?:ActionProcessor<any>;
	}

	export interface Map<T>{
		[name:string]:T;
	}

	export const SkipError = new Error('SKIP');

	export interface NamesMap extends Map<string>{}

	export interface ActionProcessors extends Map<ActionProcessor<any>>{}

	export interface Reducers extends Map<Reducer<any>>{}

	export interface Actions extends Map<ActionCreator>{}

	export type ActionReducerActions = ActionProcessors | ActionProcessor<any> | AsyncActionConfig;

	export interface ActionsConfig {
		state?:any;
		actions:ActionReducerActions;
	}

	export interface ActionReducerTuple<T> extends Array<any>{
		0:Reducer<any>;
		1:Actions;
		2:T;
	}

	export type ValidActionsConfig = ActionReducerTuple<any> | ActionsConfig;

	export interface StoreState{
		ids:number[];
		byId:any[];
	}

	export interface StoreElementEdit{
		(state:StoreState,id:number,fn:(el:any)=>any)
	}

	export interface StoreGenerated{
		state:StoreState;
		add:ActionProcessor<any>;
		addMany:ActionProcessor<any>;
		remove:ActionProcessor<any>;
		update:ActionProcessor<any>;
		toggle:ActionProcessor<any>;
	}

	export interface StoreProcessor{
		(store:StoreGenerated,edit:StoreElementEdit):any;
	}

	export interface StoreCreator{
		(newId:number,payload:any,elements?:any[]):any
	}

	export function actionTypeToActionCreator
		( type:string
		):ActionCreatorSync
		{
			const actionCreator = <ActionCreatorSync>function(payload:any,meta:any,err?:Error):Action{
				let error = false;
				payload = errToPayload(payload,err); 
				if(payload instanceof Error){error = true;}
				return { type, payload, meta, error }
			}
			actionCreator.type = type;
			return actionCreator
		}


	export function combineProcessorsToReducer<T>
		( initialState:T
		, processors:ActionProcessors
		, errorReducer?:ActionProcessor<T>
		):Reducer<T>
		{
			return function reducer(state:T=initialState,action:Action):T{
				const {type,payload,meta,error} = action;
				const actionProcessor = (error && errorReducer) ? errorReducer : processors[type];
				if(!actionProcessor){return state;}
				try{
					const ret = actionProcessor(state,payload,meta,type);
					if(!ret){return state;}
					return assign(state,ret);
				}catch(e){
					console.log(actionProcessor);
					throw e;
				}
			}
		}

	export function combineReducersToReducer<T>
		( initialState:T
		, reducers:Reducers
		, namesMap:NamesMap
		):Reducer<T>
		{
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

	export function isAsyncActionConfig
		( thing:any
		):thing is AsyncActionConfig{
		return (
			(typeof thing == 'object') &&
			('_' in thing) &&
			('success' in thing)
		)
	}

	export function appendAsyncActions(
			actionsConf:AsyncActionConfig
		,	mainType:string
		,	reducerName:string
		,	processors:ActionProcessors
		,	actions:Actions
		)
		{
			const asyncFn = actionsConf._;

			const action = actionTypeToAsyncActionCreator(mainType,asyncFn);

			console.log(action)

			actions[reducerName] = action;
			actions[`${reducerName}Start`] = action; 
			actions[`${reducerName}Started`] = action.started;
			actions[`${reducerName}Error`] = action.error;
			actions[`${reducerName}Success`] = action.success;

			const {success,error,started} = actionsConf;

			processors[action.success.type] = success;

			if(started){ 
				processors[action.started.type] = started; 
			}
			if(error){ 
				processors[action.error.type] = error;
			}
		}

	export function appendSyncAction(
			processor:ActionProcessor<any>
		,	mainType:string
		,	reducerName:string
		,	actionName:string
		,	processors:ActionProcessors
		,	actions:Actions
		){
			const actionCreator = actionTypeToActionCreator(mainType);
			processors[reducerName] = processor;
			actions[actionName] = actionCreator;
		}

	export function makeSyncReducer<T>
		( reducerName:string
		, state:T
		, actionsConf:ActionReducerActions
		, actions:Actions={}
		, processors:ActionProcessors = {}
		):ActionReducerTuple<T>
		{
			state = state || <T>{};
			const mainType = reducerName ? strToSnakeCase(reducerName) : '';
			let errorReducer;

			if(isFunction(actionsConf)){
				appendSyncAction(actionsConf,mainType,mainType,reducerName,processors,actions);
				return;
			}
			else if(isAsyncActionConfig(actionsConf)){
				appendAsyncActions(actionsConf,mainType,reducerName,processors,actions);
				return;
			}
			else{
				loop(actionsConf,function(actionProcessor,actionName){
					if(actionName == 'error'){
						errorReducer = actionProcessor;
					}
					const actionType = strToSnakeCase(actionName);
					const type = mainType ? `${mainType}_${actionType}` : actionType;
					const name = reducerName ? `${reducerName}${strCapitalizeFirst(actionName)}`:actionName;
					if(isFunction(actionProcessor)){
						appendSyncAction(actionProcessor,type,name,actionName,processors,actions);
					}else if(isAsyncActionConfig(actionProcessor)){
						appendAsyncActions(actionProcessor,type,name,processors,actions);
					}else{
						makeSyncReducer(name,state,actionProcessor,actions,processors);
					}
				});
			}

			const reducer = combineProcessorsToReducer(state,processors,errorReducer);
			return [reducer,actions,state];
		}

	/**
	 * Returns an object with that dispatches actions
	 * @param  {Dispatch} dispatch
	 * @param  {ActionCreatorSync} startedAction
	 * @param  {ActionCreatorSync} successAction
	 * @param  {ActionCreatorSync} errorAction
	 * @returns RxActRed
	 */
	export function mapActionsToDispatch
		( dispatch:Dispatch
		, startedAction:ActionCreatorSync
		, successAction:ActionCreatorSync
		, errorAction:ActionCreatorSync
		):AsyncActions
		{
			const actions:AsyncActions = 
				{ success:(payload,meta)=>dispatch(successAction(payload,meta))
				, started:(payload,meta)=>dispatch(startedAction(payload,meta))
				, error:(reason,meta)=>{
						const err:Error = (!(reason instanceof Error)) ? new Error(reason) : reason;
						const message = err.message;
						meta = meta ? assign(meta,{message}) : {message};
						dispatch(errorAction(err,meta))
						return Promise.reject(SkipError);
					}
				};
			return actions;
		}

	/**
	 * If `err` is true, returns an Error.
	 * @param  {any} payload
	 * @param  {Error|boolean} err
	 * @returns any
	 */
	export function errToPayload
		(payload:any
		, err:Error|boolean
		):any{
		if(err){
			if(err instanceof Error){
				return err;
			}else if(typeof payload == 'string'){
				return new Error(payload);
			}else{
				return new Error(`Error: ${err}`);
			}
		}
		return payload;
	}

	function actionTypeToAsyncActionCreator<T>
		( mainType:string
		, asyncFn:AsyncActionProcessor<T>
		):ActionCreatorAsync
		{
			const type_start = `${mainType}_START`;
			const type_success = `${mainType}_SUCCESS`;
			const type_error = `${mainType}_ERROR`;
			const type_started = `${mainType}_STARTED`;
			const startAction =  actionTypeToActionCreator(type_start);
			const startedAction =  actionTypeToActionCreator(type_started);
			const errorAction = actionTypeToActionCreator(type_error);
			const successAction = actionTypeToActionCreator(type_success);

			const asyncActionCreator = <ActionCreatorAsync>function(payload:any,meta:any,err:Error|boolean):AsyncAction{
				return function asyncAction(dispatch,getState):Thenable<any>{
					const actions = mapActionsToDispatch(dispatch,startedAction,successAction,errorAction);
					let error = false;
					payload = errToPayload(payload,err);
					if(payload instanceof Error){error = true;}
					if(error){
						return actions.error(payload,meta);
					}
					actions.started(payload,meta);
					return Promise.resolve(asyncFn(payload,meta,getState,actions,dispatch))
						.then(function(payload){
							actions.success(payload,meta);
							return payload;
						})
						.catch(function(err){
							if(err == SkipError){return;}
							actions.error(err,meta);
							return err;
						});
				}
			}
			asyncActionCreator.type = mainType;
			asyncActionCreator.start = asyncActionCreator;
			asyncActionCreator.started = startedAction;
			asyncActionCreator.error = errorAction;
			asyncActionCreator.success = successAction;
			return asyncActionCreator;
		}

	export function makeCombinedReducer
		( conf
		, actions:Actions={}
		):ActionReducerTuple<any>
		{
			const reducers:Reducers = {};
			const namesMap:NamesMap = {};
			const state = {};

			loop(conf,function(_conf,reducerName){

				if(!Array.isArray(conf)){
					_conf = ActionsReducers(_conf,reducerName);
				}
				const [reducer,_actions,_state] = _conf;

				state[reducerName] = _state;
				loop(_actions,function(actionCreator,actionName){
					actions[actionName] = actionCreator;
					const type = strToSnakeCase(actionName);
					namesMap[type] = reducerName;
					reducers[type] = reducer;
				});
			});

			const reducer = combineReducersToReducer(state,reducers,namesMap);

			return [reducer,actions,state]
		}

	export function ActionsReducers
		( conf
		, reducerName:string=''
		, allActions:Actions={}
		):ActionReducerTuple<any>
		{
			if(!conf){
				throw new Error(`no configuration`);
			}
			if(Array.isArray(conf)){return conf;}
			if('actions' in conf){
				const {state,actions} = conf;
				return makeSyncReducer(reducerName,state,actions,allActions);
			}
			return makeCombinedReducer(conf,allActions);
		}

}

export default ActionsCreators.ActionsReducers;