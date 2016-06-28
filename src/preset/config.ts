import buildOptions from '../buildOptions';
import buildConfig from '../buildConfig';

export default function getConfig
	( O:WPACK.ENV
	)
	{
		return buildConfig(buildOptions(O));
	}