import React, { Component, Fragment } from "react";

import * as constants from "../../helpers/constants";

import Modal from "../../components/Modal/Modal";
import Backdrop from "../../components/Backdrop/Backdrop";

const withErrorHandler = ( WrappedComponent, axios ) => {
    return class extends Component {
        constructor(props) {
            super(props);

            this.state = {
                error: null,
                hasError: false,
                isNetworkError: false
            };

            this.respInterceptor = axios.interceptors.response.use(resp => resp, error => {
                this.setState({
                    error,
                    hasError: true,
                    isNetworkError: true
                });
            });
        }

        componentWillUnmount() {
            axios.interceptors.response.eject(this.respInterceptor);
        }

        static getDerivedStateFromError(error) {
            // Update state so the next render will show the fallback UI.
            return {
                error,
                hasError: true
            };
          }
        
        componentDidCatch(error, errorInfo) {
            this.logError(error, errorInfo);
        }

        componentDidUpdate(prevProps, prevState) {
            if (!prevState.isNetworkError && this.state.isNetworkError) {
                this.logError(this.state.error, "");
            }
        }

        logError = (error, errorInfo) => {
            const userId = localStorage.getItem("userId");

            axios.post(`${constants.ERRORS_URL}.json`, {
                error: error.toString(),
                errorInfo,
                userId: userId || "",
                createdAt: new Date()
            });
        }

        closeModalHandler = () => {
            this.setState({
                error: null,
                hasError: false,
                isNetworkError: false
            });
        }        
        
        render() {
            const {
                hasError,
                isNetworkError
            } = this.state;

            const errorMessage = "An error occurred, please, try again or contact the support team.";
            
            const errorModal = (
                <div>
                    <Backdrop/>
                    <Modal title="Error" closeModal={this.closeModalHandler}>
                        <p>{ errorMessage }</p>
                    </Modal>
                </div> 
            );            

            let content = <WrappedComponent { ...this.props }/>;

            if (hasError && isNetworkError) {
                content = (
                    <Fragment>
                        { errorModal }                    
                        <WrappedComponent { ...this.props }/>
                    </Fragment>
                );
            } else if (hasError && !isNetworkError) {
                content = <h1>Something went wrong</h1>;
            }

            return content;
        }
    }
}

export default withErrorHandler;