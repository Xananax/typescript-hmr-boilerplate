import config from './config';
import client_dev from './client.dev';
import client_prod from './client.prod';
import server_dev from './server.dev';
import server_prod from './server.prod';
import extend from 'extend';

export const client = 
	{ dev:client_dev
	, prod:client_prod
	}

export const server = 
	{ dev:server_dev
	, prod:server_prod
	}

const builds = extend
	( config
	, { client, server}
	);

export default config;