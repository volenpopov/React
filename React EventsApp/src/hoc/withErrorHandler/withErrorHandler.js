import React, { Component, Fragment } from "react";

import Modal from "../../components/Modal/Modal";
import Backdrop from "../../components/Backdrop/Backdrop";

const withErrorHandler = ( WrappedComponent, axios ) => {
    return class extends Component {
        constructor(props) {
            super(props);

            this.state = { error: null };

            this.reqInterceptor = axios.interceptors.request.use(req => {
                this.setState({ error: null });
                return req;
            });

            this.respInterceptor = axios.interceptors.response.use(resp => resp, error => {
                this.setState({ error });
            });
        }

        componentWillUnmount() {
            axios.interceptors.request.eject(this.reqInterceptor);
            axios.interceptors.response.eject(this.respInterceptor);
        }

        closeModalHandler = () => {
            this.setState({ error: null });
        }        
        
        render() {
            const errorMessage = "An error occurred, please, try again or contact the support team.";
            
            const errorModal = (
                <div>
                    <Backdrop/>
                    <Modal title="Error" closeModal={this.closeModalHandler}>
                        <p>{ this.state.error ? errorMessage : null }</p>
                    </Modal>
                </div> 
            );            

            return (
                <Fragment>
                    { this.state.error ? errorModal : null}                    
                    <WrappedComponent { ...this.props }/>
                </Fragment>
            );
        }
    }
}

export default withErrorHandler;