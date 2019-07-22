import React, { Component } from "react";
import { PropTypes } from "prop-types";

import {
    TextField,
    Persona,
    PersonaSize,
    PrimaryButton,
    Spinner,
    Label,
    FontSizes
} from "office-ui-fabric-react";

import { connect } from "react-redux";
import userShape from "../reducers/models/userShape";
import { requestWorkItemAddComment } from "../actions/devops";
import workItemShape from "../reducers/models/workItemShape";

import "./UserStoryCommentEditor.less";

const ENTER_KEY = 13;

class UserStoryCommentEditor extends Component {
    state = {
        comment: "",
        // We're keeping the workItem in state so we can detect when the workItem
        // changes to reset the comment
        workItem: undefined
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.workItem !== prevState.workItem) {
            // Clear comment when workItem changes
            return { comment: "", workItem: nextProps.workItem };
        }
        return null;
    }

    onCommentChanged = (e, comment) => {
        this.setState({ comment });
    };

    onEditorKeyDown = e => {
        // We need to call this because React reuses synthetic events
        // (in which it wraps the keydown event)
        // by pooling them. Calling persist() removes the event from the pool
        e.persist();
        if (e.ctrlKey && e.keyCode === ENTER_KEY) {
            this.onAddComment();
        }
    };

    onAddComment = () => {
        const { addComment } = this.props;
        const { comment } = this.state;

        addComment(comment);

        this.setState({ comment: "" });
    };

    render() {
        const { user, workItem } = this.props;
        const { comment } = this.state;

        const { addingComment } = workItem;

        const showAddButton = addingComment || comment.length > 0;

        return (
            <div className="user-story-comment-editor user-story-comment-grid-item">
                <Persona
                    key={user.id}
                    size={PersonaSize.size32}
                    imageUrl={user.imageUrl}
                    hidePersonaDetails
                />
                <TextField
                    placeholder="Share your thoughts..."
                    onChange={this.onCommentChanged}
                    value={comment}
                    onKeyDown={this.onEditorKeyDown}
                    resizable={false}
                    multiline={comment.length > 0}
                    autoAdjustHeight
                />
                {showAddButton && (
                    <PrimaryButton
                        onClick={this.onAddComment}
                        className="add-button"
                    >
                        <span>Add Comment</span>
                        {addingComment && <Spinner className="adding-spinner" />}
                    </PrimaryButton>
                )}
                {showAddButton && <Label className="save-shortcut-hint" style={{ fontSize: FontSizes.small }}>Ctrl+Enter to submit</Label>}
            </div>
        );
    }
}

UserStoryCommentEditor.propTypes = {
    user: userShape.isRequired,
    workItem: workItemShape.isRequired,
    addComment: PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch, ownProps) => ({
    addComment: comment => dispatch(requestWorkItemAddComment(ownProps.workItem.id, comment))
});

export default connect(null, mapDispatchToProps)(UserStoryCommentEditor);
