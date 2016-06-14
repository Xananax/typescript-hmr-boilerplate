import './FriendListApp.scss';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actions } from '../reducers';
import {FriendList} from '../components/FriendList';

function mapStateToProps(state) {
	return (
		{ friends: state.friends.byId
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
		FriendList as any
	);
