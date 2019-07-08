import {
  UPDATE_FACILITY,
  SELECT_FACILITY,
  CONFIRM_FACILITY
 } from '../actions/types';

const INITIAL_STATE = {
  facilityInfo: {},
  facilitySelect: {},
  facilityConfirm: {},
 };

export default(state = INITIAL_STATE, action) => {
  switch (action.type){
    case UPDATE_FACILITY:
      return { ...state,
        facilityInfo: action.payload
      };
    case SELECT_FACILITY:
      return { ...state,
        facilitySelect: action.payload
      };
    case CONFIRM_FACILITY:
      return { ...state,
        facilityConfirm: action.payload
      };
    default:
      return state;
  }
};
