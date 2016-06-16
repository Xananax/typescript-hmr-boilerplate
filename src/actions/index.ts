import {ActionsReducers} from '../utils/ActionsReducers';
import API from './api';
import Friends from './friends';
import Notes from './notes';

let api = API;
let friends = Friends
let notes = Notes;

function makeActionsReducers(){
	return ActionsReducers({
		friends, api, notes	
	});
}

let actionsReducers = makeActionsReducers();


export default actionsReducers

if(__DEV__){
	if(module.hot){
		module.hot.accept
			( ['./api','./friends','./notes']
			, () => 
				{
					api = require('./api').default;
					friends = require('./friends').default;
					notes = require('./notes').default
					makeActionsReducers();
				}
			);
	}
}