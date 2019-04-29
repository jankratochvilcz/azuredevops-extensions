import React from "react";
import UserStoryCommentEditor from "./UserStoryCommentEditor";
import userShape from "../reducers/models/userShape";

import "./UserStoryDiscussion.less";

const UserStoryDiscussion = ({ user }) => (
    <div className="user-story-discussion">
        <UserStoryCommentEditor user={user} />
    </div>
);

UserStoryDiscussion.propTypes = {
    user: userShape.isRequired
};


export default UserStoryDiscussion;
