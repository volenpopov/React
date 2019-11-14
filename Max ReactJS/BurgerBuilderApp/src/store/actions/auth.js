import * as actionTypes from './actionTypes';
import axios from 'axios';

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
    localStorage.removeItem('userId');

    return {
        type: actionTypes.AUTH_LOGOUT
    }
}

export const checkAuthTimeout = expirationTime => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000);
    }
}

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}

export const authSuccess = (idToken, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken,
        userId
    }
}

export const authFail = error => {
    return {
        type: actionTypes.AUTH_FAIL,
        error
    }
}

export const auth = (email, password, isSignUp) => {
    return dispatch => {
        dispatch(authStart());

        const authData = {
            email,
            password,
            returnSecureToken: true
        }

        let url = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDOjaZhszxp9vkK7LyS28RroOwLL8ti0Xg";
        
        if (!isSignUp) {
            url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDOjaZhszxp9vkK7LyS28RroOwLL8ti0Xg";
        }
        
        axios.post(url, authData)
            .then(response => {
                const expirationTime = new Date(new Date().getTime() + response.data.expiresIn * 1000);

                localStorage.setItem('token',   response.data.idToken);
                localStorage.setItem('expirationTime', expirationTime);
                localStorage.setItem('userId', response.data.localId);

                dispatch(authSuccess(response.data.idToken, response.data.localId));
                dispatch(checkAuthTimeout(response.data.expiresIn));
            })
            .catch(error => {
                dispatch(authFail(error.response.data.error))
            });
    }
}

export const setAuthRedirectPath = path => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path
    }
}

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        const expirationTime = new Date(localStorage.getItem('expirationTime'));
        const userId = localStorage.getItem('userId');

        if (!token) {
            dispatch(logout());
        } else {

            if (expirationTime <= new Date()) {
                dispatch(logout());                
            } else {
                dispatch(authSuccess(token, userId));
                dispatch(checkAuthTimeout((expirationTime.getTime() - new Date().getTime()) / 1000));
            }            
        }
    }
}