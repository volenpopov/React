import React, { Component } from 'react';

import './Courses.css';
import Course from '../Course/Course';

import { Route, Link } from 'react-router-dom';

class Courses extends Component {
    state = {
        courses: [
            { id: 1, title: 'Angular - The Complete Guide' },
            { id: 2, title: 'Vue - The Complete Guide' },
            { id: 3, title: 'PWA - The Complete Guide' }
        ]
    }

    render () {
        return (
            <div>
                <h1>Amazing Udemy Courses</h1>
                <section className="Courses">
                    {
                        this.state.courses.map( course => {
                            return <Link 
                                    to={{
                                        pathname: `/courses/${course.id}`,
                                        ids: this.state.courses.map(crs => crs.id),
                                        ...course    
                                    }}
                                    className="Course" 
                                    key={course.id}
                                    >{course.title}
                                </Link>;
                        } )
                    }                    
                </section>
                <Route path='/courses/:id' exact component={Course}/>                               
            </div>
        );
    }
}

export default Courses;