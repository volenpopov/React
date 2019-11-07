import React, { Component } from 'react';

import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Auxiliary/Auxiliary';

const withErrorHandler = (WrappedComponent, axios) => {
    return class extends Component {
        constructor(props) {
            super(props);

            this.state = {error: null};

            //Assigning the interceptors as properties, so
            //we can clean them up when unmounting the component
            //from the DOM and ensure no memory leaks
            this.reqInterceptor = axios.interceptors.request.use(req => {
                this.setState({error: null});
                return req;
            });

            this.respInterceptor = axios.interceptors.response.use(resp => resp, error => {
                this.setState({error: error});
            });
        }

        //Since the lifecycle hook componentWillMount will be deprecated
        //it is better to use the constructor:
        
        // componentWillMount() {
        //     axios.interceptors.request.use(req => {
        //         this.setState({error: null});
        //         return req;
        //     });

        //     axios.interceptors.response.use(resp => resp, error => {
        //         this.setState({error: error});
        //     });
        // }

        componentWillUnmount() {
            axios.interceptors.request.eject(this.reqInterceptor);
            axios.interceptors.response.eject(this.respInterceptor);
        }

        errorConfirmedHandler = () => {
            this.setState({error: null});
        }

        render() {
            return (
                <Aux>
                    <Modal show={this.state.error} modalClosed={this.errorConfirmedHandler}>
                        {this.state.error ? this.state.error.message : null}
                    </Modal>
                    <WrappedComponent {...this.props}/>
                </Aux>
            );     
        }
    }
}

export default withErrorHandler;