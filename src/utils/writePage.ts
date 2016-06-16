import renderPage from './renderPage';
import configureStore  from '../store/configureStore';
import routes from '../routes';
import Page from '../components/Page';
import fs from 'fs';

const store = configureStore();

export default function writePage(url,destination){
	
	renderPage(url,routes,store,Page,function(err,status,markup){

		if(err){
			throw err;
		}

		if(status == 404){
			throw new Error(`Url \`${url}\` not found`);
		}
		
		console.log(markup)
		
	});

}