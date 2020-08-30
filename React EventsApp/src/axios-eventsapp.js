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

    getBookings: (token) => {
        return axiosInstance.get(`${constants.BOOKINGS_URL}.json`, {
            params: { auth: token }
        });
    },

    deleteBooking: (bookingId, eventName, token) => {
        return axiosInstance.delete(`${constants.BOOKINGS_URL}/${eventName}/${bookingId}.json`, {
            params: { auth: token }
        });
    },

    getEvents: () => {
        return axiosInstance.get(`${constants.EVENTS_URL}.json`);
    },

    createEvent: (event, imagesBase64Array, token) => {
        return axios.put(
            `${constants.EVENTS_URL}/${event.title.toLowerCase()}.json?auth=${token}`,
            { ...event, images: imagesBase64Array }
        ); 
    },

    bookEvent: (eventId, newBooking, token) => {
        return axios.post(`${constants.BOOKINGS_URL}/${eventId}.json?auth=${token}`, newBooking);
    },
};

export {
    axiosInstance,
    eventsAppRequester
};