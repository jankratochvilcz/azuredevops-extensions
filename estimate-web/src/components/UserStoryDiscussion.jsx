import React from "react";
import UserStoryCommentEditor from "./UserStoryCommentEditor";
import userShape from "../reducers/models/userShape";

import "./UserStoryDiscussion.less";
import workItemShape from "../reducers/models/workItemShape";
import UserStoryCommentList from "./UserStoryCommentList";

const UserStoryDiscussion = ({ user, workItem }) => (
    <div className="user-story-discussion">
        <UserStoryCommentEditor workItem={workItem} user={user} />
        <UserStoryCommentList workItem={workItem} />
    </div>
);

UserStoryDiscussion.propTypes = {
    user: userShape.isRequired,
    workItem: workItemShape.isRequired
};


export default UserStoryDiscussion;
