import React, { Component } from 'react';

class Course extends Component {

    render() {
        let result = <h1>Course not found!</h1>;

        const currentId = +this.props.match.params.id;
        const ids = this.props.location.ids;

        if (ids) {
            if (ids.some(id => id === currentId)) {
                result = (
                    <div>
                        <h1>{this.props.location.title}</h1>
                        <p>You selected the Course with ID: <strong>{currentId}</strong></p>
                    </div>
                );
            }
        }        

        return (
            <div>{result}</div>
        )
    }
}

export default Course;
