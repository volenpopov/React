import axios from "axios";

import * as constants from "./helpers/constants";

const axiosInstance = axios.create({
    baseURL: "https://eventsapp-4d16f.firebaseio.com"
});

const logErrorToDb = (error, errorInfo, userId) => {
    return axiosInstance.post(`${constants.ERRORS_URL}.json`, {
        error: error.toString(),
        errorInfo,
        userId: userId || "",
        createdAt: new Date()
    });
};

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
};

const getUserBookings = (token) => {
    return axiosInstance.get(`${constants.BOOKINGS_URL}.json`, {
        params: { auth: token }
    });
};

const deleteUserBooking = (bookingId, eventName, token) => {
    return axiosInstance.delete(`${constants.BOOKINGS_URL}/${eventName}/${bookingId}.json`, {
        params: { auth: token }
    });
}

const getEvents = () => {
    return axiosInstance.get(`${constants.EVENTS_URL}.json`);
}

export {
    axiosInstance,
    getUserTheme,
    assignThemeToUser,
    logErrorToDb,
    getUserBookings,
    getEvents,
    deleteUserBooking
};