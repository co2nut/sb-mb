import {
  UPDATE_PROFILE,
} from './types';

export const updateProfile = (userInfo) => {
  return (dispatch) =>{
    dispatch({ type:UPDATE_PROFILE, payload: userInfo })
  }
}
