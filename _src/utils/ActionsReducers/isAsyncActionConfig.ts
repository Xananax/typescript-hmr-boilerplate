/// <reference path="./ActionReducers.d.ts" />


export default function isAsyncActionConfig(thing:any):thing is RxActRed.AsyncActionConfig{
	return (
		thing &&
		('_' in thing) &&
		('success' in thing)
	)
}