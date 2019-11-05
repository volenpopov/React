import React, { Component } from 'react';

import classes from './Modal.css';
import Aux from '../../../hoc/Auxiliary/Auxiliary';
import Backdrop from '../Backdrop/Backdrop';

class Modal extends Component {

    //alternatively to shouldComponentUpdate we can
    //either extend a PureComponent or transform our
    //Modal to func component and use React.memo()
    //However both alternative ways will check also
    //this.props.modalClosed if it has changed, which
    //is unnecessary for our case
    shouldComponentUpdate( nextProps, nextState) {
        return (nextProps.show !== this.props.show ||
                nextProps.children !== this.props.children);
    }

    render() {
        return (
            <Aux>
                <Backdrop 
                    show={this.props.show}
                    clicked={this.props.modalClosed}/>
                <div 
                    className={classes.Modal}
                    style={{
                        transform: this.props.show ? 'translateY(0)' : 'translateY(-100vh)',
                        opacity: this.props.show ? '1' : '0'
                    }}>
                    {this.props.children}
                </div>
            </Aux>
        );
    }
}

export default Modal;