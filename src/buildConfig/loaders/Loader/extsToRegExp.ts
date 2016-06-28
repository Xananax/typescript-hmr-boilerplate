

export default function extsToRegExp
	( extensions:string[]
	)
	{
		return new RegExp(`\\.(${extensions.join('|')})$`,'i');
	}

