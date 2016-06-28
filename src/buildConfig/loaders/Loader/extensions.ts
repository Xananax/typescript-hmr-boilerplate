import isString from '../../../utils/isString';

export default function extensions
	( $exts:string|string[]
	)
	{
	const exts = (isString($exts) ? [$exts] : $exts)
		.map(
			s => 
				s.replace(/^\./,'')
					.trim()
					.toLowerCase()
		)
	return exts;
}