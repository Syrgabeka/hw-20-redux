import { applyMiddleware, combineReducers, createStore } from "redux";
import { basketReduser } from "./reducers/basket-reduxer";
import { thunk } from "redux-thunk";

const rootReducer = combineReducers({
  basket: basketReduser,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));
