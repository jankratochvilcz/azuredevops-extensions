import { combineReducers } from "redux";
import devOps from "./devOps";
import enums from "./enums";

const rootReducer = combineReducers({
    devOps,
    enums
});

export default rootReducer;
