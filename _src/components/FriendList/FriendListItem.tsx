import './FriendListItem.scss';

import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

export class FriendListItem extends Component<any,any> {

  static propTypes:React.ValidationMap<any> = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    starred: PropTypes.bool,
    friendsStar: PropTypes.func.isRequired,
    friendsRemove: PropTypes.func.isRequired
  };

  render () {
    return (
      <li className="friendListItem">
        <div className="friendInfos">
          <div><span>{this.props.name}</span></div>
        <div><small>xx friends in common</small></div>
        </div>
        <div className="friendActions">
          <button className="btn btn-default btnAction" onClick={() => this.props.friendsStar({id:this.props.id})}>
            <i className={classnames('fa', { 'fa-star': this.props.starred }, { 'fa-star-o': !this.props.starred })} />
          </button>
          <button className="btn btn-default btnAction" onClick={() => this.props.friendsRemove({id:this.props.id})}>
            <i className="fa fa-trash" />
          </button>
        </div>
      </li>
    );
  }
}
