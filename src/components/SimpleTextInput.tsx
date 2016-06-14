import React, { Component, PropTypes } from 'react';

let ids = 0;

interface SimpleInputProps{
	value?:string;
	name:string;
	id?:string;
	title?:string;
	valid?:boolean;
	className?:string;
}

interface SimpleInputState{
	value:string;
	id?:string;
}

const propTypes:React.ValidationMap<SimpleInputProps> = 
	{ value: PropTypes.string
	, name: PropTypes.string.isRequired
	, id: PropTypes.string
	, title: PropTypes.string
	, valid: PropTypes.bool
	, className: PropTypes.string
	};

export class SimpleTextInput extends Component<SimpleInputProps,SimpleInputState>{

	static propTypes = propTypes 

	constructor(props, context) {
		super(props, context);

		this.state = 
			{ value: this.props.value || ''
			, id:`input_${ids++}`
			};

		this.handleChange = this.handleChange.bind(this);
	}

	setValue(value:string=''){
		this.setState({value});
	}

	getValue():string{
		return this.state.value;
	}

	getValueAndClear():string{
		const value = this.state.value;
		this.setValue('');
		return value;
	}

	handleChange(e) {
		const {value} = e.target;
		this.setState({ value });
	}

	render(){
		const {name,title,valid,className} = this.props;
		const {value} = this.state;
		const isValid = valid ? '' : ' (field is invalid)';
		const inputLabel = (title || name)+isValid;
		const id = this.props.id || this.state.id;
		return (<div className={className}>
			<label htmlFor={id}>{inputLabel}</label>
			<input type="text" value={value} name={name} id={id} onChange={this.handleChange}/>
		</div>) 
	}
}