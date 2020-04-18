import React, { useContext } from "react";

import ThemeContext from "../../context/theme-context";
import { DEFAULT_THEME } from "../../helpers/constants";

import "./Modal.css";

const Modal = props => {
    const themeContext = useContext(ThemeContext);
    
    const { title, children, actionButtonText, closeModal, onFormSubmit, authenticated } = props;

    return (
        <div className="modalContainer">
            <h2 className={`title bg-${themeContext.themeColor || DEFAULT_THEME}`}>
                {title}
            </h2>
            <form className="p-3" onSubmit={(e) => e.preventDefault()}>
                {children}
                <div className="buttonContainer">
                    <button 
                        className={`btn btn-${themeContext.themeColor || DEFAULT_THEME}`}
                        onClick={closeModal}>Close</button>
                    {
                        actionButtonText
                            ? (
                                <button 
                                    className={`btn btn-${themeContext.themeColor}`}
                                    onClick={onFormSubmit}
                                    disabled={!authenticated || actionButtonText === "Booked"}>{actionButtonText}
                                </button>
                            )
                            : null
                    }                    
                </div>
            </form>
        </div>
    );
};

export default Modal;