import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  CLEAR_ERRORS,
  REGISTER_USER_REQUEST,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAIL,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAIL,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  UPDATE_PROFILE_FAIL,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_RESET,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PASSWORD_REQUEST,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PASSWORD_RESET,
  UPDATE_PASSWORD_FAIL,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL
} from "../Constants/userConstants";
import axios from "axios";

export const login = (email, password) => async (dispatch, getState) => {
  try {
    dispatch({ type: LOGIN_REQUEST });
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    const { data } = await axios.post(
      `/api/v1/login`,
      { email, password },
      config
    );
   
    window.localStorage.setItem("loggedUserDetails",JSON.stringify(data));
    window.localStorage.setItem("loggedStatus",true);

    dispatch({ type: LOGIN_SUCCESS, payload: data.user });
  } catch (error) {

    dispatch({ type: LOGIN_FAIL, payload: error.response.data.message});
  }
};

export const register = (userData) => async (dispatch, getState) => {
  console.log(userData);
  try {
    dispatch({ type: REGISTER_USER_REQUEST });
    const config = {
      headers: { "Content-Type": "multipart/form-data" },
    };

    const { data } = await axios.post(`/api/v1/register`, userData, config);
    dispatch({ type: REGISTER_USER_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({ type: REGISTER_USER_FAIL, payload: error.response.data.message });
  }
};

export const loadUser = () => async (dispatch, getState) => {

    try {
      dispatch({ type: LOAD_USER_REQUEST });
      const {data} = await axios.get(`/api/v1/me`);
      console.log(data);
      dispatch({ type: LOAD_USER_SUCCESS, payload: data.user });
    } catch (error) {
      dispatch({ type: LOAD_USER_FAIL, payload: error.response.data.message });
    }
  
};

export const logout = () => async (dispatch, getState) => {
  try {
    await axios.get("/api/v1/logout");
    dispatch({ type: LOGOUT_SUCCESS });
  } catch (error) {
    dispatch({ type: LOGOUT_FAIL, payload: error.response.data.message });
  }
};

// Update User Profile
export const updateProfile = (userData) => async (dispatch, getState) => {
  console.log("From update profile function ", userData);
  try {
    dispatch({ type: UPDATE_PROFILE_REQUEST });

    const config = {
      headers: { "Content-Type": "multipart/form-data" },
    };

    const { data } = await axios.put(`/api/v1/me/update`, userData, config);
    dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({ type: UPDATE_PROFILE_FAIL, payload:error.response.data.message });
  }
};
export const updatePassword = (password) => async (dispatch, getState) => {
  
  try {
    dispatch({ type: UPDATE_PASSWORD_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
    };

    const { data } = await axios.put(`/api/v1/password/update`, password, config);
    dispatch({ type: UPDATE_PASSWORD_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({ type: UPDATE_PROFILE_FAIL, payload:error.response.data.message });
  }
};


export const forgotPassword = (email) => async (dispatch, getState) => {
  try {
    dispatch({ type: FORGOT_PASSWORD_REQUEST });
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    const { data } = await axios.post(
      `/api/v1/password/forgot`,
        email,
      config
    );
   
   
    dispatch({ type: FORGOT_PASSWORD_SUCCESS, payload: data.message });
  } catch (error) {

    dispatch({ type: FORGOT_PASSWORD_FAIL, payload: error.response.data.message});
  }
};

//Clearing errors
export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};
