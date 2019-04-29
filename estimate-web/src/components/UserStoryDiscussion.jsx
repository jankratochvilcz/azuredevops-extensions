import React from "react";
import UserStoryCommentEditor from "./UserStoryCommentEditor";
import userShape from "../reducers/models/userShape";

import "./UserStoryDiscussion.less";
import workItemShape from "../reducers/models/workItemShape";

const UserStoryDiscussion = ({ user, workItem }) => (
    <div className="user-story-discussion">
        <UserStoryCommentEditor workItem={workItem} user={user} />
    </div>
);

UserStoryDiscussion.propTypes = {
    user: userShape.isRequired,
    workItem: workItemShape.isRequired
};


export default UserStoryDiscussion;
