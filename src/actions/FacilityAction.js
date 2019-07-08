import {
  UPDATE_FACILITY,
  SELECT_FACILITY,
  CONFIRM_FACILITY
} from './types';

export const updateFacility = (facilityInfo) => {
  return (dispatch) =>{
    dispatch({ type:UPDATE_FACILITY, payload: facilityInfo })
  }
}

export const selectFacility = (facility) => {
  return (dispatch) =>{
    dispatch({ type:SELECT_FACILITY, payload: facility })
  }
}

export const confirmFacility = (facilityConfirm) => {
  return (dispatch) =>{
    dispatch({ type:CONFIRM_FACILITY, payload: facilityConfirm })
  }
}
