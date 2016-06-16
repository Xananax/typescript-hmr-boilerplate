import renderPage from './renderPage';
import fs from 'fs';
import configureStore  from '../store/configureStore';
import {routes} from '../routes';
import {Page} from '../components/Page';

const store = configureStore();

export default function writePage(url:string,destination?:string,cb?,write:boolean=true){
	
	renderPage(url,routes,store,Page,function(err,status,markup){

		if(err){
			if(cb){
				return cb(err);
			}
			throw err;
		}

		if(status == 404){
			const err = new Error(`Url \`${url}\` not found`);
			if(cb){
				return cb(err);
			}
			throw err;
		}

		if(!destination){
			destination = url.replace(/^\//,'').replace(/\.html?$/,'')+'.html';
		}

		if(!write){
			if(cb){
				return cb(null,markup);
			}
			return markup;
		}

		if(cb){
			fs.writeFile(destination,markup,{encoding:'utf8'},function(err){
				if(err){return cb(err);}
				return cb(null,destination);
			});
			return true;
		}

		try{
			fs.writeFileSync(destination,markup,{encoding:'utf8'});
		}catch(err){
			return err;
		}

		return destination;
		
	});

}