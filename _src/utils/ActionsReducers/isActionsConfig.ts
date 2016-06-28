/// <reference path="ActionReducers.d.ts" />

export default function isActionsConfig(thing:any):thing is RxActRed.ActionsConfig{

	return (
		thing &&
		('actions' in thing) &&
		('state' in thing)
	)

}