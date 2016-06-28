/// <reference path="./ActionReducers.d.ts" />

import assign from '../assign';
//import Promise from 'bluebird';
import actionTypeToSyncActionCreator from './actionTypeToSyncActionCreator';
import {SKIP} from './constants';
import mapAsyncActionsToDispatch from './mapAsyncActionsToDispatch';
import errToPayload from './errToPayload';

/**
 * Takes an async action and returns a thunk action creator 
 * 
 * @param  {(payload,meta,getState,actions)=>Promise} asyncFn
 * @param  {(payload,meta)=>Action} successAction
 * @param  {(payload,meta)=>Action} startedAction
 * @param  {(payload,meta)=>Action} errorAction
 * @returns (payload,meta,err)=>(dispatch,getState)=>Promise
 */
export default function actionTypeToAsyncActionCreator<T>(mainType:string,asyncFn:RxActRed.AsyncActionProcessor<T>):RxActRed.ActionCreatorAsync{
	
	const type_start = `${mainType}_START`;
	const type_success = `${mainType}_SUCCESS`;
	const type_error = `${mainType}_ERROR`;
	const type_started = `${mainType}_STARTED`;
	const startAction =  actionTypeToSyncActionCreator(type_start);
	const startedAction =  actionTypeToSyncActionCreator(type_started);
	const errorAction = actionTypeToSyncActionCreator(type_error);
	const successAction = actionTypeToSyncActionCreator(type_success);

	const asyncActionCreator = <RxActRed.ActionCreatorAsync>function(payload:any,meta:any,err:Error|boolean):RxActRed.AsyncAction{
		return function asyncAction(dispatch,getState):RxActRed.Thenable<any>{
			const actions = mapAsyncActionsToDispatch(dispatch,startedAction,successAction,errorAction);
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
					if(err == SKIP){return;}
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