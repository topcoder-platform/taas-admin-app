/**
 * Reducer for `authUser`
 */
import _ from "lodash";
import * as ACTION_TYPE from "../actionTypes";

const initialState = {
  isLoggedIn: null,
  userId: null,
  handle: null,
  roles: [],
  authError: null,
};

const authInitialState = _.pick(initialState, [
  "isLoggedIn",
  "userId",
  "handle",
  "roles",
  "authError",
]);

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPE.AUTH_USER_SUCCESS:
      return {
        ...state,
        ...authInitialState,
        ...action.payload,
        isLoggedIn: true,
      };

    case ACTION_TYPE.AUTH_USER_ERROR:
      return {
        ...state,
        ...authInitialState,
        authError: action.payload,
      };

    default:
      return state;
  }
};

export default reducer;
