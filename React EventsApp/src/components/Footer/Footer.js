import React, { useContext } from "react";
import ThemeContext from "../../context/theme-context";
import themeIcon from "../../resources/themeIcon.png";
import { THEMES_ARRAY } from "../../helpers/constants";
import "./Footer.css";

const Footer = () => {
    const themeContext = useContext(ThemeContext);
    const currentYear = new Date().getFullYear();

    return (
        <footer className={`bg-${themeContext.themeColor} mt-4 mt-sm-0`}>
            <div className="d-flex justify-content-between align-items-center" style={{height: "54px"}}>
                <p className={`m-0 py-2 pl-3 text-white`}>EventsApp {currentYear}&reg;</p>
                <div>
                    <p className="text-white d-inline">Theme </p>
                    <img src={themeIcon} alt="ThemeIcon" onClick={() => {
                        const indexOfCurrentlyActiveTheme = THEMES_ARRAY.indexOf(themeContext.themeColor);
                        
                        const indexOfNextTheme = indexOfCurrentlyActiveTheme < THEMES_ARRAY.length - 1
                            ? indexOfCurrentlyActiveTheme + 1
                            : 0;

                        themeContext.switchTheme(THEMES_ARRAY[indexOfNextTheme]);
                    }}/>
                </div>
            </div>            
        </footer>
    );
};

export default Footer;