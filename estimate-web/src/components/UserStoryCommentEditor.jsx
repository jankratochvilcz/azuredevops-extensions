import React, { Component } from "react";
import { PropTypes } from "prop-types";

import {
    TextField, Persona, PersonaSize, PrimaryButton
} from "office-ui-fabric-react";

import "./UserStoryCommentEditor.less";
import { connect } from "react-redux";
import userShape from "../reducers/models/userShape";
import { requestWorkItemAddComment } from "../actions/devops";
import workItemShape from "../reducers/models/workItemShape";

class UserStoryCommentEditor extends Component {
    state = {
        comment: "",
        workItem: undefined
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.workItem !== prevState.workItem) {
            // Clear comment when workItem changes
            return { comment: "", workItem: nextProps.workItem };
        }
        return null;
    }

    onChange = (e, comment) => {
        this.setState({ comment });
    };

    render() {
        const { user, addComment, workItem } = this.props;
        const { comment } = this.state;
        return (
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
                    onChange={this.onChange}
                    value={comment}
                    multiline
                    autoAdjustHeight
                />
                <PrimaryButton onClick={() => addComment(workItem.id, comment)}>Add Comment</PrimaryButton>
            </div>
        );
    }
}

UserStoryCommentEditor.propTypes = {
    user: userShape.isRequired,
    workItem: workItemShape.isRequired,
    addComment: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
    addComment: (workItemId, comment) => dispatch(requestWorkItemAddComment(workItemId, comment))
});

export default connect(undefined, mapDispatchToProps)(UserStoryCommentEditor);
