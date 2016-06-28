import extend from 'extend';
import getConfig from './config';
import 
	{ ENV_PRODUCTION
	, ENV_DEVELOPMENT 
	} from '../utils/consts';

export default function getWebConfigDevelopment
	( O:WPACK.ENV
	)
	{
		return getConfig
		( extend
			( true
			, { SERVER:true , ENV:ENV_DEVELOPMENT }
			, O
			)
		);
	}