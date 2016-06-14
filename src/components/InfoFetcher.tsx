import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import {SimpleTextInput} from './SimpleTextInput';


export class InfoFetcher extends Component<any,any>{

	constructor(props, context) {
		super(props, context);

		this.state = 
			{ app_id: props.app_id || '538763172890689'
			, app_secret: props.app_secret || '60af21125a1d346c3cd171f8906e415f'
			, page_name: props.page_name || 'orient499'
			};

		this.handleSubmit = this.handleSubmit.bind(this);
	}

	getInput(name:string){
		return this.refs[name] as SimpleTextInput;
	}

	setValues(then?){
		const app_id = this.getInput('app_id').getValue();
		const app_secret = this.getInput('app_secret').getValue();
		const page_name = this.getInput('page_name').getValue();
		this.setState(
			{ app_id
			, app_secret
			, page_name
			}
		,	then
		)
	}

	handleSubmit(e) {
		this.setValues(()=>{
			const {app_id,app_secret,page_name} = this.state;
			this.props.actions.api({app_id,app_secret,page_name});
		})
	}	


	render(){
		const {api:{app_id,app_secret,page_name,answer}} = this.props;
		const s = this.state;
		return (<div>
			<SimpleTextInput name='app_id' ref='app_id' valid={app_id} value={s.app_id}/>
			<SimpleTextInput name='app_secret' ref='app_secret' valid={app_secret} value={s.app_secret}/>
			<SimpleTextInput name='page_name' ref='page_name' valid={page_name} value={s.page_name}/>
			<textarea disabled={true} value={JSON.stringify(answer)}/>
			<button onClick={this.handleSubmit}>fetch</button>
		</div>)
	}
}

