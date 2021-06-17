import { combineReducers } from "redux";
import { reducer as toastrReducer } from "react-redux-toastr";
import authUserReducer from "hoc/withAuthentication/reducers";
import workPeriodsReducer from "store/reducers/workPeriods";

const reducer = combineReducers({
  authUser: authUserReducer,
  toastr: toastrReducer,
  workPeriods: workPeriodsReducer,
});

export default reducer;
