import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://eventsapp-4d16f.firebaseio.com'
});

export default instance;