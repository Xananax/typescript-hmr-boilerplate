import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from '../reducers'
import {InfoFetcher} from '../components/InfoFetcher'; 

function mapStateToProps(state) {
	return (
		{ api: state.api
		}
	);
}

function mapDispatchToProps(dispatch) {
	return (
		{ actions: bindActionCreators
				( actions
				, dispatch
				)
		}
	);
}

export default connect
	( mapStateToProps
	, mapDispatchToProps
	)(
		InfoFetcher
	);