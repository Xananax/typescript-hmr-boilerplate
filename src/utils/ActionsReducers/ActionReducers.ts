/// <reference path="./ActionReducers.d.ts" />

import assign from '../assign';
import fetch from '../getFetch';
import strToSnakeCase from '../strToSnakeCase';
import loop from '../loop';
import isFunction from '../isFunction';
import strCapitalizeFirst from '../strCapitalizeFirst';
import Promise from 'bluebird';

export function actionTypeToActionCreator(type:string):RxActRed.ActionCreator{
	return function actionCreator(payload:any,meta:any,err?:Error):RxActRed.Action{
		let error = false;
		if(err){payload = err;}
		if(payload instanceof Error){error = true;}
		return { type, payload, meta, error }
	}
}

const SkipError = new Error('SKIP');

export function actionTypeToAsyncActionCreator<T>(asyncFn:RxActRed.AsyncActionProcessor<T>,successAction:RxActRed.ActionCreator,startedAction:RxActRed.ActionCreator,errorAction:RxActRed.ActionCreator):RxActRed.ActionCreator{
	return function asyncActionCreator(payload:any,meta:any,err:any):RxActRed.AsyncAction{
		return function asyncAction(dispatch,getState):RxActRed.Thenable<any>{
			const actions = 
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
			let error = false;
			if(err){payload = err;}
			if(payload instanceof Error){error = true;}
			if(error){
				actions.error(payload,meta);
				return Promise.reject(payload);
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
}

export function combineProcessorsToReducer<T>(initialState:T,processors:RxActRed.ActionProcessors,errorReducer?:RxActRed.ActionProcessor<T>):RxActRed.Reducer<T>{
	return function reducer(state:T=initialState,action:RxActRed.Action):T{
		const {type,payload,meta,error} = action;
		const actionProcessor = (error && errorReducer) ? errorReducer : processors[type];
		if(!actionProcessor){return state;}
		const ret = actionProcessor(state,payload,meta,type);
		if(!ret){return state;}
		return assign(state,ret); 
	}
}

export function combineReducersToReducer<T>(initialState:T,reducers:RxActRed.Reducers,namesMap:RxActRed.NamesMap):RxActRed.Reducer<T>{
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

export function makeSyncReducer<T>(reducerName:string,state:T,actionsConf:RxActRed.ActionReducerActions,actions:RxActRed.Actions={}):RxActRed.ActionReducerTuple<T>{
	
	state = state || <T>{};
	const mainType = reducerName ? strToSnakeCase(reducerName) : '';
	const reducers:RxActRed.ActionProcessors = {};
	let errorReducer;

	if(isFunction(actionsConf)){
		reducers[mainType] = actionsConf;
		const actionCreator = actionTypeToActionCreator(mainType);
		actions[reducerName] = actionCreator;
	}else{
		loop(actionsConf,function(actionProcessor,actionName){
			if(actionName == 'error'){
				errorReducer = actionProcessor;
			}
			const actionType = strToSnakeCase(actionName);
			const type = mainType ? `${mainType}_${actionType}` : actionType;
			const actionCreator = actionTypeToActionCreator(type);
			const name = `${reducerName}${strCapitalizeFirst(actionName)}`;
			reducers[type] = actionProcessor;
			actions[name] = actionCreator;
		});
	}

	const reducer = combineProcessorsToReducer(state,reducers,errorReducer);
	return [reducer,actions,state];
}

export function makeAsyncReducer<T>(reducerName:string,asyncFn:RxActRed.AsyncActionProcessor<T>,state:T,actionsConf:RxActRed.ActionReducerActions,actions:RxActRed.Actions={}):RxActRed.ActionReducerTuple<T>{

	state = state || <T>{}; 
	const mainType = reducerName ? strToSnakeCase(reducerName) : '';
	const type_start = mainType;
	const type_success = `${mainType}_SUCCESS`;
	const type_error = `${mainType}_ERROR`;
	const type_started = `${mainType}_STARTED`;
	const started =  actionTypeToActionCreator(type_started)
	const error = actionTypeToActionCreator(type_error)
	const success = actionTypeToActionCreator(type_success)

	actions[`${reducerName}Started`] = started;
	actions[`${reducerName}Error`] = error;
	actions[`${reducerName}Success`] = success;

	const start = actionTypeToAsyncActionCreator(asyncFn,success,started,error);
	actions[`${reducerName}Start`] = start;
	actions[reducerName] = start;

	const reducers:RxActRed.ActionProcessors = {};

	if(isFunction(actionsConf)){
		reducers[type_success] = actionsConf;
	}else{
		const {success,error,started} = actionsConf;
		reducers[type_success] = success;
		reducers[type_started] = started;
		reducers[type_error] = error;
	}

	const reducer = combineProcessorsToReducer(state,reducers);
	
	return [reducer,actions,state]
}

export function makeCombinedReducer(conf,actions:RxActRed.Actions={}):RxActRed.ActionReducerTuple<any>{

	const reducers:RxActRed.Reducers = {};
	const namesMap:RxActRed.NamesMap = {};
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

export function ActionsReducers(conf,reducerName:string='',allActions:RxActRed.Actions={}):RxActRed.ActionReducerTuple<any>{
	if(!conf){
		throw new Error(`no configuration`);
	}
	if(Array.isArray(conf)){return conf;}
	if('actions' in conf){
		if('async' in conf){
			const {async,state,actions} = conf;
			return makeAsyncReducer(reducerName,async,state,actions,allActions);
		}
		const {state,actions} = conf;
		return makeSyncReducer(reducerName,state,actions,allActions);
	}
	return makeCombinedReducer(conf,allActions);
}

export function Store(create?:RxActRed.StoreCreator,process?:RxActRed.StoreProcessor){

	if(!process){
		process = function(store,edit){
			const {state,add,addMany,remove,update,toggle} = store;
			return {
				state
			,	actions:
				{ add, addMany, remove, update, toggle }	
			}
		}
	}

	if(!create){
		create = function(newId,payload){
			return assign({id:newId},payload);
		}
	}

	const state = 
		{
			ids:[]
		,	byId:[]
		}
	function add(state,payload,meta?)
		{
			const len = state.ids.length || 1;
			const newId = (state.ids[len - 1] + 1) || 0;
			return (
				{ ids: state.ids.concat(newId)
				, byId: 
					[ ...state.byId
					,	create(newId,payload,state.byId)
					]
				}
			);
		}

	function addMany(state,payload,meta){
		const list = payload.list;
		list.forEach(function(el){
			state = add(state,el,meta);
		})
		return state;
	}

	function remove(state,payload)
		{
			return (
				{ ids: state.ids.filter((id) => id !== payload.id)
				, byId: state.byId.filter(el => el.id !== payload.id)
				}
			);
		}

	function edit(state,id,fn)
		{
			return (
				{ byId:
					state.byId.map
						( el => 
							( el.id === id ) ? fn(el) : el
						)
				}
			)
		}

	function update(state,payload)
		{
			return edit(state,payload.id,(el)=>assign(el,payload)); 
		}

	function toggle(state,payload)
		{
			const propName = payload.prop;
			return edit(state,payload.id,(el)=>assign(el,{[propName]: !el[propName]}));
		}

	const props = {
		state, add, addMany, remove, update, toggle
	}

	return process(props,edit);
}
