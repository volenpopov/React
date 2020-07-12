import authReducer from "./auth";
import * as actionTypes from "../actions/actionTypes";

describe("auth reducer", () => {
    const initialState = {
        token: null,
        userId: null,
        userEmail: null,
        error: null,
        loading: false,
    };

    const testToken = "test token";
    const testUserId = "test user id";
    const testUserEmail = "test@gmail.com";
    const testError = "test error";
    
    it("should return the initial state when called with an action without an actionType", () => {
        expect(authReducer(undefined, {})).toEqual(initialState);
    });

    it("should set loading to true when authentication starts", () => {
        const { loading } = authReducer(undefined, { type: actionTypes.AUTH_START });
        
        expect(loading).toBeTruthy();
    });

    it("should set error to null when authentication starts", () => {
        const { error } = authReducer({
            ...initialState,
            error: testError
        }, { type: actionTypes.AUTH_START });
        
        expect(error).toBeNull();
    });

    it("should not change any prop other than loading and error on auth start", () => {
        const {
            token,
            userId,
            userEmail
        } = authReducer(initialState, { type: actionTypes.AUTH_START });

        expect(token).toEqual(initialState.token);
        expect(userId).toEqual(initialState.userId);
        expect(userEmail).toEqual(initialState.userEmail);
    });

    it("should set token to the token passed in the action on auth success", () => {   
        const { token } = authReducer(undefined, {
            idToken: testToken,
            type: actionTypes.AUTH_SUCCESS
        });
        
        expect(token).toBe(testToken);
    });

    it("should set userId to the userId passed in the action on auth success", () => {    
        const { userId } = authReducer(undefined, {
            userId: testUserId,
            type: actionTypes.AUTH_SUCCESS
        });
        
        expect(userId).toBe(testUserId);
    });

    it("should set userEmail to the userEmail passed in the action on auth success", () => {    
        const { userEmail } = authReducer(undefined, {
            email: testUserEmail,
            type: actionTypes.AUTH_SUCCESS
        });
        
        expect(userEmail).toBe(testUserEmail);
    });

    it("should set loading to false after successfull authentication", () => {
        const { loading } = authReducer({
            ...initialState,
            loading: true
        }, { type: actionTypes.AUTH_SUCCESS });
        
        expect(loading).toBeFalsy();
    });

    it("should set error to null after successfull authentication", () => {
        const { error } = authReducer({
            ...initialState,
            error: testError
        }, { type: actionTypes.AUTH_START });
        
        expect(error).toBeNull();
    });

    it("should set error to the action error when authentication fails", () => {
        const { error } = authReducer(undefined, {
            error: testError,
            type: actionTypes.AUTH_FAIL
        });

        expect(error).toBe(testError);
    });

    it("should set loading to false when authentication fails", () => {
        const { loading } = authReducer({
            ...initialState,
            loading: true
        }, { type: actionTypes.AUTH_FAIL });

        expect(loading).toBeFalsy();
    });

    it("should not change any prop other than error and loading when authenticaiton fails", () => {
        const {
            token,
            userId,
            userEmail
        } = authReducer(initialState, { type: actionTypes.AUTH_START });

        expect(token).toEqual(initialState.token);
        expect(userId).toEqual(initialState.userId);
        expect(userEmail).toEqual(initialState.userEmail);
    });

    it("should set token to null on logout", () => {
        const { token } = authReducer({
            ...initialState,
            token: testToken
        }, { type: actionTypes.AUTH_LOGOUT });

        expect(token).toBeNull();
    });

    it("should set userId to null on logout", () => {
        const { userId } = authReducer({
            ...initialState,
            userId: testUserId
        }, { type: actionTypes.AUTH_LOGOUT });

        expect(userId).toBeNull();
    });

    it("should set userEmail to null on logout", () => {
        const { userEmail } = authReducer({
            ...initialState,
            userEmail: testUserEmail
        }, { type: actionTypes.AUTH_LOGOUT });

        expect(userEmail).toBeNull();
    });

    it("should set loading to false on logout", () => {
        const { loading } = authReducer({
            ...initialState,
            loading: true
        }, { type: actionTypes.AUTH_LOGOUT });

        expect(loading).toBeFalsy();
    });

    it("should clear error on auth_clear_error", () => {
        const { error } = authReducer({
            ...initialState,
            error: testError
        }, { type: actionTypes.AUTH_CLEAR_ERROR });

        expect(error).toBeNull();
    });

    it("should not change any prop other than error when auth_clear_error", () => {
        const {
            token,
            userId,
            userEmail,
            loading
        } = authReducer({
            token: testToken,
            userId: testUserId,
            userEmail: testUserEmail,
            loading: false,            
            error: testError
        }, { type: actionTypes.AUTH_CLEAR_ERROR });

        expect(token).toEqual(testToken);       
        expect(userId).toEqual(testUserId);       
        expect(userEmail).toEqual(testUserEmail);       
        expect(loading).toEqual(loading);       
    });
});