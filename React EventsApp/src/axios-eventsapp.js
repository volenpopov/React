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

    authenticate: (url, authData) => {
        return axiosInstance.post(url, authData);
    },

    getUserData: (token) => {
        return axiosInstance.post(constants.GET_USER_DATA_URL, { idToken: token })
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

    deleteEvent: (eventId, token) => {
        return axiosInstance.delete(`${constants.EVENTS_URL}/${eventId}.json`, {
            params: { auth: token }
        })
    },

    deleteAllBookingsForASpecificEvent: (eventId, token) => {
        return axiosInstance.delete(`${constants.BOOKINGS_URL}/${eventId}.json`, {
            params: { auth: token }
        });
    },

    getEvents: () => {
        return axiosInstance.get(`${constants.EVENTS_URL}.json`);
    },

    getEventsOrderedByCreator: (userId) => {
        return axiosInstance.get(`${constants.EVENTS_URL}.json`, {
            params: {
                orderBy: `"creator"`,
                equalTo: `"${userId}"`
            }
        });
    },

    createEvent: (event, imagesBase64Array, token) => {
        return axiosInstance.put(
            `${constants.EVENTS_URL}/${event.title.toLowerCase()}.json`,
            { ...event, images: imagesBase64Array },
            { params: { auth: token }}
        ); 
    },

    bookEvent: (eventId, newBooking, token) => {
        return axiosInstance.post(`${constants.BOOKINGS_URL}/${eventId}.json`,
            newBooking,
            { params: { auth: token }}
        );
    },
};

export {
    axiosInstance,
    eventsAppRequester
};