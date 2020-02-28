import React, { useContext } from 'react';

import ThemeContext from '../../context/theme-context';

import './Modal.css';

const Modal = props => {
    const themeContext = useContext(ThemeContext);

    const { title, children, actionButtonText } = props;

    return (
        <div className="modalContainer">
            <h2 className={`title bg-${themeContext.themeColor}`}>{title}</h2>
            <form>
                {children}
                <div className="buttonContainer">
                    <button className={`btn btn-${themeContext.themeColor}`}>Close</button>
                    <button className={`btn btn-${themeContext.themeColor}`}>{actionButtonText}</button>
                </div>
            </form>
        </div>
    );
};

export default Modal;