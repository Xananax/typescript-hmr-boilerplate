import extend from 'extend';
import getConfig from './config';
import 
	{ ENV_PRODUCTION
	, ENV_DEVELOPMENT 
	} from '../utils/consts';

export default function getWebConfigProduction
	( O:WPACK.ENV
	)
	{
		return getConfig
		( extend
			( true
			, { SERVER:false , ENV:ENV_PRODUCTION }
			, O
			)
		);
	}