import './FriendList.scss';

import React, { Component, PropTypes } from 'react';
import {FriendListItem} from './FriendListItem';
import {AddFriendInput} from './AddFriendInput';

interface FriendListProps{
	friends:any[];
	actions:{
		friendsAdd:Function
	};
}

const propTypes:React.ValidationMap<any> = 
	{ friends: PropTypes.array.isRequired,
		actions: PropTypes.object.isRequired
	};


export class FriendList extends Component<FriendListProps,void>{

	static propTypes = propTypes;

	constructor(props?:FriendListProps,context?:any){
		super(props,context);
	}

	renderList() {
		return this.props.friends.map((friend) =>
			(
				<FriendListItem
					key={friend.id}
					id={friend.id}
					name={friend.name}
					starred={friend.starred}
					{...this.props.actions} />
			)
		);
	}

	render () {
		
		const {actions} = this.props;
		const list = this.renderList();

		return (
			<div className="friendListApp">
				<h1>Da Bro's List</h1>
				<AddFriendInput friendsAdd={actions.friendsAdd} />
				<ul className="friendList">
					{list}
				</ul>
			</div>
		);
	}
}
