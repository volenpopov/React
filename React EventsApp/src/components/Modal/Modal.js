import React, { useContext } from "react";

import ThemeContext from "../../context/theme-context";

import "./Modal.css";

const Modal = props => {
    const themeContext = useContext(ThemeContext);

    const { title, children, actionButtonText, closeModal, onFormSubmit, authenticated } = props;

    return (
        <div className="modalContainer">
            <h2 className={`title bg-${themeContext.themeColor}`}>{title}</h2>
            <form className="p-3" onSubmit={(e) => e.preventDefault()}>
                {children}
                <div className="buttonContainer">
                    <button 
                        className={`btn btn-${themeContext.themeColor}`}
                        onClick={closeModal}>Close</button>
                    <button 
                        className={`btn btn-${themeContext.themeColor}`}
                        onClick={onFormSubmit}
                        disabled={!authenticated || actionButtonText === "Booked"}>{actionButtonText}</button>
                </div>
            </form>
        </div>
    );
};

export default Modal;