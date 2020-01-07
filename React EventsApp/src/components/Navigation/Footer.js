import React from 'react';

const footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-dark">
            <div className="d-flex align-items-center" style={{height: '54px'}}>
                <p className="m-0 py-2 pl-3 text-white">EventsApp {currentYear}&reg;</p>
            </div>            
        </footer>
    );
};

export default footer;