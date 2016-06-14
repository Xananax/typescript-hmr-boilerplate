const getConfig = require('./utils/getConfig');
const getOptions = require('./utils/getOptions');

function getClientProdConfig(CONSTS){
	CONSTS = CONSTS || {};
	CONSTS.PROD = true;
	CONSTS.DEV = false;
	CONSTS.BUILD_TYPE='client';
	return getConfig(CONSTS);
}

function getClientDevConfig(CONSTS){
	CONSTS = CONSTS || {};
	CONSTS.PROD = false;
	CONSTS.DEV = true;
	CONSTS.BUILD_TYPE='client';
	return getConfig(CONSTS);
}

function getServerProdConfig(CONSTS){
	CONSTS = CONSTS || {};
	CONSTS.PROD = true;
	CONSTS.DEV = false;
	CONSTS.BUILD_TYPE='server';
	return getConfig(CONSTS);
}

function getServerDevConfig(CONSTS){
	CONSTS = CONSTS || {};
	CONSTS.PROD = false;
	CONSTS.DEV = true;
	CONSTS.BUILD_TYPE='server';
	return getConfig(CONSTS);
}

getConfig.clientProd = getClientProdConfig;
getConfig.clientDev = getClientDevConfig;
getConfig.serverProd = getServerProdConfig;
getConfig.serverDev = getServerDevConfig;
getConfig.getOptions = getOptions;

module.exports = getConfig;