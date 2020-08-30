import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://eventsapp-4d16f.firebaseio.com"
});

export {
    axiosInstance
};