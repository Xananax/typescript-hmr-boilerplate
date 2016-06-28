/// <reference path="./ActionReducers.d.ts" />

import assign from '../assign';
import {SKIP} from './constants';
/**
 * Returns an object with that dispatches actions
 * @param  {RxActRed.Dispatch} dispatch
 * @param  {RxActRed.ActionCreatorSync} startedAction
 * @param  {RxActRed.ActionCreatorSync} successAction
 * @param  {RxActRed.ActionCreatorSync} errorAction
 * @returns RxActRed
 */
export default function mapActionsToDispatch
	( dispatch:RxActRed.Dispatch
	, startedAction:RxActRed.ActionCreatorSync
	, successAction:RxActRed.ActionCreatorSync
	, errorAction:RxActRed.ActionCreatorSync
	):RxActRed.AsyncActions
	{
		const actions:RxActRed.AsyncActions = 
			{ success:(payload,meta)=>dispatch(successAction(payload,meta))
			, started:(payload,meta)=>dispatch(startedAction(payload,meta))
			, error:(reason,meta)=>{
					const err:Error = (!(reason instanceof Error)) ? new Error(reason) : reason;
					const message = err.message;
					meta = meta ? assign(meta,{message}) : {message};
					dispatch(errorAction(err,meta))
					return Promise.reject(SKIP);
				}
			};
		return actions;
	}