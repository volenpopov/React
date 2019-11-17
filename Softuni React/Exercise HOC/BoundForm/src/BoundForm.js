import React, { Component } from 'react';

function stateFromChildren(children) {
    const inputs = {};

    React.Children.forEach(children, child => {
        if (child.type === 'input' && child.props.name) {            
           inputs[child.props.name] = '';
        }        
    });

    return inputs;
}

export default class BoundForm extends Component {
    constructor(props) {
        super(props);        
        this.state = stateFromChildren(this.props.children);
    }

    onChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }

    onSubmit = (event) => {
        event.preventDefault();
        this.props.onSubmit({...this.state});
    }

    render = () => {
        return (
            <form onSubmit={this.onSubmit}>
                {React.Children.map(this.props.children, child => {
                    if (child.type === 'input' && child.props.name) {
                        return React.cloneElement(child, {onChange: this.onChange, value: this.state[child.props.name], ...child.props});
                    }  
                    return child;
                })}
            </form>
        );
    }
}