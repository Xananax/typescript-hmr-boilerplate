import buildOptions from './buildOptions';
import setFlags from './setFlags';

export default function flagsToConfig
	( O:WPACK.ENV
	)
	{
		return buildOptions(setFlags(O));
	};

export 
	{ buildOptions
	, setFlags
	}