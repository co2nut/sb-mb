import { combineReducers } from 'redux';
import ProfileReducer from './ProfileReducer';
import FacilityReducer from './FacilityReducer';

export default combineReducers({
  profile: ProfileReducer,
  facility: FacilityReducer,
});
