import React, { Component } from 'react';
import { Link } from 'react-router';

export default function PageNotFound(){
	return (
		<div className='container text-center'>
			<h1>404 - Page not found</h1>
			<hr />
			<Link to='/'>Back To Home View</Link>
		</div>
	);
}
