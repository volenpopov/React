import React from "react";

const themeContext = React.createContext({
    themeColor: null,
    switchTheme: () => {}
});

export default themeContext;