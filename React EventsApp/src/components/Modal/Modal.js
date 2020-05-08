import React, { useContext } from "react";

import ThemeContext from "../../context/theme-context";
import { DEFAULT_THEME } from "../../helpers/constants";

import "./Modal.css";

const Modal = props => {
    const themeContext = useContext(ThemeContext);
    
    const { title, children, actionButtonText, closeModal, onFormSubmit, authenticated } = props;

    const headerStyle = title !== "Error"
        ? `bg-${themeContext.themeColor}`
        : "error";
    
    const closeButtonStyle = title !== "Error"
        ? `btn-${themeContext.themeColor}`
        : "error";

    return (
        <div className="modalContainer">
            <h2 className={`title ${headerStyle}`}>
                {title}
            </h2>
            <form className="p-3" onSubmit={(e) => e.preventDefault()}>
                {children}
                <div className="buttonContainer">
                    <button 
                        className={`btn ${closeButtonStyle}`}
                        style={
                            title === "Error"
                                ? { border: "2px solid black" }
                                : null
                        }
                        onClick={closeModal}
                        type="button"
                    >
                        Close
                    </button>
                    {
                        actionButtonText
                            ? (
                                <button 
                                    className={`btn  btn-${themeContext.themeColor}`}
                                    onClick={onFormSubmit}
                                    disabled={!authenticated || actionButtonText === "Booked"}
                                    type="button"
                                >
                                    {actionButtonText}
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