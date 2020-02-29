import axios from "axios";
import * as actionTypes from "./actionTypes";
import * as constants from "../../helpers/constants";

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    localStorage.removeItem("userId");

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

export const clearError = () => {
    return { type: actionTypes.AUTH_CLEAR_ERROR };
}

export const authStart = () => {
    return { type: actionTypes.AUTH_START };
};

export const authSuccess = ( idToken, userId, email ) => {
    return { type: actionTypes.AUTH_SUCCESS, idToken, userId, email };
}

export const authFail = error => {
    return { type: actionTypes.AUTH_FAIL, error };
}

export const auth = ( email, password, login ) => {
    return dispatch => {
        dispatch(authStart());

        const authData = { email, password, returnSecureToken: true };

        const url = login ? constants.LOGIN_URL : constants.REGISTER_URL;

        axios.post(url, authData)
            .then(response => {
                const expirationTime = new Date(new Date().getTime() + response.data.expiresIn * 1000);

                localStorage.setItem("token", response.data.idToken);
                localStorage.setItem("expirationTime", expirationTime);
                localStorage.setItem("userId", response.data.localId);

                dispatch(authSuccess(response.data.idToken, response.data.localId, email));
                dispatch(checkAuthTimeout(response.data.expiresIn));                
            })
            .catch(error => {                
                dispatch(authFail(error.response.data.error));
            });
    };
}

export const authCheckState = () => {
    return dispatch => {
        dispatch(authStart());
        
        const token = localStorage.getItem("token");
        const expirationTime = new Date(localStorage.getItem("expirationTime"));
        const userId = localStorage.getItem("userId");

        if (!token) {
            dispatch(logout());
        } else {
            if (expirationTime <= new Date()) {
                dispatch(logout());                
            } else {                
                axios.post(constants.GET_USER_DATA_URL, { idToken: token })
                    .then(response => {                                        
                        dispatch(authSuccess(token, userId, response.data.users[0].email));
                        dispatch(checkAuthTimeout((expirationTime.getTime() - new Date().getTime()) / 1000));
                    })
                    .catch(() => {
                        dispatch(logout());
                    });                
            }            
        }
    }
}