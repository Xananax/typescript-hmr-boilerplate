declare namespace RxActRed{

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
		error?:boolean;
		payload?:any;
		meta?:any;
	}

	export interface AsyncPassedActions{
		success:ActionCreator
		started:ActionCreator
		error:any
	}

	export interface AsyncActionProcessor<T>{
		(payload:any,meta?:any,getState?:GetState,actions?:AsyncPassedActions,dispatch?:Dispatch):Thenable<T>
	}

	export interface ActionError extends Action{
		error:boolean;
		payload:Error;
	}

	export interface AsyncAction{
		(dispatch:Dispatch,getState:GetState):Thenable<any>
	}

	export interface ActionCreator{
		(payload?:any,meta?:any,err?:Error):Action | AsyncAction;
	}
	export interface Reducer<T>{
		(state:T,action:Action):T
	}

	export interface ActionProcessor<T>{
		(state:T,payload?:any,meta?:any,type?:string):T
	}

	export interface Map<T>{
		[name:string]:T;
	}

	export interface NamesMap extends Map<string>{}

	export interface ActionProcessors extends Map<ActionProcessor<any>>{}

	export interface Reducers extends Map<Reducer<any>>{}

	export interface Actions extends Map<ActionCreator>{}

	export type ActionReducerActions = ActionProcessors | ActionProcessor<any>;

	export interface ActionReducerTuple<T> extends Array<any>{
		0:Reducer<any>;
		1:Actions;
		2:T;
	}

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
}