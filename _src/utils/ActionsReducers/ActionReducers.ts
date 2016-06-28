/// <reference path="./ActionReducers.d.ts" />

import strToSnakeCase from '../strToSnakeCase';
import loop from '../loop';
import combineReducersToReducer from './combineReducersToReducer';
import makeSyncReducerActions from './makeSyncReducerActions';
import isActionsConfig from './isActionsConfig';

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

export default function ActionsReducers(conf,reducerName:string='',allActions:RxActRed.Actions={}):RxActRed.ActionReducerTuple<any>{
	if(!conf){
		throw new Error(`no configuration`);
	}
	if(Array.isArray(conf)){return conf;}
	if(isActionsConfig(conf)){
		const {state,actions} = conf;
		return makeSyncReducerActions(reducerName,state,actions,allActions);
	}
	return makeCombinedReducer(conf,allActions);
}
