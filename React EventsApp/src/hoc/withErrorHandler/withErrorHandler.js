import React, { Component, Fragment } from "react";

import { logErrorToDb } from "../../axios-eventsapp";

import Modal from "../../components/Modal/Modal";
import Backdrop from "../../components/Backdrop/Backdrop";

import "./withErrorHandler.css";

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
                const {
                    baseURL,
                    data,
                    headers,
                    method,
                    url
                } = error.config;

                this.setState({
                    error,
                    errorInfo: {
                        baseURL,
                        data,
                        headers,
                        method,
                        url
                    },
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
                const { error, errorInfo } = this.state;

                this.logError(error, errorInfo);
            }
        }

        logError = (error, errorInfo) => {
            const userId = localStorage.getItem("userId");
            logErrorToDb(error, errorInfo, userId);
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
                content = (
                    <div className="unexpectedErrorPage">
                        <div>
                            <h1>Unexpected Error :(</h1>
                            <p>You can go back to our <a href="http://localhost:5000/">Homepage</a>.</p>
                        </div>                        
                    </div>
                );
            }

            return content;
        }
    }
}

export default withErrorHandler;