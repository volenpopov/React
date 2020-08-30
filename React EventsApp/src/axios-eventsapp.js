import axios from "axios";

import * as constants from "./helpers/constants";

const axiosInstance = axios.create({
    baseURL: "https://eventsapp-4d16f.firebaseio.com"
});

const getUserTheme = (userId, token) => {
    return axiosInstance.get(constants.USER_THEME_URL + `/${userId}.json`, {
        params: { auth: token }
    });
};

const assignThemeToUser = (userId, token, theme) => {
    return axiosInstance.put(constants.USER_THEME_URL +`/${userId}.json`,
        {
            params: { auth: token }, 
            theme
        }
      );
}

export {
    axiosInstance,
    getUserTheme,
    assignThemeToUser
};