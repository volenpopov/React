import axios from "axios";

import * as constants from "./helpers/constants";

const axiosInstance = axios.create({
    baseURL: "https://eventsapp-4d16f.firebaseio.com"
});

const eventsAppRequester = {
    logErrorToDb: (error, errorInfo, userId) => {
        return axiosInstance.post(`${constants.ERRORS_URL}.json`, {
            error: error.toString(),
            errorInfo,
            userId: userId || "",
            createdAt: new Date()
        });
    },

    getUserTheme: (userId, token) => {
        return axiosInstance.get(constants.USER_THEME_URL + `/${userId}.json`, {
            params: { auth: token }
        });
    },

    assignThemeToUser: (userId, token, theme) => {
        return axiosInstance.put(constants.USER_THEME_URL +`/${userId}.json`,
            { theme },
            { params: { auth: token } }
        );
    },

    getUserBookings: (token) => {
        return axiosInstance.get(`${constants.BOOKINGS_URL}.json`, {
            params: { auth: token }
        });
    },

    deleteUserBooking: (bookingId, eventName, token) => {
        return axiosInstance.delete(`${constants.BOOKINGS_URL}/${eventName}/${bookingId}.json`, {
            params: { auth: token }
        });
    },

    getEvents: () => {
        return axiosInstance.get(`${constants.EVENTS_URL}.json`);
    }
};

export {
    axiosInstance,
    eventsAppRequester
};