import { combineReducers } from "redux";

import applicationContext from "./applicationContext";
import team from "./team";
import user from "./user";
import iteration from "./iteration";
import workItem from "./workItem";
import vote from "./vote";
import enums from "./enums";

const rootReducer = combineReducers({
    applicationContext,
    team,
    user,
    iteration,
    workItem,
    vote,
    enums
});

export default rootReducer;
