import './AddFriendInput.scss';

import React, { Component, PropTypes } from 'react';

export class AddFriendInput extends Component<any,any>{

  static propTypes:React.ValidationMap<any> = {
    friendsAdd: PropTypes.func.isRequired,
    name: PropTypes.string
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      name: this.props.name || ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({ name: e.target.value });
  }

  handleSubmit(e) {
    const name = e.target.value.trim();
    if (e.which === 13) {
      this.props.friendsAdd({name});
      this.setState({ name: '' });
    }
  }

  render() {
    return (
      <input
        type="text"
        autoFocus="true"
        className="form-control friendAddInput"
        placeholder="Type the namei of a friend"
        value={this.state.name}
        onChange={this.handleChange}
        onKeyDown={this.handleSubmit} />
    );
  }
}
