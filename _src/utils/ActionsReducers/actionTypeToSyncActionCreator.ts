/// <reference path="./ActionReducers.d.ts" />

import errToPayload from './errToPayload';
 
/**
 * Takes a string and returns an action creator.
 * The action returned by this action creator is FSA compliant
 * 
 * @param  {string} type
 * @returns (payload?:any,meta?:any,error?:Error|boolean)=>Action
 */
export default function actionTypeToSyncActionCreator(type:string):RxActRed.ActionCreatorSync{
	const actionCreator = <RxActRed.ActionCreatorSync>function(payload?:any,meta?:any,err?:Error|boolean):RxActRed.Action{
		let error = false;
		payload = errToPayload(payload,err);
		if(payload instanceof Error){error = true;}
		return { type, payload, meta, error }
	};
	actionCreator.start = actionCreator;
	actionCreator.type = type;
	return actionCreator;
}