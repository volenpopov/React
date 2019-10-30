import React, { Component } from 'react';

const withExceptionNotification = WrappedComponent => {
    return class extends Component {
        constructor(props) {
            super(props);
            this.state = {
                error: null,
                errorInfo: null
            };
        }

        componentDidCatch(error, errorInfo) {
            this.setState({
              error: error,
              errorInfo: errorInfo
            });
        }

        render() {
            if (this.state.errorInfo) {
                const style = {
                    color: 'red'
                }
                
                return (
                    <h1 style={style}>Errorsdsa: {this.state.errorInfo}</h1>
                );
            }

            return <WrappedComponent/>;
        }
    }
}

export default withExceptionNotification;