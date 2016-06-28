import { createStore, applyMiddleware, compose } from 'redux';
import {reducer as rootReducer} from '../actions';
import thunk from 'redux-thunk';

export default function getStore(initialState?:any){

	const enhancer = compose
		( applyMiddleware
			(
				thunk
			)
		);

	const store = createStore
		( rootReducer
		, initialState
		, enhancer
		);
	
	return store;
}