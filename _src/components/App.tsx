import React, { Component, PropTypes } from 'react';
import {Navigation} from './Navigation';

interface AppProps{
	children:any
}

const links = 
	[	{ to:'/friendsList'
		, label:'friends'
		}
	, 	{ to:'/info'
		, label:'info'
		}
	, 	{ to:'/404'
		, label:'error'
		}
	];

export class App extends Component<AppProps,any>{
	
	static propTypes:React.ValidationMap<any> = {
		children: PropTypes.element.isRequired
	};

	render() {
		return (
			<div className="page-container">
				<Navigation links={links}/>
				{this.props.children}
			</div>
		);
	}
}
