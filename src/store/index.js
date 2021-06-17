/* global process */
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";
import reducer from "store/reducers";

const middlewares = [thunk];
if (process.env.APPMODE !== "production") {
  // @ts-ignore
  middlewares.push(createLogger());
}

const store = createStore(reducer, applyMiddleware(...middlewares));

export default store;
