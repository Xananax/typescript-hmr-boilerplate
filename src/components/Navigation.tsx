import React, { Component, PropTypes } from 'react';
import { Router, Route, Link, browserHistory } from 'react-router'


export class Navigation extends Component<any,any>{
	renderLinks(){
		const links = this.props.links;
		return links.map( 
			({to,label}) => 
				(
					<li key={to}>
						<Link to={to}>
							{label}
						</Link>
					</li>
				)
		);
	}
	render(){
		return (<div>
			<ul>
				{ this.renderLinks() }
			</ul>
		</div>)
	}
}