import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://burgerbuilder-6f349.firebaseio.com/'
});

export default instance;