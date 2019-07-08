import {
  PROFILE_NAME_CHANGED,
  UPDATE_PROFILE,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAIL,
  INIT_PROFILE,
  UPDATING_PROFILE,
  UPDATE_PROPERTYUNIT
 } from '../actions/types';

const INITIAL_STATE = {
  userInfo: {},
 };

export default(state = INITIAL_STATE, action) => {
  switch (action.type){
    case UPDATE_PROFILE:
      return { ...state,
        userInfo: action.payload
      };
    default:
      return state;
  }
};
