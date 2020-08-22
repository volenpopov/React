import * as actionTypes from "../actions/actionTypes";

const initialState = {
    token: null,
    userId: null,
    userEmail: null,
    error: null,
    loading: false,
    userInfoChecked: false
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_START:           
            return {
                ...state,
                error: null,
                loading: true
            };
        case actionTypes.AUTH_SUCCESS:
            return {
                ...state,
                token: action.idToken,
                userId: action.userId,
                userEmail: action.email,
                error: null,
                loading: false
            };
        case actionTypes.AUTH_FAIL:
            return {
                ...state,
                error: action.error,
                loading: false
            };
        case actionTypes.AUTH_LOGOUT:
            return {
                ...state,
                token: null,
                userId: null,
                userEmail: null,
                loading: false                
            };
        case actionTypes.AUTH_CLEAR_ERROR:
            return {
                ...state,
                error: null
            }
        case actionTypes.AUTH_CHECKSTATE_START: {
            return {
                ...state,
                userInfoChecked: false
            }
        }
        case actionTypes.AUTH_CHECKSTATE_FINISHED: {
            return {
                ...state,
                userInfoChecked: true
            }
        }
        default:
            return state;
    }
}

export default reducer;