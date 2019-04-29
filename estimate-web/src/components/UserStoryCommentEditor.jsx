import React from "react";

import {
    TextField, Persona, PersonaSize, PrimaryButton
} from "office-ui-fabric-react";

import "./UserStoryCommentEditor.less";
import userShape from "../reducers/models/userShape";

const UserStoryCommentEditor = ({ user }) => (
    <div className="user-story-comment-editor">
        <Persona
            className="column-1"
            key={user.id}
            size={user.isConnected ? PersonaSize.size40 : PersonaSize.size24}
            imageUrl={user.imageUrl}
            hidePersonaDetails
        />
        <TextField
            className="column-2"
            placeholder="Share your thoughts..."
            multiline
            autoAdjustHeight
        />
        <PrimaryButton>Add Comment</PrimaryButton>
    </div>
);

UserStoryCommentEditor.propTypes = {
    user: userShape.isRequired
};

export default UserStoryCommentEditor;
