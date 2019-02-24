import { combineReducers } from "redux";
import devOps from "./devOps";
import enums from "./enums";
import connection from "./connection";

const rootReducer = combineReducers({
    devOps,
    enums,
    connection
});

export default rootReducer;
