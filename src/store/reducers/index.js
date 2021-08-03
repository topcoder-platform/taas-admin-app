import { combineReducers } from "redux";
import { reducer as toastrReducer } from "react-redux-toastr";
import authUserReducer from "hoc/withAuthentication/reducers";
import workPeriodsReducer from "store/reducers/workPeriods";
import rolesReducer from "store/reducers/roles";

const reducer = combineReducers({
  authUser: authUserReducer,
  toastr: toastrReducer,
  workPeriods: workPeriodsReducer,
  roles: rolesReducer,
});

export default reducer;
