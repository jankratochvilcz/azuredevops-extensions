import React, { Component } from "react";
import { PropTypes } from "prop-types";

import {
    TextField, Persona, PersonaSize, PrimaryButton, Spinner
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

    onAddClicked = () => {
        const { addComment } = this.props;
        const { comment } = this.state;

        addComment(comment);

        this.setState({ comment: "" });
    };

    render() {
        const { user, workItem } = this.props;
        const { comment } = this.state;

        const { addingComment } = workItem;

        return (
            <div className="user-story-comment-editor">
                <Persona
                    key={user.id}
                    size={PersonaSize.size40}
                    imageUrl={user.imageUrl}
                    hidePersonaDetails
                />
                <TextField
                    placeholder="Share your thoughts..."
                    onChange={this.onChange}
                    value={comment}
                    multiline
                    autoAdjustHeight
                />
                <PrimaryButton onClick={this.onAddClicked} className="add-button">
                    <span>Add Comment</span>
                    {addingComment && <Spinner className="adding-spinner" />}
                </PrimaryButton>
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
