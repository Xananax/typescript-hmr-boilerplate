import actionsReducers from './actions';

let [reducer,actions,state] = actionsReducers; 

export 
	{ actions
	, reducer
	, state
	};

if(__DEV__){
	if(module.hot){
		module.hot.accept
			( './actions'
			, () => [reducer,actions,state] = require('./actions').default
			);
	}
}